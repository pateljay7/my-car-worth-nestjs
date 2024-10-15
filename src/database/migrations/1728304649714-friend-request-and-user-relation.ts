import { MigrationInterface, QueryRunner } from 'typeorm';

export class FriendRequestAndUserRelation1728304649714
  implements MigrationInterface
{
  name = 'FriendRequestAndUserRelation1728304649714';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "friend" ("id" SERIAL NOT NULL, "userId" integer, "friendId" integer, CONSTRAINT "PK_1b301ac8ac5fcee876db96069b6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "friend_request" ("id" SERIAL NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "senderId" integer, "receiverId" integer, CONSTRAINT "PK_4c9d23ff394888750cf66cac17c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend" ADD CONSTRAINT "FK_855044ea856e46f62a46acebd65" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend" ADD CONSTRAINT "FK_d9bf438025ff9f7ae947596b38e" FOREIGN KEY ("friendId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_9509b72f50f495668bae3c0171c" FOREIGN KEY ("senderId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" ADD CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb" FOREIGN KEY ("receiverId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_470e723fdad9d6f4981ab2481eb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend_request" DROP CONSTRAINT "FK_9509b72f50f495668bae3c0171c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend" DROP CONSTRAINT "FK_d9bf438025ff9f7ae947596b38e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "friend" DROP CONSTRAINT "FK_855044ea856e46f62a46acebd65"`,
    );
    await queryRunner.query(`DROP TABLE "friend_request"`);
    await queryRunner.query(`DROP TABLE "friend"`);
  }
}
