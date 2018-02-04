import {Component, Input, OnInit} from '@angular/core';
import {BlastResult} from '../../interfaces/blast-result';
import {GeneService} from '../../services/gene.service';
import {Gene} from '../../interfaces/gene';

@Component({
  selector: 'app-blast-result',
  templateUrl: './blast-result.component.html',
  styleUrls: ['./blast-result.component.css']
})
export class BlastResultComponent implements OnInit {

  @Input() blastResult: BlastResult;

  public query: Gene;
  public subject: Gene;

  public qAlignment: string;
  public sAlignment: string;

  constructor(private geneService: GeneService) {
  }

  ngOnInit() {
    this.geneService.getGene(this.blastResult.qseqid).subscribe( (query) => {
      this.query = query;
      if (this.blastResult.qseqversion > query.sequences.length) {
        console.error('Error loading query sequence');
      } else {
        this.qAlignment = query.sequences[this.blastResult.qseqversion - 1];
        // this.qAlignment = seq.substring(this.blastResult.qstart, this.blastResult.qend);
      }

      console.log('qalignment', this.qAlignment);
    });
    this.geneService.getGene(this.blastResult.sseqid).subscribe( (subject) => {
      this.subject = subject;
      if (this.blastResult.qseqversion > subject.sequences.length) {
        console.error('Error loading subject sequence');
      } else {
        this.sAlignment = subject.sequences[this.blastResult.sseqversion - 1];
        // this.sAlignment = seq.substring(this.blastResult.sstart, this.blastResult.send);
      }

      console.log('salignment', this.sAlignment);
    });


  }

}
