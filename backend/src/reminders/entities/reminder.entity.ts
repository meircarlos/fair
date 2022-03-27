import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Collection } from '../../collections/entities/collection.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class Reminder {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;

  @Column()
  @Field((type) => Int)
  collectionId: number;

  @ManyToOne(() => Collection, (collection) => collection.reminders)
  @Field((type) => Collection)
  collection: Collection;

  @Column()
  @Field()
  dateTime: Date;

  @Column()
  @Field()
  emailTo: string;

  @Column({ default: false })
  @Field()
  triggered: boolean;
}
