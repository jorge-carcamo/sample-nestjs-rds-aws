import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { SecretsManager } from '@aws-sdk/client-secrets-manager';
import SecretConfig from './secret-config';
import { SecretConfiguration } from './secret-config.enum';

@Injectable()
export class SecretConfigService {
  constructor(
    @Inject(SecretConfig.KEY)
    private config: ConfigType<typeof SecretConfig>,
  ) {}

  getSecretConfig(key: string) {
    return this.config[key];
  }

  async getSecret(secretName: string, key: string): Promise<string> {
    let region = this.getSecretConfig(SecretConfiguration.REGION);
    let error: any;

    let client = new SecretsManager({
      region: region,
    });

    const secrets = await client
      .getSecretValue({ SecretId: secretName })
      .catch((err) => (error = err));

    if (error) {
      if (error.code === 'DecryptionFailureException')
        // Secrets Manager can't decrypt the protected secret text using the provided KMS key.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === 'InternalServiceErrorException')
        // An error occurred on the server side.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === 'InvalidParameterException')
        // You provided an invalid value for a parameter.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === 'InvalidRequestException')
        // You provided a parameter value that is not valid for the current state of the resource.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
      else if (error.code === 'ResourceNotFoundException')
        // We can't find the resource that you asked for.
        // Deal with the exception here, and/or rethrow at your discretion.
        throw error;
    } else {
      // Decrypts secret using the associated KMS CMK.
      // Depending on whether the secret is a string or binary, one of these fields will be populated.

      if ('SecretString' in secrets) {
        return JSON.parse(secrets.SecretString)[key];
      } else {
        let buff = new Buffer(secrets.SecretBinary, 'base64');
        return buff.toString('ascii');
      }
    }
  }
}
