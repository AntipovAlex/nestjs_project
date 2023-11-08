import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateFollow1699453696512 implements MigrationInterface {
    name = 'CreateFollow1699453696512'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "follovedId" TO "followedId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "follows" RENAME COLUMN "followedId" TO "follovedId"`);
    }

}
