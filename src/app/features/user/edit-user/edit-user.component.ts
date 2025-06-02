import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from '../models/user.model';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { UserService } from '../services/user.service';
import { UpdateUser } from '../models/update-user.model';

@Component({
  selector: 'app-edit-user',
  standalone: false,
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<boolean>();
  @Input() userId: string | null = null;

  model?: User;
  permissions?: Permission[];
  roles?: Role[];
  selectedRole?: string;
  selectedPermission: {
    isReadable: boolean;
    isWritable: boolean;
    isDeletable: boolean;
    permission: {
      permissionId: string;
      permissionName: string;
    }
  }[] = [];

  newPassword?: string;

  confirmPassword: string = '';

  routeSubscription?: Subscription;
  updateUserSubscription?: Subscription;
  getUserSubscription?: Subscription;

  constructor(private route: ActivatedRoute,
    private userServices: UserService,
    private router: Router
  ) { }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.updateUserSubscription?.unsubscribe();
    this.getUserSubscription?.unsubscribe();
  }

  ngOnInit(): void {

    this.userServices.getAllPermissions().subscribe({
      next: (response) => {
        this.permissions = response;

      }
    });
    this.userServices.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response;
      }
    });

    //Get User from API
    if (this.userId) {
      this.getUserSubscription = this.userServices.getUserById(this.userId).subscribe({
        next: (response) => {

          this.model = response;

          console.log(this.model)

          this.selectedRole = response.role?.roleId;
          this.newPassword = response.password;

          console.log("permissions", this.permissions);
          console.log("userPermissions", response.userPermissions);


          if (this.permissions) {
            this.selectedPermission = this.permissions.map(permission => {
              const matched = response.userPermissions?.find(
                up => up.permission.permissionId === permission.permissionId
              );

              return {
                isReadable: matched?.isReadable ?? false,
                isWritable: matched?.isWritable ?? false,
                isDeletable: matched?.isDeletable ?? false,
                permission: {
                  permissionId: permission.permissionId,
                  permissionName: permission.permissionName
                }
              };
            });


          }

          console.log("selectedPermission", this.selectedPermission);
        }
      });
    }

  }

  passwordsMatch(): boolean {
    return this.newPassword === this.confirmPassword;
  }

  closeModal(): void {
    this.close.emit(true);
  }

  onUpdateSubmit(): void {
    if (this.model && this.userId) {
      var updateUser: UpdateUser = {
        firstName: this.model.firstName,
        lastName: this.model.lastName,
        email: this.model.email,
        phone: this.model.phone ?? '',
        userName: this.model.userName,
        roleId: this.selectedRole ?? '',
        password: this.newPassword || null,
        userPermissions: this.selectedPermission,
      };

      console.log(updateUser);


      this.updateUserSubscription = this.userServices.updateUser(this.userId, updateUser)
        .subscribe(
          {
            next: (reponse) => {
              this.closeModal();
            }
          }
        )
    }
  }

}
