import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'join'
})
export class JoinPipe implements PipeTransform {

    transform(value: Array<any>, sep = ', ', lastSep = ' and ', empty = ''): string {
        switch (value.length) {
            case 0:
                return empty;
            case 1:
                return value[0].toString();
            default:
                return value.slice(0, value.length - 1).join(sep) + lastSep + value[value.length - 1];
        }
    }
}
