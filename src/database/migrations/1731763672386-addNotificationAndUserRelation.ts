import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1731763672386 implements MigrationInterface {
  name = 'Migrations1731763672386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create ENUM type for notification type
    await queryRunner.query(
      `CREATE TYPE "public"."notification_type_enum" AS ENUM('friend-request', 'post-like', 'comment', 'generic')`,
    );

    // Create notification table
    await queryRunner.query(
      `CREATE TABLE "notification" (
        "id" SERIAL NOT NULL,
        "type" "public"."notification_type_enum" NOT NULL DEFAULT 'generic',
        "data" json,
        "isRead" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "senderId" integer,
        "userId" integer,
        CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")
      )`,
    );

    // Add foreign key for senderId
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_c0af34102c13c654955a0c5078b" 
      FOREIGN KEY ("senderId") REFERENCES "user"("id") 
      ON DELETE SET NULL ON UPDATE CASCADE`,
    );

    // Add foreign key for userId
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" 
      FOREIGN KEY ("userId") REFERENCES "user"("id") 
      ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_c0af34102c13c654955a0c5078b"`,
    );

    // Drop notification table
    await queryRunner.query(`DROP TABLE "notification"`);

    // Drop ENUM type for notification type
    await queryRunner.query(`DROP TYPE "public"."notification_type_enum"`);
  }
}
