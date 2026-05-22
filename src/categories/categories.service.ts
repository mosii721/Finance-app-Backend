import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(@InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
  @InjectRepository(User) private readonly userRepository: Repository<User>) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existUser = await this.userRepository.findOne({where:{id: createCategoryDto.userId}, select:{id:true}})

    if(!existUser) {
      throw new Error('This User does not exist')
    }

    const newCategory = this.categoryRepository.create({
      name: createCategoryDto.name,
      type: createCategoryDto.type,
      colour: createCategoryDto.colour,
      icon: createCategoryDto.icon,
      isDefault: createCategoryDto.isDefault,
      user: existUser,
    })
    return await this.categoryRepository.save(newCategory);
  }

  async findAll(name:string) {
    if(name) {
      return await this.categoryRepository.findOne({where:{name:name},
      select:{id:true, name:true, type:true, colour:true, isDefault:true, createdAt:true, updatedAt:true},
      relations:{user:true, transaction:true, budget:true}})
    }
    return await this.categoryRepository.find({relations:{user:true, transaction:true, budget:true}});
  }

  async findOne(id: string) {
    return await this.categoryRepository.findOneBy({id});
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    return await this.categoryRepository.update(id,updateCategoryDto);
  }

  async remove(id: string) {
    return await this.categoryRepository.delete(id);
  }
}
