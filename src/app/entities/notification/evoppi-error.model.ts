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

import {catchError} from 'rxjs/operators';
import {MonoTypeOperatorFunction} from 'rxjs/internal/types';

export class EvoppiError extends Error {
    public readonly summary: string;
    public readonly detail: string;
    public readonly cause?: any;

    static throwOnError(summary: string, detail: string): MonoTypeOperatorFunction<any> {
        return catchError(
            (error: any) => {
                throw new EvoppiError(summary, detail, error);
            }
        );
    }

    constructor(summary: string, detail: string, cause?: any) {
        super(detail);

        this.summary = summary;
        this.detail = detail;
        this.cause = cause;
    }
}
