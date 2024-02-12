import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserColums1707710226956 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE user ADD COLUMN first_name varchar(255);',
    );
    await queryRunner.query(
      'ALTER TABLE user ADD COLUMN last_name varchar(255);',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE user DROP COLUMN first_name;');
    await queryRunner.query('ALTER TABLE user DROP COLUMN last_name;');
  }
}
