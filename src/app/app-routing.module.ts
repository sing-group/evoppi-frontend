/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2018 - Noé Vázquez González,
 *  Miguel Reboiro-Jato, Jorge Vieira, Hugo López-Fernández,
 *  and Cristina Vieira.
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabgroupComponent} from './components/tabgroup/tabgroup.component';
import {LoginComponent} from './components/login/login.component';
import {UserManagerComponent} from './components/user-manager/user-manager.component';
import {InteractomesComponent} from './components/interactomes/interactomes.component';
import {UserWorkManagerComponent} from './components/user-work-manager/user-work-manager.component';
import {UserCreateComponent} from './components/user-create/user-create.component';


const routes: Routes = [
  { path: '', redirectTo: '/compare', pathMatch: 'full' },
  { path: 'compare', component: TabgroupComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LoginComponent },
  { path: 'users', component: UserManagerComponent },
  { path: 'new-user/:role', component: UserCreateComponent },
  { path: 'interactomes', component: InteractomesComponent },
  { path: 'results', component: UserWorkManagerComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
