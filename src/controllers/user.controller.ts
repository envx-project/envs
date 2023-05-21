import { Post, Send, Router } from '@reflet/express';
import { db } from '@app/database';
import { randomUUID } from 'crypto';

@Router('/user')
export class UserController {
    @Send()
    @Post('/')
    async createUser() {
        const id = randomUUID();

        try {
            // Save the user
            await db
                .insertInto('users')
                .values({
                    id,
                })
                .execute();
        } catch (error) {
            throw new Error('User ID already taken');
        }

        return {
            id,
        };
    }
}
