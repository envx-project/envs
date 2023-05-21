import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { UserController } from '@app/controllers/user.controller';

// Use var to avoid scoping issues with jest
var userId = jest.requireActual<typeof import('crypto')>('crypto').randomUUID();

jest.mock('crypto', () => ({
    randomUUID: () => userId,
}));

jest.mock('@app/database', () => ({
    db: {
        insertInto: jest.fn().mockReturnThis(),
        values: jest.fn().mockReturnThis(),
        execute: jest.fn(async () => undefined),
    }
}));

describe('UserController', () => {
    let userController: UserController;

    beforeEach(() => {
        userController = new UserController();
    });

    it('should create a new user', () => {
        expect(userController.createUser()).resolves.toStrictEqual({
            id: userId,
        });
    });
});
