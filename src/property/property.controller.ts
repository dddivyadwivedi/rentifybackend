import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  Patch,
  ClassSerializerInterceptor,
  Query,
  ValidationPipe,
} from '@nestjs/common';

import { Property} from 'src/entity/property/property.entity';
import { PropertyService } from './property.service';
import { AuthGuard } from '@nestjs/passport';
import {
  CreatePropertyDTO,
  EditPropertyDTO,
  LikePropertyDto,
  InterestedEmailDTO,
  GetPropertyDTO,

} from './dto/property.dto';
import { GetUser } from 'src/auth/getuser.decorator';
import { User } from 'src/entity/user/user.entity';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRole } from 'src/entity/user/userRole.enum';

@Controller('property')
@UseInterceptors(ClassSerializerInterceptor)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async findAll(@Query(new ValidationPipe({ skipMissingProperties: false }))
  getPropertyDto: GetPropertyDTO,): Promise<{ properties: Property[]; count: number }> {
    return this.propertyService.getAllProperty(getPropertyDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  async findOne(@Param('id') id: number): Promise<Property> {
    return this.propertyService.getSingleProperty(id);
  }

  @Post()
  @UseGuards(AuthGuard() , new RolesGuard([UserRole.seller]))
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'bannerImage', maxCount: 1 }]),
  )
  async create(
    @Body() createPropertyDto: CreatePropertyDTO,
    @GetUser() user: User,
    @UploadedFiles() files,
  ): Promise<Property> {
  
    return this.propertyService.createProperty(
      createPropertyDto,
      user,
      files,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard() , new RolesGuard([UserRole.seller]))
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'bannerImage', maxCount: 1 }]),
  )
  async update(
    @Body() editPropertyDto : EditPropertyDTO,
    @Param('id') id: number,
    @GetUser() user: User,
    @UploadedFiles() files? : any,
  ): Promise<Property> {
    console.log('files' , files)
    return this.propertyService.updateProperty(
      editPropertyDto,
      user,
      id,
      files,
      
    );
  }


  @Post('/likeProperty')
  @UseGuards(AuthGuard() , new RolesGuard([UserRole.buyer]))
  async likeProperty(
    @Body() likePropertyDto: LikePropertyDto,
    @GetUser() user: User,
  ) {
    return this.propertyService.likeProperty(likePropertyDto, user);
  }


  @Post('/sendInterestEmail')
  @UseGuards(AuthGuard() , new RolesGuard([UserRole.buyer]))
  async interestedEmails(
    @Body() interestEmailDto: InterestedEmailDTO,
  
  ) {
    return this.propertyService.interestedEmails(interestEmailDto);
  }


  
}
