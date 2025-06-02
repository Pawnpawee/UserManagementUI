
import { Role } from './role.model';
import { UserPermission } from './user-permission.model';

export interface User {
  userId: string;         
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;        
  userName: string;
  password: string;
  roleId: string;
  role?: Role;           
  userPermissions: UserPermission[];
}
