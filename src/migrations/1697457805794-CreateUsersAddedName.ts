import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUsersAddedName1697457805794 implements MigrationInterface {
    name = 'CreateUsersAddedName1697457805794'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL DEFAULT 'Name'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}
