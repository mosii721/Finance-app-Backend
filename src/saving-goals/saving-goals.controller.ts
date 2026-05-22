import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SavingGoalsService } from './saving-goals.service';
import { CreateSavingGoalDto } from './dto/create-saving-goal.dto';
import { UpdateSavingGoalDto } from './dto/update-saving-goal.dto';

@Controller('saving-goals')
export class SavingGoalsController {
  constructor(private readonly savingGoalsService: SavingGoalsService) {}

  @Post()
  create(@Body() createSavingGoalDto: CreateSavingGoalDto) {
    return this.savingGoalsService.create(createSavingGoalDto);
  }

  @Get()
  findAll(@Query('name') name:string) {
    return this.savingGoalsService.findAll(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.savingGoalsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSavingGoalDto: UpdateSavingGoalDto) {
    return this.savingGoalsService.update(id, updateSavingGoalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savingGoalsService.remove(id);
  }
}
