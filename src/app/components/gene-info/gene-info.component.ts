import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Gene} from '../../interfaces/gene';
import {BlastResult} from '../../interfaces/blast-result';
import {GeneService} from '../../services/gene.service';
import {SafeResourceUrl} from '@angular/platform-browser/src/security/dom_sanitization_service';
import {DomSanitizer} from '@angular/platform-browser';
import {FastaHelper} from '../../helpers/fasta.helper';

@Component({
  selector: 'app-gene-info',
  templateUrl: './gene-info.component.html',
  styleUrls: ['./gene-info.component.css']
})
export class GeneInfoComponent implements OnInit {

  public gene: Gene;
  public blastResults: BlastResult[];
  public sequences: SafeResourceUrl = '';


  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private geneService: GeneService, private domSanitizer: DomSanitizer) { }

  ngOnInit() {
    this.geneService.getGene(this.data.geneId).subscribe((res) => {
      this.gene = res;
      this.blastResults = this.data.blastResults;
      this.sequences = this.domSanitizer.bypassSecurityTrustResourceUrl(
        FastaHelper.getFasta(this.gene.id.toString(), this.gene.sequences)
      );
    });
  }

}
