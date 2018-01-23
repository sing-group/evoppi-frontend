import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Gene} from '../../interfaces/gene';

@Component({
  selector: 'app-gene-info',
  templateUrl: './gene-info.component.html',
  styleUrls: ['./gene-info.component.css']
})
export class GeneInfoComponent implements OnInit {

  public gene: Gene;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
    this.gene = this.data.gene;
    console.log(this.gene);
  }

}
