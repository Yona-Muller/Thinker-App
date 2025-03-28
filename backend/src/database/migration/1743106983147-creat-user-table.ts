import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreatUserTable1743106983147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: 'users',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          generationStrategy: 'uuid',
          default: 'uuid_generate_v4()',
        },
        {
          name: 'email',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'username',
          type: 'varchar',
          isNullable: false,
          isUnique: true,
        },
        {
          name: 'password',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'first_name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'last_name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'role',
          type: 'enum',
          enum: ['ADMIN', 'BUSINESS_MANAGER'],
          default: "'BUSINESS_MANAGER'",
        },
        {
          name: 'status',
          type: 'enum',
          enum: ['ACTIVE', 'INACTIVE'],
          default: "'ACTIVE'",
        },
        {
          name: 'otp_code',
          type: 'int',
          isNullable: true,
          default: null,
        },
        {
          name: 'otp_expiration',
          type: 'timestamp',
          isNullable: true,
          default: null,
        },
        {
          name: 'is_temporary_password',
          type: 'boolean',
          default: true,
        },
        {
          name: 'password_last_changed',
          type: 'timestamp',
          isNullable: true,
          default: null,
        },
        {
          name: 'temporary_password_expiry',
          type: 'int',
          isNullable: true,
          default: null,
        },
        {
          name: 'password_reset_token',
          type: 'varchar',
          isNullable: true,
          default: null,
        },
        {
          name: 'password_reset_expires',
          type: 'timestamp',
          isNullable: true,
          default: null,
        },
        {
          name: 'last_login',
          type: 'timestamp',
          isNullable: true,
          default: null,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'CURRENT_TIMESTAMP',
        },
      ],
    });

    await queryRunner.createTable(table);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
