# sample-nestjs-rds-aws
Source code sample on NestJs, Typeorm and deployment on AWS with Serverless Framework. Use RDS, Secrets, KMS, Api Gateway and Cognito.

## Architecture
![image](https://user-images.githubusercontent.com/88357997/166266391-4016e093-2bdd-4200-8c6b-e4e8c9ec53c5.png)

## Stack
- **Node**: 14.17.0
- **npm**: 6.14.6
- **NestJS**: 8.0.0
- **yarn**: 1.22.5
- **Serverless Framework**: 2.69.0

## Database
To test with databases on AWS, create a RDS compatible **MySQL , Postgres or SQL-Server** and assign it connection parameters like **Secrets Manager** secrets. The secret's mandatory keys must be the following:

- **username**
- **password**
- **port**
- **database**
- **host**

Eventually, secrets can be encrypted with **Key Management Service**, this setup is transparent to source code and nothing needs to be added.

To change the type of database engine you want to connect to, modify the following lines of code in the **createTypeOrmOptions function** from the **src/config/database/database-config.service.ts file**.

```
  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    return {
      type: 'mysql', // choose database type link: https://typeorm.io/#/connection-options ie: mssql, postgres, cassandra, etc
      host: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.HOST,
      ),
      port: parseInt(
        await this.secretConfigService.getSecret(
          this.getSecretConfig(SecretConfiguration.SECRET_NAME),
          DatabaseConfiguration.PORT,
        ),
        10,
      ),
      username: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.USERNAME,
      ),
      password: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.PASSWORD,
      ),
      database: await this.secretConfigService.getSecret(
        this.getSecretConfig(SecretConfiguration.SECRET_NAME),
        DatabaseConfiguration.DATABASE,
      ),
      entities: ['src/**/*{.entity.ts}'],
      autoLoadEntities:
        (await this.getDatabaseConfig(
          DatabaseConfiguration.AUTOLOAD_ENTITIES,
        )) === 'true',
      synchronize:
        (await this.getDatabaseConfig(DatabaseConfiguration.SYNCHRONIZE)) ===
        'true',
    };
  }
```

## Environment Variables
To test locally looking at the database in AWS, define the following environment variables and settings according to type database to test:

```
VAR_SECRET_MANAGER=Secrets ARN
VAR_KEY_KMS=KMS ARN with which the Secret is encrypted
VAR_COGNITO=Cognito userpool ARN
VAR_AWS_REGION=AWS account region
VAR_AUTOLOAD_ENTITIES =If true, entities will be loaded automatically
VAR_SYNCHRONIZE =If true, automatically loaded models will be synced
```
