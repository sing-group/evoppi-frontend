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
