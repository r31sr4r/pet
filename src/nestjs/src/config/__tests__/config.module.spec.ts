import { CONFIG_DB_SCHEMA } from '../config.module';
import * as Joi from 'joi';

function expectValidate(schema: Joi.Schema, value: any) {
    return expect(schema.validate(value, { abortEarly: false }).error.message);
}

describe('Schema Unit Tests', () => {
    describe('Config DB Schema', () => {
        const schema = Joi.object({
            ...CONFIG_DB_SCHEMA,
        });

        describe('DB_VENDOR', () => {
            test('invalid cases - required', () => {
                expectValidate(schema, {}).toContain('"DB_VENDOR" is required');
            });

            test('invalid cases - when value is not equal mysql | sqlite', () => {
                expectValidate(schema, { DB_VENDOR: 'invalid' }).toContain(
                    '"DB_VENDOR" must be one of [mysql, sqlite]',
                );
            });

            test('valida cases', () => {
                const arrange = ['mysql', 'sqlite'];

                arrange.forEach((value) => {
                    expectValidate(schema, { DB_VENDOR: value }).not.toContain(
                        '"DB_VENDOR" must be one of [mysql, sqlite]',
                    );
                });
            });
        });

        describe('DB_HOST', () => {
            test('invalid cases', () => {
                expectValidate(schema, {}).toContain('"DB_HOST" is required');

                expectValidate(schema, { DB_HOST: 1 }).toContain(
                    '"DB_HOST" must be a string',
                );
            });

            test('valid cases', () => {
                expectValidate(schema, { DB_HOST: 'localhost' }).not.toContain(
                    '"DB_HOST" is required',
                );
            });
        });

        describe('DB_DATABASE', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
                    '"DB_DATABASE" is required',
                );

                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
                    '"DB_DATABASE" is required',
                );

                expectValidate(schema, { DB_DATABASE: 1 }).toContain(
                    '"DB_DATABASE" must be a string',
                );
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_DATABASE: 'test' },
                    { DB_VENDOR: 'mysql', DB_DATABASE: 'test' },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain(
                        '"DB_DATABASE" is required',
                    );
                });
            });
        });

        describe('DB_USERNAME', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
                    '"DB_USERNAME" is required',
                );

                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
                    '"DB_USERNAME" is required',
                );

                expectValidate(schema, { DB_USERNAME: 1 }).toContain(
                    '"DB_USERNAME" must be a string',
                );
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_USERNAME: 'test' },
                    { DB_VENDOR: 'mysql', DB_USERNAME: 'test' },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain(
                        '"DB_USERNAME" is required',
                    );
                });
            });
        });

        describe('DB_PASSWORD', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
                    '"DB_PASSWORD" is required',
                );

                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
                    '"DB_PASSWORD" is required',
                );

                expectValidate(schema, { DB_PASSWORD: 1 }).toContain(
                    '"DB_PASSWORD" must be a string',
                );
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_PASSWORD: 'test' },
                    { DB_VENDOR: 'mysql', DB_PASSWORD: 'test' },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain(
                        '"DB_PASSWORD" is required',
                    );
                });
            });
        });

        describe('DB_PORT', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_VENDOR: 'sqlite' }).not.toContain(
                    '"DB_PORT" is required',
                );

                expectValidate(schema, { DB_VENDOR: 'mysql' }).toContain(
                    '"DB_PORT" is required',
                );

                expectValidate(schema, { DB_PORT: 'a' }).toContain(
                    '"DB_PORT" must be a number',
                );

                expectValidate(schema, { DB_PORT: 1.2 }).toContain(
                    '"DB_PORT" must be an integer',
                );
            });

            test('valid cases', () => {
                const arrange = [
                    { DB_VENDOR: 'sqlite' },
                    { DB_VENDOR: 'sqlite', DB_PORT: 3306 },
                    { DB_VENDOR: 'mysql', DB_PORT: 3306 },
                    { DB_VENDOR: 'mysql', DB_PORT: '10' },
                ];

                arrange.forEach((value) => {
                    expectValidate(schema, value).not.toContain(
                        '"DB_PORT" is required',
                    );
                });
            });
        });

        describe('DB_LOGGING', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_LOGGING: 'a' }).toContain(
                    '"DB_LOGGING" must be a boolean',
                );
            });

            test('valid cases', () => {
                const arrange = [true, false, 'true', 'false'];

                arrange.forEach((value) => {
                    expectValidate(schema, { DB_LOGGING: value }).not.toContain(
                        '"DB_LOGGING" must be a boolean',
                    );
                });
            });
        });

        describe('DB_AUTO_LOAD_MODELS', () => {
            test('invalid cases', () => {
                expectValidate(schema, { DB_AUTO_LOAD_MODELS: 'a' }).toContain(
                    '"DB_AUTO_LOAD_MODELS" must be a boolean',
                );
            });
            test('valid cases', () => {
                const arrange = [true, false, 'true', 'false'];

                arrange.forEach((value) => {
                    expectValidate(schema, { DB_AUTO_LOAD_MODELS: value }).not.toContain(
                        '"DB_AUTO_LOAD_MODELS" must be a boolean',
                    );
                });
            });

        });
    });
});
