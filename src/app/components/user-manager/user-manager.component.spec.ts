import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserManagerComponent } from './user-manager.component';
import {InteractomeService} from '../../services/interactome.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {GeneService} from '../../services/gene.service';
import {MaterialModule} from '../../app.module';
import {InteractionService} from '../../services/interaction.service';
import {SpeciesService} from '../../services/species.service';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AdminService} from '../../services/admin.service';

describe('UserManagerComponent', () => {
  let component: UserManagerComponent;
  let fixture: ComponentFixture<UserManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserManagerComponent ],
      imports: [ MaterialModule, HttpClientModule ],
      providers: [ AdminService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
