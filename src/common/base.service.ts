import { DeepPartial, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { OperationResult } from './operation-result';
import { plainToInstance, ClassConstructor } from 'class-transformer';

export class BaseService<Entity extends BaseEntity, Dto> {
  constructor(protected repo: Repository<Entity>) { }

  async create(cls: ClassConstructor<Dto>, createDto: Dto): Promise<OperationResult<any>> {
    var result: OperationResult<any>
    await this.repo.save(createDto as any)
      .then((savedDto) => {
        result = OperationResult.ok(plainToInstance(cls, savedDto, { excludeExtraneousValues: true }))

      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }

  async createMany(
    cls: ClassConstructor<Dto>,
    createDtos: Array<Dto>,
  ): Promise<OperationResult<any>> {
    var result: OperationResult<any>
    await this.repo.save(createDtos as DeepPartial<Entity>[])
      .then((savedDtos) => {
        result = OperationResult.ok(plainToInstance(cls, savedDtos, { excludeExtraneousValues: true }))

      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }

  async findAll(cls: ClassConstructor<Dto>): Promise<OperationResult<any>> {
    var result: OperationResult<any>
    await this.repo.findBy({})
      .then((dtos) => {
      console.log(dtos)

        result = OperationResult.ok(plainToInstance(cls, dtos, { excludeExtraneousValues: true }))
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })

      console.log(result)
    return result
  }

  async findOne(cls: ClassConstructor<Dto>, id: string): Promise<OperationResult<any>> {
    var result: OperationResult<any>
    await this.repo.findOneBy({
      id: id as any,
    })
      .then((dtos) => {
        if(dtos == null){
          result = OperationResult.fail(Error("Not found entity with id: " + id))
        }else{
          result = OperationResult.ok(plainToInstance(cls, dtos, { excludeExtraneousValues: true }))
        }

      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }

  async update(id: string, updateDto: Dto): Promise<OperationResult<any>>{
    var result: OperationResult<any>
    await this.repo.update(id, updateDto as any)
      .then(() => {
        result = OperationResult.ok("Update successfully")
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }

  async remove(id: string): Promise<OperationResult<any>> {
    var result: OperationResult<any>
    await this.repo.softDelete(id)
      .then((dtos) => {
        result = OperationResult.ok("Delete successfully")
      })
      .catch((err) => {
        result = OperationResult.error(err)
      })
    return result
  }
}

