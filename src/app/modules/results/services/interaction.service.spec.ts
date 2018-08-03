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

import {InteractionService} from './interaction.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {GeneService} from './gene.service';
import {InteractomeService} from './interactome.service';
import {SpeciesService} from './species.service';
import {NotificationService} from '../../notification/services/notification.service';

describe('InteractionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [InteractionService, GeneService, InteractomeService, SpeciesService, NotificationService],
            imports: [HttpClientTestingModule],
        });
    });

    it('should be created', inject([InteractionService], (service: InteractionService) => {
        expect(service).toBeTruthy();
    }));
});
