import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddYouTubeFields1737469468371 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("note_card", [
            new TableColumn({
                name: "thumbnailUrl",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "channelName",
                type: "varchar",
                isNullable: true
            }),
            new TableColumn({
                name: "channelAvatar",
                type: "varchar",
                isNullable: true
            })
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("note_card", [
            "thumbnailUrl",
            "channelName",
            "channelAvatar"
        ]);
    }
} 