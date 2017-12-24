import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabgroupComponent} from './components/tabgroup/tabgroup.component';
import {LoginComponent} from './components/login/login.component';


const routes: Routes = [
  { path: '', redirectTo: '/compare', pathMatch: 'full' },
  { path: 'compare', component: TabgroupComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
