import {Component, Input, OnInit} from '@angular/core';
import {BlastResult} from '../../interfaces/blast-result';

@Component({
  selector: 'app-blast-result',
  templateUrl: './blast-result.component.html',
  styleUrls: ['./blast-result.component.css']
})
export class BlastResultComponent implements OnInit {

  @Input() blastResult: BlastResult;
  constructor() { }

  ngOnInit() {
  }

}
