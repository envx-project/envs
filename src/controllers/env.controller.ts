import { Get, Post, Params, Body, Send, Delete, Router } from '@reflet/express';
import { db } from '@app/database';
import { decryptEnv, encryptEnv } from '@app/encryption';

@Router('/env')
export class EnvController {
    @Send({ status: 201 })
    @Post('/:userId/:name')
    async setEnv(
        @Params('userId') userId: string,
        @Body('password') password: string,
        @Params('name') name: string,
        @Body('value') value: string
    ) {
        const encryptedEnv = encryptEnv({
            userId,
            password,
            name,
            value,
        });

        if (!encryptedEnv) throw new Error('Failed to encrypt');

        // Save the encrypted env
        await db
            .insertInto('envs')
            .values(encryptedEnv)
            .onDuplicateKeyUpdate(encryptedEnv)
            .execute();
    }

    @Send()
    @Get('/:userId')
    async getAllEnvs(
        @Params('userId') userId: string,
        @Body('password') password: string,
    ) {
        const encryptedEnvs = await db
            .selectFrom('envs')
            .select('name')
            .select('iv')
            .select('salt')
            .select('data')
            .where('userId', '=', userId)
            .execute();

        const done = encryptedEnvs.map(encryptedEnv => ({
            name: encryptedEnv.name,
            value: decryptEnv(encryptedEnv, password),
        }));

        return done;
    }

    @Send()
    @Get('/:userId/:name')
    async getEnv(
        @Params('userId') userId: string,
        @Body('password') password: string,
        @Params('name') name: string
    ) {
        const encryptedEnv = await db
            .selectFrom('envs')
            .select('iv')
            .select('salt')
            .select('data')
            .where('userId', '=', userId)
            .where('name', '=', name)
            .executeTakeFirst();

        if (!encryptedEnv) throw new Error('Not found');

        return {
            name,
            value: decryptEnv(encryptedEnv, password),
        };
    }

    @Send()
    @Delete('/:userId/:name')
    async deleteEnv(
        @Params('userId') userId: string,
        @Params('name') name: string
    ) {
        await db
            .deleteFrom('envs')
            .where('userId', '=', userId)
            .where('name', '=', name)
            .execute();
    }
}
