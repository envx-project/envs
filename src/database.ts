import { CamelCasePlugin, Kysely } from 'kysely';
import { PlanetScaleDialect } from 'kysely-planetscale';
import { env } from '@app/env';
import { fetch } from 'undici';

export type EncryptedEnv = {
    id: string;
    userId: string;
    name: string;
    iv: string;
    salt: string;
    data: string;
};

type User = {
    id: string;
}

export type Database = {
    envs: EncryptedEnv;
    users: User;
};

export const db = new Kysely<Database>({
    dialect: new PlanetScaleDialect({
        url: env.DATABASE_URL,
        fetch,
    }),
    plugins: [
        new CamelCasePlugin(),
    ],
});
