// import { BadRequestException } from '@nestjs/common';

// export function validatePng(image: Express.Multer.File): boolean {
//   const maxSize = parseInt(process.env.IMAGE_MAX_SIZE);
//   const allowedType = 'image/png';
//   if (image.mimetype !== allowedType) {
//     throw new BadRequestException('File type must be png.');
//   }
//   if (image.size > maxSize) {
//     throw new BadRequestException('Image size must be less than 5 MB.');
//   }

//   return true;
// }
