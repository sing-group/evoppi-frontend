/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2022 - Noé Vázquez González,
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

import {Component, Input, OnInit} from '@angular/core';
import {BlastResult} from '../../../entities/bio/results';
import {Gene} from '../../../entities/bio';
import {GeneService} from '../services/gene.service';

@Component({
    selector: 'app-blast-result',
    templateUrl: './blast-result.component.html',
    styleUrls: ['./blast-result.component.scss']
})
export class BlastResultComponent implements OnInit {

    @Input() blastResult: BlastResult;

    public query: Gene;
    public subject: Gene;

    public qAlignment: string;
    public sAlignment: string;

    public loadingQseqid = true;
    public loadingSseqid = true;

    constructor(private geneService: GeneService) {
    }

    ngOnInit() {
        this.geneService.getGene(this.blastResult.qseqid).subscribe((query) => {
            this.query = query;
            if (this.blastResult.qseqversion > query.sequences.length) {
                console.error('Error loading query sequence');
            } else {
                this.qAlignment = query.sequences[this.blastResult.qseqversion - 1];
                // this.qAlignment = seq.substring(this.blastResult.qstart, this.blastResult.qend);
            }
            this.loadingQseqid = false;
        });
        this.geneService.getGene(this.blastResult.sseqid).subscribe((subject) => {
            this.subject = subject;
            if (this.blastResult.sseqversion > subject.sequences.length) {
                console.error('Error loading subject sequence');
            } else {
                this.sAlignment = subject.sequences[this.blastResult.sseqversion - 1];
                // this.sAlignment = seq.substring(this.blastResult.sstart, this.blastResult.send);
            }
            this.loadingSseqid = false;
        });


    }

}
