import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';

@Component({
    selector: 'app-table-select',
    templateUrl: './table-select.component.html',
    styleUrls: ['./table-select.component.scss']
})
export class TableSelectComponent implements OnInit {
    @Input() public label: string;
    @Input() public options: string[];
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

    onClearValue($event: MouseEvent) {
        $event.stopPropagation();
        this.clearValue();
    }
}
