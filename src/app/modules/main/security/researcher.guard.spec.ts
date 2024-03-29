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

import {inject, TestBed} from '@angular/core/testing';

import {ResearcherGuard} from './researcher.guard';
import {AuthenticationService} from '../../authentication/services/authentication.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('ResearcherGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ResearcherGuard, AuthenticationService],
            imports: [HttpClientTestingModule]
        });
    });

    it('should ...', inject([ResearcherGuard], (guard: ResearcherGuard) => {
        expect(guard).toBeTruthy();
    }));
});
