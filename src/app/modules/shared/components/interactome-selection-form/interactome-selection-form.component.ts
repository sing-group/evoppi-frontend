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

import {ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {Interactome} from '../../../../entities';
import {MatListOption, MatSelectionList, MatSelectionListChange} from '@angular/material/list';
import {MatSelect} from '@angular/material/select';
import {InteractomeService} from '../../../results/services/interactome.service';
import {InteractomeCollection} from '../../../../entities/bio/interactome-collection.model';

export interface InteractomeFilter {
    readonly name: string,
    readonly values: string[]
}

interface SelectableInteractome extends Interactome {
    selected: boolean;
}

interface SelectableInteractomeCollection {
    name: string;
    selected: boolean;
}

@Component({
    selector: 'app-interactome-selection-form',
    templateUrl: './interactome-selection-form.component.html',
    styleUrls: ['./interactome-selection-form.component.scss']
})
export class InteractomeSelectionFormComponent implements OnInit {
    private _interactomes: Interactome[];
    @Input() public selectedInteractomeIds: number[];
    @Input() public filters: InteractomeFilter[];

    @Output() public selectedInteractomeIdsChange: EventEmitter<number[]>;

    public searchText: string;

    public interactomeCollections: SelectableInteractomeCollection[];
    private interactomeCollectionNames: string[];
    public filteredInteractomes: SelectableInteractome[];

    private selectableInteractomes: SelectableInteractome[];
    private readonly filterValues: Map<string, string>;

    @ViewChild('interactomeList') private interactomeList: MatSelectionList;
    @ViewChild('interactomeCollectionList') private interactomeCollectionList: MatSelectionList;

    constructor() {
        this.selectedInteractomeIds = [];
        this.selectedInteractomeIdsChange = new EventEmitter<number[]>();
        this.filters = [];

        this.searchText = '';

        this.filteredInteractomes = [];
        this.interactomeCollections = [];
        this.interactomeCollectionNames = [];
        this.selectableInteractomes = [];
        this.filterValues = new Map<string, string>();
    }

    public ngOnInit(): void {
        this.updateSelectableInteractomes();
        this.updateFilteredInteractomes();
        this.updateInteractomeCollections();
    }

    @Input() public set interactomes(interactomes: Interactome[]) {
        this._interactomes = interactomes;
        this.updateSelectableInteractomes();
    }

    public get interactomes(): Interactome[] {
        return this._interactomes;
    }

    public hasFilterValue(filterName: string): boolean {
        return this.filterValues.has(filterName)
    }

    public keepValidValues(values: string[]): string[] {
        return values.filter(value => this.interactomes.some(interactome => this.isTextInInteractomeName(value, interactome)));
    }

    public onClearSearchText(): void {
        this.searchText = '';
        this.updateFilteredInteractomes();
    }

    public onChangeFilter(filterName: string, filterValue: string): void {
        if (filterValue.length === 0) {
            this.filterValues.delete(filterName);
        } else {
            this.filterValues.set(filterName, filterValue);
        }

        this.updateFilteredInteractomes();
    }

    public onClearFilter(filterName: string, event: MouseEvent, filterSelect: MatSelect): void {
        this.filterValues.delete(filterName);
        filterSelect.options.find(option => option.value === '').select();
        event.stopPropagation();
    }

    public onChangeSearch(): void {
        this.updateFilteredInteractomes();
    }

    public onSelectAll(): void {
        this.interactomeList.selectAll();
        this.updateSelection(this.interactomeList.options.toArray());
    }

    public onDeselectAll(): void {
        this.interactomeList.deselectAll();
        this.updateSelection(this.interactomeList.options.toArray());
    }

    public onSelectedInteractomeChange(event: MatSelectionListChange) {
        this.updateSelection(event.options);
    }

    private updateSelection(options: MatListOption[]) {
        options.forEach(option => option.value.selected = option.selected);

        this.selectedInteractomeIds = this.selectableInteractomes
            .filter(interactome => interactome.selected)
            .map(interactome => interactome.id);

        this.selectedInteractomeIdsChange.emit(this.selectedInteractomeIds);
    }

    private updateSelectableInteractomes() {
        this.selectableInteractomes = this.interactomes
            .map(interactome => ({
                selected: this.selectedInteractomeIds.includes(interactome.id),
                ...interactome
            }));
    }

    public generateCollectionName(collection: InteractomeCollection): string {
        return collection.name;
    }

    public onSelectedInteractomeCollectionChange(event: MatSelectionListChange) {
        event.options.forEach(option => option.value.selected = option.selected);
        this.interactomeCollectionNames = this.interactomeCollections.filter(c => c.selected).map(c => c.name);
        this.updateFilteredInteractomes();
    }

    private updateInteractomeCollections() {
        let names = [];
        this._interactomes.forEach(i => {
           if(!names.includes(i.interactomeCollection)) {
               names.push(i.interactomeCollection);
           }
        });
        this.interactomeCollections = names
            .map(name => ({
            name: name,
            selected: true
        }));
    }

    private updateFilteredInteractomes() {
        if (this.filterValues.size === 0 && this.searchText.length === 0 && this.interactomeCollectionNames.length === this.interactomeCollections.length) {
            this.filteredInteractomes = this.selectableInteractomes;
        } else {
            this.filteredInteractomes = this.selectableInteractomes.filter(interactome => {
                if(!this.interactomeCollectionNames.includes(interactome.interactomeCollection)) {
                    return false;
                }

                const searchRE = new RegExp(this.searchText, 'i');
                if (!searchRE.test(interactome.name)) {
                    return false;
                }

                for (const value of this.filterValues.values()) {
                    if (!this.isTextInInteractomeName(value, interactome)) {
                        return false;
                    }
                }
                return true;
            });
        }
    }

    private isTextInInteractomeName(text: string, interactome: Interactome): boolean {
        return new RegExp(text, 'i').test(interactome.name);
    }
}
