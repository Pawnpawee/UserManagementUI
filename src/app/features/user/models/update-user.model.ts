import { Role } from "./role.model";

export interface UpdateUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userName: string;
  roleId: string;
  password?: string | null;
  userPermissions: {
    isReadable: boolean;
    isWritable: boolean;
    isDeletable: boolean;
    permission: {
      permissionId: string;
      permissionName: string;
    }
  }[];
}
