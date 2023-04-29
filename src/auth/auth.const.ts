import { SetMetadata } from '@nestjs/common';

export const jwtConstants = {
  secret:
    'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export enum SubRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
}
