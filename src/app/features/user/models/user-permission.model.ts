import { Permission } from "./permission.model";

export interface UserPermission {
    id: string;
    userId: string;
    permissionId: string;
    permission: Permission;
    isReadable: boolean;
    isWritable: boolean;
    isDeletable: boolean;
    
}