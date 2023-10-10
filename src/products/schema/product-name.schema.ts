
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductNameDocument = HydratedDocument<ProductName>

@Schema({
    timestamps: true 
})
export class ProductName {
    @Prop()
    name: string;
    @Prop()
    code: string;
    @Prop()
    detail: string;
}

export const ProductNameSchema = SchemaFactory.createForClass(ProductName)