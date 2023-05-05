import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type HotelDocument = Hotel & Document;

@Schema()
export class Hotel {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  public title: string;

  @Prop()
  public description: string;

  @Prop({ required: true, default: new Date() })
  public createdAt: Date;

  @Prop({ required: true, default: new Date() })
  public updatedAt: Date;

  @Prop({ default: [] })
  public images: string[];

  _doc: any;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
