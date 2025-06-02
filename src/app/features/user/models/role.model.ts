import { Permission } from "./permission.model";

export interface Role {
  roleId: string;
  roleName: string;
  permissionId: string;
  permission?: Permission;
}
