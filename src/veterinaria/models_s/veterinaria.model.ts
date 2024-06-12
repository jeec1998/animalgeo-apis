import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types, type HydratedDocument } from 'mongoose';

export type VeterinariaDocument = HydratedDocument<Veterinaria>;

@Schema({ timestamps: true })
export class Veterinaria {
  @Prop({ type: Types.ObjectId, ref: 'User'})
 userId: ObjectId;
  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String, required: true })
  lastName: string;

  @Prop({ type: String, unique: true, required: true })
  email: string;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Buffer, required: true })
  certificatePdf: Buffer; 

  @Prop({ type: String, required: true })
  veterinaryName: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Number, required: true })
  latitude: number;

  @Prop({ type: Number, required: true })
  longitude: number;

  @Prop({ type: String, required: true })
  veterinaryContactNumber: string;
}


export const VeterinariaSchema = SchemaFactory.createForClass(Veterinaria);
