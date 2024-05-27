import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Property } from 'src/entity/property/property.entity';
import { Like } from 'src/entity/likes/likes.entity';
import {
  CreatePropertyDTO,
  EditPropertyDTO,
  GetPropertyDTO,
  InterestedEmailDTO,
} from './dto/property.dto';
import { User } from 'src/entity/user/user.entity';
import { uploadToS3 } from 'src/utilities/script';
import { UserRole } from 'src/entity/user/userRole.enum';
import { BrevoService } from 'src/brevo/brevo.service';

@Injectable()
export class PropertyService {
  constructor(private brevoService: BrevoService) {}
  async getAllProperty(getPropertyDto: GetPropertyDTO): Promise<{ properties: Property[]; count: number }> {
    try {
      const { skip, limit, location, priceMin, priceMax, bedrooms, bathrooms } = getPropertyDto;
      
      const query = Property.createQueryBuilder('property');
  
      if (location) {
        query.andWhere('property.location = :location', { location });
      }
  
      if (priceMin !== undefined) {
        query.andWhere('property.price >= :priceMin', { priceMin });
      }
  
      if (priceMax !== undefined) {
        query.andWhere('property.price <= :priceMax', { priceMax });
      }
  
      if (bedrooms !== undefined) {
        query.andWhere('property.bedrooms = :bedrooms', { bedrooms });
      }
  
      if (bathrooms !== undefined) {
        query.andWhere('property.bathrooms = :bathrooms', { bathrooms });
      }
  
      const [properties, count] = await query
        .take(limit ? parseInt(limit) : null)
        .skip(skip ? parseInt(skip) : null)
        .orderBy('property.createdOn', 'DESC')
        .getManyAndCount();
  
      return { properties, count };
    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  


  async getSingleProperty(id: number): Promise<Property> {
    try {
      let singleProperty = await Property.findOne({
        where: { id: id },
        relations: ['likes'],
      });
      if (!singleProperty) {
        throw new Error('Property details does not found');
      }
      return singleProperty;
    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createProperty(
    createPropertyDto: CreatePropertyDTO,
    user: User,
    file: any,
  ): Promise<Property> {
    try {
      const {
        name,
        description,
        location,
        noOfBathrooms,
        noOfBedrooms,
        noOfHospitalsNearBy,
        price,
      } = createPropertyDto;
      let newProperty = new Property();
      newProperty.name = name;
      newProperty.description = description;
      newProperty.location = location;
      newProperty.noOfBathrooms = noOfBathrooms;
      newProperty.noOfBedrooms = noOfBedrooms;
      newProperty.noOfHospitalsNearBy = noOfHospitalsNearBy;
      newProperty.price = price;
      newProperty.seller = user;

      await newProperty.save();
      let uploadedBannerImageLink = await uploadToS3(
        file.bannerImage[0],
        `bannerImages/${name}`,
      );
      newProperty.propertyImageLink = uploadedBannerImageLink;
      await newProperty.save();
      return newProperty;
    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProperty(
    editPropertyDto: EditPropertyDTO,
    user: User,
    id: number,
    file?: any,
  ): Promise<Property> {
    try {
      let findProperty = await Property.findOne({
        where: { id: id, sellerId: user.id },
      });
      if (findProperty) {
        const {
          name,
          description,
          location,
          noOfBathrooms,
          noOfBedrooms,
          noOfHospitalsNearBy,
          price
        } = editPropertyDto;

        findProperty.name = name;
        findProperty.description = description;
        findProperty.location = location;
        findProperty.noOfBathrooms = noOfBathrooms;
        findProperty.noOfBedrooms = noOfBedrooms;
        findProperty.noOfHospitalsNearBy = noOfHospitalsNearBy;
        findProperty.price = price;
        findProperty.seller = user;
        await findProperty.save();
        await findProperty.save();
        if (Object.keys(file).length !== 0) {
          console.log('inside');
          let uploadedBannerImageLink = await uploadToS3(
            file.bannerImage[0],
            `bannerImages/${name}`,
          );
          findProperty.propertyImageLink = uploadedBannerImageLink;
          await findProperty.save();
        }
        return findProperty;
      }
      throw new Error('Property details not found');
    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async likeProperty(likePropertyDto: any, user: User) {
    try {
      const { propertyId, buyerId } = likePropertyDto;

      const buyer = await User.findOne({ where: { id: buyerId } });
      if (!buyer || buyer.role !== UserRole.buyer) {
        throw new Error('User is not a buyer or does not exist');
      }

      const property = await Property.findOne({ where: { id: propertyId } });
      if (!property) {
        throw new Error('Property does not exist');
      }

      const existingLike = await Like.findOne({ where: { buyerId: buyerId } });
      if (!existingLike) {
        const like = new Like();
        like.buyer = buyer;
        like.property = property;
        await like.save();
        return property;
      } else {
        throw new Error('You already liked this property');
      }
    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }


  async interestedEmails(interestedEmailDto: InterestedEmailDTO) {
    try {
      const { buyerId, sellerId, propertyId } = interestedEmailDto;
      let findProperty = await Property.findOne({
        where: { id: propertyId, sellerId: sellerId },
      });
      if (!findProperty) {
        throw new Error('Property not regstered with this seller');
      }
      let buyer = await User.findOne({ where: { id: buyerId } });
      console.log('buyer', buyer);

      let seller = await User.findOne({ where: { id: sellerId } });
      console.log('seller', seller);
      const mailOptionsToBuyer = {
        to: buyer.email,
        subject: `Interest in Property: ${findProperty.name}`,
        text: `Thank you for your interest in the property ${findProperty.name}.\nDescription: ${findProperty.description}`,
      };
      // Email to seller
      const mailOptionsToSeller = {
        to: seller.email,
        subject: `Interest in Your Property: ${findProperty.name}`,
        text: `Someone has shown interest in your property ${findProperty.name}.\nDescription: ${findProperty.description}`,
      };

      await this.brevoService.sendEmail(
        mailOptionsToBuyer.to,
        mailOptionsToBuyer.subject,
        mailOptionsToBuyer.text,
      );
      await this.brevoService.sendEmail(
        mailOptionsToSeller.to,
        mailOptionsToSeller.subject,
        mailOptionsToSeller.text,
      );
      return seller;
    } catch (err) {
      throw new HttpException(
        {
          errorCode: err.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
