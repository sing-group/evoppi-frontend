import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabgroupComponent} from './components/tabgroup/tabgroup.component';
import {LoginComponent} from './components/login/login.component';
import {UserManagerComponent} from './components/user-manager/user-manager.component';


const routes: Routes = [
  { path: '', redirectTo: '/compare', pathMatch: 'full' },
  { path: 'compare', component: TabgroupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'users', component: UserManagerComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
