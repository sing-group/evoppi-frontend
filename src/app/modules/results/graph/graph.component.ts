/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2019 - Noé Vázquez González,
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

import {
    Component, Input, ChangeDetectorRef, HostListener, ChangeDetectionStrategy, SimpleChanges, OnChanges, ViewChild,
    ElementRef
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {GeneInfoComponent} from '../gene-info/gene-info.component';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import * as jsPDF from 'jspdf';
import {ForceDirectedGraph} from '../../../entities/bio/results/force-directed-graph.model';
import {Node} from '../../../entities/bio/results/node.model';
import {D3Service} from '../services/d3.service';

@Component({
    selector: 'app-graph',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './graph.component.html',
    styleUrls: ['./graph.component.scss']
})
export class GraphComponent implements OnChanges {
    @ViewChild('svg', { static: true }) svg: ElementRef;
    @ViewChild('canvas', { static: true }) canvas: ElementRef;

    @Input() nodes;
    @Input() links;
    @Input() graphWidth = 200;
    @Input() graphHeight = 200;

    graph: ForceDirectedGraph;
    private _options: { width, height };

    svgURL: SafeResourceUrl = null;
    pngURL: SafeResourceUrl = null;
    enableSVG = false;
    enablePNG = false;
    enablePDF = false;

    @HostListener('window:resize', ['$event'])
    onResize(event) {
        this.graph.initSimulation(this.options);
    }

    constructor(private d3Service: D3Service, private ref: ChangeDetectorRef, public dialog: MatDialog,
                private domSanitizer: DomSanitizer) {
    }

    ngOnChanges(changes: SimpleChanges) {
        this.options = {width: this.graphWidth, height: this.graphHeight};

        this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

        this.graph.ticker.subscribe((d) => {
            this.ref.markForCheck();
        });

        this.graph.initSimulation(this.options);
    }

    get options() {
        return this._options;
    }

    set options(value) {
        this._options = value;
    }

    onNodeClick(node: Node) {
        const dialogRef = this.dialog.open(GeneInfoComponent, {
            // width: '250px',
            maxHeight: window.innerHeight,
            data: {geneId: node.label, blastResults: node.blastResults}
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
        });

    }

    selfLink(d) {
        // TODO: check max node diameter to size links acordingly
        const x1 = d.source.x,
            y1 = d.source.y,
            x2 = d.target.x + 1, // Avoid link to collapse
            y2 = d.target.y + 1,
            dx = x2 - x1,
            dy = y2 - y1,
            dr = Math.sqrt(dx * dx + dy * dy),
            sweep = 1, // 1 or 0
            xRotation = -45, // degrees
            largeArc = 1, // 1 or 0
            drx = 70,
            dry = 30;


        return 'M' + x1 + ',' + y1 + 'A' + drx + ',' + dry + ' ' + xRotation + ',' + largeArc + ',' + sweep + ' ' + x2 + ',' + y2;
    }

    graphDirty() {
        this.enablePDF = this.enableSVG = this.enablePNG = false;
    }

    prepareDownload() {
        const xmlSerializer = new XMLSerializer();
        const source = xmlSerializer.serializeToString(this.svg.nativeElement);
        const doctype = '<?xml version="1.0" standalone="no"?>'
            + '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';

        const blob = new Blob([doctype + source], {type: 'image/svg+xml;charset=utf-8'});
        const url = window.URL.createObjectURL(blob);

        const image = new Image();
        const ctx: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

        image.onload = (() => {
            ctx.drawImage(image, 0, 0);
            this.pngURL = this.canvas.nativeElement.toDataURL();
            // This doesn't work with *ngIf, possible angular bug
            // this.enablePNG = true;
            // this.enablePDF = true;
        });

        image.src = url;
        this.svgURL = this.domSanitizer.bypassSecurityTrustResourceUrl(url);
        this.enableSVG = true;
        // This two should be inside onload, but fail sometimes
        this.enablePNG = true;
        this.enablePDF = true;

    }

    downloadPDF() {
        const imgData = this.canvas.nativeElement.toDataURL('image/jpeg');
        const margin = 10;
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'pt',
            format: [(this.graphWidth + (margin * 2)) * 0.75, (this.graphHeight + (margin * 2)) * 0.75]
        });
        doc.addImage(imgData, 'JPG', margin, margin);
        doc.save('graph.pdf');
    }
}
