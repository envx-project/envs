import 'reflect-metadata';
import createApp from 'express';
import { register } from '@reflet/express';
import { env } from '@app/env';
import { EnvController } from './controllers/env.controller';
import { UserController } from '@app/controllers/user.controller';
import { logger } from '@app/logger';

const app = createApp();
register(app, [UserController, EnvController]);

app.listen(env.PORT);

logger.info('Application started', {
    port: env.PORT,
});
