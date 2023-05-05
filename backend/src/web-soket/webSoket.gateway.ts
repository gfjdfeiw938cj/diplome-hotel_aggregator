import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class SoketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  protected readonly logger = new Logger(SoketGateway.name);
  roomsId;

  @WebSocketServer()
  server: Server;

  handleConnection(client) {
    this.logger.log('New client connected');
    client.emit('connection', 'Successfully connected to server');
  }

  handleDisconnect() {
    this.logger.log('Client disconnected');
  }

  @SubscribeMessage('roomId')
  handles(client: Socket, data): void {
    this.server.socketsJoin(data);
    this.roomsId = data;
  }

  @OnEvent('sendMessage.*')
  @SubscribeMessage('message')
  message(msg: any) {
    this.server.emit('addmessage', msg);
  }
}
