import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Community } from './schemas/community.schema';
import { CreateCommunityDto, UpdateCommunityDto } from './dtos/community.dto';

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectModel(Community.name)
    private communityModel: Model<Community>,
  ) {}

  async create(
    createCommunityDto: CreateCommunityDto,
    ownerId: string,
  ): Promise<Community> {
    const { name, description, image } = createCommunityDto;

    const existing = await this.communityModel.findOne({ name });

    if (existing) {
      throw new BadRequestException('Community already exists');
    }

    const community = new this.communityModel({
      name,
      description,
      image: image || `https://placeholder.com/200?text=${name}`,
      ownerId,
      memberCount: 1,
    });

    return community.save();
  }

  async findAll(): Promise<Community[]> {
    return this.communityModel.find();
  }

  async findById(id: string): Promise<Community> {
    const community = await this.communityModel.findById(id);

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return community;
  }

  async update(
    id: string,
    updateCommunityDto: UpdateCommunityDto,
  ): Promise<Community> {
    const community = await this.communityModel.findByIdAndUpdate(
      id,
      updateCommunityDto,
      { new: true },
    );

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return community;
  }

  async delete(id: string): Promise<void> {
    const community = await this.communityModel.findByIdAndDelete(id);
    if (!community) {
      throw new NotFoundException('Community not found');
    }
  }

  async addMember(communityId: string): Promise<Community> {
    const community = await this.communityModel.findByIdAndUpdate(
      communityId,
      { $inc: { memberCount: 1 } },
      { new: true },
    );
    if (!community) {
      throw new NotFoundException('Community not found');
    }
    return community;
  }

  async removeMember(communityId: string): Promise<Community> {
    const community = await this.communityModel.findByIdAndUpdate(
      communityId,
      { $inc: { memberCount: -1 } },
      { new: true },
    );
    if (!community) {
      throw new NotFoundException('Community not found');
    }
    return community;
  }
}
