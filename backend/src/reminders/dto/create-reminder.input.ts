import { InputType, Int, Field } from '@nestjs/graphql';
import { IsDate, IsEmail } from 'class-validator';

@InputType()
export class CreateReminderInput {
  @Field((type) => Int)
  collectionId: number;

  @IsDate()
  @Field()
  dateTime: Date;

  @IsEmail()
  @Field()
  emailTo: string;

  @Field({ nullable: true, defaultValue: false })
  triggered?: boolean;
}
