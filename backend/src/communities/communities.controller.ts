import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { CommunitiesService } from './communities.service';
import { CreateCommunityDto, UpdateCommunityDto } from './dtos/community.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('communities')
export class CommunitiesController {
  constructor(private communitiesService: CommunitiesService) {}

  @Post()
  @UseGuards(JwtGuard)
  async create(
    @Body() createCommunityDto: CreateCommunityDto,
    @GetUser() user: any,
  ) {
    const community = await this.communitiesService.create(
      createCommunityDto,
      user.sub,
    );

    return {
      id: community.id,
      name: community.name,
      description: community.description,
      image: community.image,
      ownerId: community.ownerId,
      memberCount: community.memberCount,
    };
  }

  @Get()
  async findAll() {
    const communities = await this.communitiesService.findAll();

    return communities.map(community => ({
      id: community.id,
      name: community.name,
      description: community.description,
      image: community.image,
      ownerId: community.ownerId,
      memberCount: community.memberCount,
    }));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const community = await this.communitiesService.findById(id);

    return {
      id: community.id,
      name: community.name,
      description: community.description,
      image: community.image,
      ownerId: community.ownerId,
      memberCount: community.memberCount,
    };
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async update(
    @Param('id') id: string,
    @Body() updateCommunityDto: UpdateCommunityDto,
    @GetUser() user: any,
  ) {
    const community = await this.communitiesService.findById(id);

    if (community.ownerId !== user.sub) {
      return { error: 'Unauthorized' };
    }

    const updated = await this.communitiesService.update(
      id,
      updateCommunityDto,
    );

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      image: updated.image,
      ownerId: updated.ownerId,
      memberCount: updated.memberCount,
    };
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async delete(@Param('id') id: string, @GetUser() user: any) {
    const community = await this.communitiesService.findById(id);

    if (community.ownerId !== user.sub) {
      return { error: 'Unauthorized' };
    }

    await this.communitiesService.delete(id);
    return { message: 'Community deleted' };
  }
}
