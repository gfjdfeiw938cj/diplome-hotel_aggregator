import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
export type UserDocument = User & Document;
import * as mongoose from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  public email: string;

  @Prop({ required: true })
  public password: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ default: '' })
  public contactPhone: string;

  @Prop({ required: true, default: 'client' })
  public role: string;

  _doc: any;
  _id: mongoose.Schema.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
