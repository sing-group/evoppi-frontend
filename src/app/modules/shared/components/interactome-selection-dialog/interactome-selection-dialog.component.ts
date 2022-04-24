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

import {Component, Inject, Input, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Interactome} from '../../../../entities';
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
