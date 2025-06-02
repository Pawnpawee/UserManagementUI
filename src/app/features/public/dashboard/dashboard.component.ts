import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from 'app/features/user/models/user.model';
import { UserService } from 'app/features/user/services/user.service';
import { query } from 'express';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy {

  isAddUserModalOpen: boolean = false;
  isEditUserModalOpen: boolean = false;

  users?: User[];
  selectedUserId: string = '';

  deleteUserSubscription?: Subscription;

  pageNumber = 1;
  pageSize = 5;
  list: number[] = [];
  totalCount?: number;
  Math: any;

  constructor(private userServices: UserService) { }

  openAddUserModal(): void {
    this.isAddUserModalOpen = true;
  }

  closeAddUserModal(): void {
    this.isAddUserModalOpen = false;
    this.loadUsers();
  }

  openEditUserModal(userId: string): void {
    this.isEditUserModalOpen = true;
    this.selectedUserId = userId;
  }

  closeEditUserModal(): void {
    this.isEditUserModalOpen = false;
    this.loadUsers();
  }

  deleteUser(userId: string): void {
    if (userId) {
      this.deleteUserSubscription = this.userServices.deleteUser(userId)
        .subscribe({
          next: (response) => {
            this.loadUsers();
          }
        })
    }

  }

  loadUsers(): void {
    this.userServices.getUserCount()
      .subscribe({
        next: (value) => {
          this.totalCount = value;
          this.list = new Array(Math.ceil(value / this.pageSize))

        }
      })
      
    this.userServices.getAllUsers(undefined, undefined, undefined, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.users = response;
      }
    });
  }

  ngOnInit(): void {

    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.deleteUserSubscription?.unsubscribe();
  }

  OnSearch(query: string): void {
    this.userServices.getAllUsers(query, undefined, undefined, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.users = response;
      }
    });
  }

  Sort(sortBy: string, sortDirection: string) {
    this.userServices.getAllUsers(undefined, sortBy, sortDirection, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.users = response;
      }
    });
  }

  getPage(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.loadUsers();
  }

  getPrevPage() {

    if (this.pageNumber - 1 < 1) {
      return;
    }

    this.pageNumber -= 1;

    this.userServices.getAllUsers(undefined, undefined, undefined, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.users = response;
      }
    });
  }

  getNextPage() {

    if (this.pageNumber + 1 > this.list.length) {
      return;
    }

    this.pageNumber += 1;

    this.userServices.getAllUsers(undefined, undefined, undefined, this.pageNumber, this.pageSize).subscribe({
      next: (response) => {
        this.users = response;
      }
    });
  }

  onPageSizeChange(): void {
    this.pageNumber = 1;
    this.userServices.getUserCount().subscribe({
      next: (value) => {
        this.totalCount = value;
        this.list = new Array(Math.ceil(value / this.pageSize));
      }
    });
    this.loadUsers();
  }

  get rangeStart(): number {
    return (this.pageNumber - 1) * this.pageSize + 1;
  }

  get rangeEnd(): number {
    return Math.min(this.pageNumber * this.pageSize, this.totalCount || 0);
  }

}
