import { Prop, Schema, } from '@nestjs/mongoose';
import { Types, SchemaTypes } from 'mongoose';

/**
 * Base class for MongoDB documents, defining common properties and configuration.
 *
 * @class AbstractDocument
 */
@Schema({
    versionKey: false
})
export class AbstractDocument {
     /**
     * Unique identifier for the document.
     */
    @Prop({ type: SchemaTypes.ObjectId })
    _id: Types.ObjectId
}