import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './features/public/dashboard/dashboard.component';
import { DocumentsComponent } from './features/public/documents/documents.component';
import { EditUserComponent } from './features/user/edit-user/edit-user.component';
import { AddUserComponent } from './features/user/add-user/add-user.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'documents',
    component: DocumentsComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
