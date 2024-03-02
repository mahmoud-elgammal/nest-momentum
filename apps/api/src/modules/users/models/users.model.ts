import { AbstractDocument } from "@app/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes } from "mongoose";

@Schema({ versionKey: false })
export class UserDocument extends AbstractDocument {

    @Prop({type: SchemaTypes.String, minlength: 3, required: true })
    firstName: string;

    @Prop({type: SchemaTypes.String, minlength: 3, required: true})
    lastName: string;

    @Prop({type: SchemaTypes.String, unique: true, index: true, required: true })
    email: string;

    @Prop({type: SchemaTypes.String, required: true })
    password: string;

    @Prop({type: SchemaTypes.Number, default: 0})
    version?: number;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
