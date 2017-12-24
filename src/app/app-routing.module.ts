import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TabgroupComponent} from './components/tabgroup/tabgroup.component';


const routes: Routes = [
  { path: '', redirectTo: '/compare', pathMatch: 'full' },
  { path: 'compare', component: TabgroupComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
