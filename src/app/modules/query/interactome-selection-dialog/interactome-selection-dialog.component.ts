import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Interactome} from '../../../entities';
import {InteractomeFilter} from '../interactome-selection-form/interactome-selection-form.component';

export interface InteractomeSelectionDialogData {
    readonly title: string,
    readonly filters: InteractomeFilter[],
    readonly interactomes: Interactome[],
    readonly selectedInteractomeIds?: number[]
}

@Component({
  selector: 'app-interactome-selection-dialog',
  templateUrl: './interactome-selection-dialog.component.html',
  styleUrls: ['./interactome-selection-dialog.component.scss']
})
export class InteractomeSelectionDialogComponent {
    public readonly title: string;
    public readonly filters: InteractomeFilter[];
    public readonly interactomes: Interactome[];
    public selectedInteractomeIds: number[];

  constructor(
      @Inject(MAT_DIALOG_DATA) private data: InteractomeSelectionDialogData
  ) {
      this.title = data.title;
      this.interactomes = data.interactomes;
      this.filters = data.filters === undefined ? [] : data.filters;
      this.selectedInteractomeIds = data.selectedInteractomeIds === undefined ? [] : data.selectedInteractomeIds;
  }
}
