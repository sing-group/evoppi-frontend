import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InteractomeCreationComponent} from './interactome-creation.component';

describe('InteractomeCreationComponent', () => {
    let component: InteractomeCreationComponent;
    let fixture: ComponentFixture<InteractomeCreationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InteractomeCreationComponent]
        })
            .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InteractomeCreationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
