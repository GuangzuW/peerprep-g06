import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MatchingRequestDocument = Document<MatchingRequest>;

/**
 * Represents a matching request.
 */
@Schema({ timestamps: true })
export class MatchingRequest {
  /**
   * The email associated with the matching request.
   */
  @Prop({ required: true })
  email: string;

  /**
   * The categories level of the matching request.
   */
  @Prop({ required: true })
  categories: string[];

  /**
   * The complexities of the matching request.
   */
  @Prop({ required: true })
  complexities: string[];

  /**
   * The request time of the matching request.
   */
  @Prop({ required: true })
  requestedAt: Date;
}

export const MatchingRequestSchema =
  SchemaFactory.createForClass(MatchingRequest);
