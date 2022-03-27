import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Reminder } from 'src/reminders/entities/reminder.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Collection {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  launchDate?: Date;

  @OneToMany(() => Reminder, (reminder) => reminder.collection)
  @Field((type) => [Reminder], { nullable: true })
  reminders?: Reminder[];
}
