import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Work} from '../../interfaces/work';
import {WorkService} from '../../services/work.service';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-work-status',
  templateUrl: './work-status.component.html',
  styleUrls: ['./work-status.component.css']
})
export class WorkStatusComponent implements OnInit {

  work: Work;
  intervalSubscription: Subscription;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<WorkStatusComponent>,
              private workService: WorkService) { }

  ngOnInit() {
    this.work = this.data.data;
    console.log('DATA', this.work.name);

    this.intervalSubscription = IntervalObservable.create(1000).subscribe(res => {
      this.update();
    });
  }

  private update() {
    this.workService.update(this.work).subscribe((res) => {
      if (res.finished) {
        this.intervalSubscription.unsubscribe();
        this.dialogRef.close(res);
      } else {
        this.work = res;
      }
    });

  }

}
