import { Module } from '@nestjs/common';
import { SoketGateway } from './webSoket.gateway';

@Module({
  providers: [SoketGateway],
})
export class WebSoketModule {}
