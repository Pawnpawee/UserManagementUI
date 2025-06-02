import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddUserRequest } from '../models/add-user-request.model';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';
import { Permission } from '../models/permission.model';
import { Role } from '../models/role.model';
import { User } from '../models/user.model';
import { UpdateUser } from '../models/update-user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http : HttpClient) { }

  addUser(model : AddUserRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiBaseUrl}/api/users`, model);
  }

  getAllPermissions() : Observable<Permission[]> {
    return this.http.get<Permission[]>(`${environment.apiBaseUrl}/api/users/permissions`);
  }

  getAllRoles() : Observable<Role[]> {
    return this.http.get<Role[]>(`${environment.apiBaseUrl}/api/users/roles`);
  }

  getAllUsers(query?:string, sortBy?: string , sortDirection?: string , pageNumber?: number , pageSize?: number ) : Observable<User[]> {
    let params = new HttpParams();

    if(query) {
      params = params.set('query' , query)
    }

    if(sortBy) {
      params = params.set('sortBy' , sortBy)
    }

    if(sortDirection) {
      params = params.set('sortDirection' , sortDirection)
    }

    if(pageNumber) {
      params = params.set('pageNumber' , pageNumber)
    }

    if(pageSize) {
      params = params.set('pageSize' , pageSize)
    }

    return this.http.get<User[]>(`${environment.apiBaseUrl}/api/users`,{
      params: params
    });
  }

  getUserCount(): Observable<number> {
    return this.http.get<number>(`${environment.apiBaseUrl}/api/users/count`);
  }

  getUserById(id: string) : Observable<User> {
    return this.http.get<User>(`${environment.apiBaseUrl}/api/users/${id}`);
  }

  updateUser(id: string, updateUser: UpdateUser) : Observable<User> {
    return this.http.put<User>(`${environment.apiBaseUrl}/api/users/${id}`,
    updateUser
    );
  }

  deleteUser(id: string) : Observable<User> {
    return this.http.delete<User>(`${environment.apiBaseUrl}/api/users/${id}`);
  }
}
