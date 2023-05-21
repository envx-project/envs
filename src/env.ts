import 'dotenv/config';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
    server: {
        DATABASE_URL: z.string(),
        NODE_ENV: z
            .enum(['development', 'production', 'test'])
            .default('development'),
        PORT: z.string().transform(port => parseInt(port, 10)).default('3000'),
    },
    clientPrefix: '',
    client: {},
    runtimeEnv: process.env,
});
