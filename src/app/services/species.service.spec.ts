import { TestBed, inject } from '@angular/core/testing';

import { SpeciesService } from './species.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Species} from '../interfaces/species';
import {Observable} from 'rxjs/Observable';

export const SPECIES: Species[] = [
  {id: 1, name: 'Homo Sapiens', interactomes: []}
];

describe('SpeciesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeciesService],
      imports: [ HttpClientModule ],
    });
  });

  it('should be created', inject([SpeciesService], (service: SpeciesService) => {
    expect(service).toBeTruthy();
  }));

  it('should be instance of SpeciesService', inject([SpeciesService], (service: SpeciesService) => {
    expect(service instanceof SpeciesService).toBeTruthy();
  }));

  it('can instantiate service with "new"', inject([HttpClient], (http: HttpClient) => {
    expect(http).not.toBeNull('http should be provided');
    const service = new SpeciesService(http);
    expect(service instanceof SpeciesService).toBe(true, 'new service should be ok');
  }));

  it('can call getSpecies', inject([SpeciesService], (service: SpeciesService) => {
    spyOn(service, 'getSpecies').and.returnValue(Observable.of(SPECIES));
    service.getSpecies().subscribe((species) => {
      expect(species instanceof Array).toBeTruthy();
      expect(species.length).toBe(1);
      expect(species[0].name).toBe('Homo Sapiens');
    });
    expect(service.getSpecies).toHaveBeenCalled();
  }));
});
