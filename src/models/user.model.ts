import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {type HydratedDocument} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop({ type: String})
  userId: string;

  @Prop({ type: String, unique: true })
  email: string;

  @Prop({ type: Boolean, required: true })
  acceptTerms: boolean;

  @Prop({ type: Boolean })
  acceptContact: boolean;

  @Prop({ type: Date })
  expirationDate: Date;

  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: Boolean, default: false})
  isValidSubscription: boolean;

  @Prop({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  photoURL: string;

  @Prop({ type: Object })
  school: Record<string, any>;

  @Prop({ type: String, required: true })
  stripeId: string;

  @Prop({ type: Object })
  subjects: Record<string, any>;

  @Prop({ type: Boolean, default: true })
  enableComment: boolean;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String })
  resetPasswordToken: string;

  @Prop({type: Date, default: null})
  lastLoginAt: Date;

  @Prop({type: Date})
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);