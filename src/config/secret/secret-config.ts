import { registerAs } from '@nestjs/config';

export default registerAs('secret', () => ({
  secretName: process.env.VAR_ARN_SECRET_MANAGER,
  awsRegion: process.env.VAR_AWS_REGION,
}));
