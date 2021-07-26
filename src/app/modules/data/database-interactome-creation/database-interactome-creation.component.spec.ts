import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DatabaseInteractomeCreationComponent} from './database-interactome-creation.component';

describe('DatabaseInteractomeCreationComponent', () => {
    let component: DatabaseInteractomeCreationComponent;
    let fixture: ComponentFixture<DatabaseInteractomeCreationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatabaseInteractomeCreationComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(DatabaseInteractomeCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
