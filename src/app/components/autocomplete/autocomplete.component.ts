import {Component, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css']
})
export class AutocompleteComponent implements OnInit {

  @Input()
  public title: string;
  @Input()
  public subtitle: string;
  @Input()
  public names: Array<{source: string, names: Array<string>}>;

  @Output()
  public selected: string;

  constructor() { }

  ngOnInit() {
  }



}
