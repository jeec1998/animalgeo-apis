import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
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

  @Prop({ type: Boolean, default: false })
  isTwoFactorAuthenticationEnabled: boolean;

  @Prop({ type: String, default: '' })
  twoFactorAuthenticationSecret: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
