import { Module } from '@nestjs/common';
import { AuthController } from './auths.controller';
import { AuthsService } from './auths.service';
import { HttpModule } from '@nestjs/axios';
@Module({
  imports: [HttpModule],
  providers: [AuthsService],
  controllers: [AuthController],
})
export class AuthsModule {}
