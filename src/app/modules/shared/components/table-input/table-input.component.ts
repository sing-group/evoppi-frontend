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

import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';

@Component({
    selector: 'app-table-input',
    templateUrl: './table-input.component.html',
    styleUrls: ['./table-input.component.scss']
})
export class TableInputComponent implements OnInit {
    public static getFilterValues(
        inputComponents: Iterable<TableInputComponent>,
        columnDefMapper: (columnDef: string) => string = (columnDef: string) => columnDef,
        columnPrefix: string = 'mat-column-'
    ): { [key: string]: Observable<string> } {
        const fieldFilters: { [key: string]: Observable<string> } = {};

        for (const component of inputComponents) {
            const columnDef = component.getHostColumnDef(columnPrefix);

            if (columnDef === null) {
                console.error('Missing host column for: ' + component);
            } else {
                const columnDefMapped = columnDefMapper(columnDef);
                fieldFilters[columnDefMapped] = component.valueChange.asObservable();
            }
        }

        return fieldFilters;
    }

    public static haveValue(inputComponents: Iterable<TableInputComponent>): boolean {
        if (inputComponents === undefined) {
            return false;
        } else {
            for (const component of inputComponents) {
                if (component.hasValue()) {
                    return true;
                }
            }

            return false;
        }
    }

    public static clear(inputComponents: Iterable<TableInputComponent>) {
        for (const component of inputComponents) {
            component.clearValue();
        }
    }

    @Input() public label: string;
    @Input() public options: string[];
    @Input() public debounceTime = 500;
    @Input() public clearable = true;

    @Output() public valueChange: EventEmitter<string>;

    public readonly formControl: FormControl;

    constructor(
        private readonly element: ElementRef<any>
    ) {
        this.formControl = new FormControl();
        this.valueChange = new EventEmitter<string>();
    }

    @Input()
    public get value(): string {
        return this.formControl.value;
    }

    public set value(value: string) {
        if (this.value !== value) {
            this.formControl.setValue(value);
        }
    }

    ngOnInit(): void {
        this.formControl.valueChanges
            .pipe(
                debounceTime(this.debounceTime),
                distinctUntilChanged()
            )
            .subscribe(value => {
                this.valueChange.next(value);
            });
    }

    public hasValue() {
        return this.value !== null && this.value !== '';
    }

    public clearValue() {
        this.value = '';
    }

    public onClearValue($event: MouseEvent) {
        $event.stopPropagation();
        this.clearValue();
    }

    public getHostColumnDef(prefix: string = 'mat-column-'): string | null {
        const matcher = new RegExp('^' + prefix);

        let parent = this.element.nativeElement;

        while ((parent = parent.parentElement) !== null) {
            const classList: DOMTokenList = parent.classList;
            for (let i = 0; i < classList.length; i++) {
                const className = classList.item(i);
                if (matcher.test(className)) {
                    return className.substring(prefix.length);
                }
            }
        }

        return null;
    }
}
