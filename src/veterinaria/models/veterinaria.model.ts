import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Types, HydratedDocument } from 'mongoose';
import { string } from 'yup';

export interface RateType {
  userId: string;
  score: number;
}

export type VeterinariaDocument = HydratedDocument<Veterinaria>;

@Schema({ timestamps: true })
export class Veterinaria {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  userId: ObjectId;

  @Prop({ type: String, required: true })
  imagVet: string;

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

  @Prop({ type: string, required: true })
  certificatePdf: string;

  @Prop({ type: Boolean, default: false })
  isVerified: boolean;

  @Prop({ type: Array, default: [] })
  rate: RateType[];

  @Prop({ type: Number, default: 0 })
  averageScore: number;
}

export const VeterinariaSchema = SchemaFactory.createForClass(Veterinaria);
