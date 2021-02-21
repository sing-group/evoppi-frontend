/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2021 - Noé Vázquez González,
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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-table-input',
    templateUrl: './table-input.component.html',
    styleUrls: ['./table-input.component.scss']
})
export class TableInputComponent implements OnInit {
    @Input() public label: string;
    @Input() public debounceTime = 500;
    @Input() public clearable = true;

    @Output() public valueChange: EventEmitter<string>;

    public readonly formControl: FormControl;

    constructor() {
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
}
