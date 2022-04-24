import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BlastQueryOptions} from '../../../entities/bio/results/blast-query-options.model';

@Component({
  selector: 'app-blast-params-dialog',
  templateUrl: './blast-params-dialog.component.html',
  styleUrls: ['./blast-params-dialog.component.scss']
})
export class BlastParamsDialogComponent {

  constructor(
      @Inject(MAT_DIALOG_DATA) public readonly data: BlastQueryOptions
  ) { }

}
