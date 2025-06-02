import { UserPermissionRequest } from "./user-permission-request.model";

export interface AddUserRequest {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    userName: string;
    password: string;
    roleId: string;
    userPermissions: UserPermissionRequest[];
}