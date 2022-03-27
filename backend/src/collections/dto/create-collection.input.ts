import { InputType, Field } from '@nestjs/graphql';
import { IsDate, IsOptional } from 'class-validator';

@InputType()
export class CreateCollectionInput {
  @Field()
  name: string;

  @IsOptional()
  @IsDate()
  @Field({ nullable: true })
  launchDate?: Date;
}
