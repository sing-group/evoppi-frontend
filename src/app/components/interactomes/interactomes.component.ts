import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatSort, MatTableDataSource} from '@angular/material';
import {Interactome} from '../../interfaces/interactome';

const DEMO_DATA: Interactome[] = [
  {id: 1, name: 'Interactome 1', uri: 'uri 1'},
  {id: 2, name: 'Interactome 2', uri: 'uri 2'},
  {id: 3, name: 'Interactome 3', uri: 'uri 3'},
  {id: 4, name: 'Interactome 4', uri: 'uri 4'},

];

@Component({
  selector: 'app-interactomes',
  templateUrl: './interactomes.component.html',
  styleUrls: ['./interactomes.component.css']
})
export class InteractomesComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort: MatSort;
  dataSource: MatTableDataSource<Interactome> = new MatTableDataSource<Interactome>(DEMO_DATA);
  displayedColumns = ['id', 'name', 'species', 'download'];



  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
}
