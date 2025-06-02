import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AddUserRequest } from '../models/add-user-request.model';
import { UserService } from '../services/user.service';
import { Observable, Subscription } from 'rxjs';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: false,
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.css'
})
export class AddUserComponent implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<boolean>();

  model: AddUserRequest;
  userServicesSubscription?: Subscription;

  permissions?: Permission[];
  roles?: Role[];

  confirmPassword: string = '';

  constructor(private userServices: UserService , 
    private router : Router
  ) {
    this.model = {

      userId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      userName: '',
      password: '',
      roleId: '',
      userPermissions: []

    }
  }

  ngOnInit(): void {
    this.userServices.getAllPermissions().subscribe({
      next: (response) => {
        this.permissions = response;

        this.model.userPermissions = this.permissions.map(permission => ({
          permissionId: permission.permissionId,  // make sure your permissions have permissionId
          isReadable: false,
          isWritable: false,
          isDeletable: false,
        }))
      }
    });
    this.userServices.getAllRoles().subscribe({
      next: (response) => {
        this.roles = response;
      }
    });
    
  }

  passwordsMatch(): boolean {
    return this.model.password === this.confirmPassword;
  }


  onFormSubmit() {

    if (!this.passwordsMatch()) {
      alert('Passwords do not match!');
      return;
    }

    this.userServicesSubscription = this.userServices.addUser(this.model)
      .subscribe({
        next: (response) => {
          this.router.navigateByUrl('/');
          this.closeModal();
        }
      });

  }

  generateUserId(): void {
    this.model.userId = this.generateNewGuid();
  }

  private generateNewGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  ngOnDestroy(): void {
    this.userServicesSubscription?.unsubscribe();
  }

  closeModal(): void {
    this.close.emit(true);
  }

}
