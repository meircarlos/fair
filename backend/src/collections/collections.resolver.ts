import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.entity';
import { CreateCollectionInput } from './dto/create-collection.input';
import { UpdateCollectionInput } from './dto/update-collection.input';

@Resolver((of) => Collection)
export class CollectionsResolver {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Mutation(() => Collection)
  createCollection(
    @Args('createCollectionInput') createCollectionInput: CreateCollectionInput,
  ): Promise<Collection> {
    return this.collectionsService.create(createCollectionInput);
  }

  @Query(() => [Collection], { name: 'collections' })
  findAll(): Promise<Collection[]> {
    return this.collectionsService.findAll();
  }

  @Query(() => [Collection], { name: 'collectionsLaunched' })
  findAllLaunched(): Promise<Collection[]> {
    return this.collectionsService.findAllLaunched();
  }

  @Query(() => Collection, { name: 'collection' })
  findOne(@Args('id', { type: () => Int }) id: number): Promise<Collection> {
    return this.collectionsService.findOne(id);
  }

  @Mutation(() => Collection)
  updateCollection(
    @Args('updateCollectionInput') updateCollectionInput: UpdateCollectionInput,
  ) {
    return this.collectionsService.update(
      updateCollectionInput.id,
      updateCollectionInput,
    );
  }

  @Mutation(() => Boolean)
  async removeCollection(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    const remove = await this.collectionsService.remove(id);

    return Boolean(remove.affected);
  }
}
