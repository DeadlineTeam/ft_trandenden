
// import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
// import { User } from './user.entity'; // import your user entity
// // import { prisma } from './prisma.client'; // import the Prisma client

// @Injectable()
// export class UserIdPipe implements PipeTransform {
//   async transform(value: any, metadata: ArgumentMetadata) {
//     const user = await prisma.user.findOne({ where: { id: value } });
//     if (!user) {
//       throw new BadRequestException(`User with ID ${value} not found`);
//     }
//     return user;
//   }
// }