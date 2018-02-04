import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Gene} from '../../interfaces/gene';
import {BlastResult} from '../../interfaces/blast-result';
import {GeneService} from '../../services/gene.service';

@Component({
  selector: 'app-gene-info',
  templateUrl: './gene-info.component.html',
  styleUrls: ['./gene-info.component.css']
})
export class GeneInfoComponent implements OnInit {

  public gene: Gene;
  public blastResults: BlastResult[];


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private geneService: GeneService) { }

  ngOnInit() {
    this.geneService.getGene(this.data.geneId).subscribe((res) => {
      this.gene = res;
      this.blastResults = this.data.blastResults;


      console.log(this.gene);
      console.log(this.blastResults);
    });
  }

}
