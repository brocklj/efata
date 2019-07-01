import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuniqeRecordCheck1561906568783 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `CREATE INDEX UNIQUE unique_record ON record (date, client, reader)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP INDEX unique_record`);
  }
}
