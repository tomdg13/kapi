import { MiddlewareConsumer } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class AppModule {
    private readonly connection;
    constructor(connection: DataSource);
    configure(consumer: MiddlewareConsumer): void;
}
