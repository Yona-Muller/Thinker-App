import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity'; // נא לעדכן את הנתיב בהתאם למבנה הפרויקט שלך

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',                
      port: 5432,      
      username: 'postgres',    
      password: 'Shloimy-Yona',
      database: 'thinker_data',
      entities: [User],
      synchronize: false,
    }),
    UsersModule,
  ],
})
export class AppModule {}
