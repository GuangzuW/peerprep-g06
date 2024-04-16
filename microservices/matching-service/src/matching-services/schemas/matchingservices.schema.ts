import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MatchingServicesDocument = Document & MatchingService;

/**
 * Represents a matching service.
 */
@Schema({ timestamps: true })
export class MatchingService {
  /**
   * The email associated with the matching service.
   */
  @Prop({ required: true })
  email: string;

  /**
   * The difficulty level of the matching service.
   */
  @Prop({ required: true })
  difficulty: string;

  /**
   * The category of the matching service.
   */
  @Prop({ required: true })
  category: string;
}

export const MatchingServicesSchema =
  SchemaFactory.createForClass(MatchingService);
