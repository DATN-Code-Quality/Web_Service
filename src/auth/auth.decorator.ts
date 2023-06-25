import { SetMetadata } from '@nestjs/common';
import { Role, SubRole } from './auth.const';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

export const SUB_ROLES_KEY = 'subRoles';
export const SubRoles = (...subRoles: SubRole[]) =>
  SetMetadata(SUB_ROLES_KEY, subRoles);
