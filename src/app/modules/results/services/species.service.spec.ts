/*
 *  EvoPPI Frontend
 *
 * Copyright (C) 2017-2018 - Noé Vázquez, Miguel Reboiro-Jato,
 * Jorge Vieria, Sara Rocha, Hugo López-Fernández, André Torres,
 * Rui Camacho, Florentino Fdez-Riverola, and Cristina P. Vieira.
 * .
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 *
 */

import {TestBed, inject} from '@angular/core/testing';

import {SpeciesService} from './species.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Species} from '../../../entities/bio';
import {of} from 'rxjs/index';
import {NotificationService} from '../../notification/services/notification.service';

export const SPECIES: Species[] = [
    {id: 1, name: 'Homo Sapiens', uri: '', interactomes: []}
];

describe('SpeciesService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [SpeciesService, NotificationService,],
            imports: [HttpClientTestingModule],
        });
    });

    it('should be created', inject([SpeciesService], (service: SpeciesService) => {
        expect(service).toBeTruthy();
    }));

    it('should be instance of SpeciesService', inject([SpeciesService], (service: SpeciesService) => {
        expect(service instanceof SpeciesService).toBeTruthy();
    }));

    it('can call updateSpecies', inject([SpeciesService], (service: SpeciesService) => {
        spyOn(service, 'getSpecies').and.returnValue(of(SPECIES));
        service.getSpecies().subscribe((species) => {
            expect(species instanceof Array).toBeTruthy();
            expect(species.length).toBe(1);
            expect(species[0].name).toBe('Homo Sapiens');
        });
        expect(service.getSpecies).toHaveBeenCalled();
    }));
});
