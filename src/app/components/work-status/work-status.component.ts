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

import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Work} from '../../interfaces/work';
import {WorkService} from '../../services/work.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Subscription} from 'rxjs/Subscription';
import {Status} from '../../interfaces/status';
import {Location} from '@angular/common';

@Component({
  selector: 'app-work-status',
  templateUrl: './work-status.component.html',
  styleUrls: ['./work-status.component.css']
})
export class WorkStatusComponent implements OnInit {

  work: Work;
  intervalSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WorkStatusComponent>,
              private workService: WorkService, public location: Location) { }

  ngOnInit() {
    this.work = this.data.data;
    console.log('DATA', this.work.name);

    this.intervalSubscription = IntervalObservable.create(1000).subscribe(res => {
      this.update();
    });
  }

  private update() {
    this.workService.update(this.work).subscribe((res) => {
      switch (res.status) {
        case Status.FAILED:
          alert('Work FAILED');
          /* falls through */
        case Status.COMPLETED:
          this.intervalSubscription.unsubscribe();
          setTimeout(() => this.dialogRef.close(res), 1000);
          break;
        default:
          this.work = res;
      }
    });

  }

}
