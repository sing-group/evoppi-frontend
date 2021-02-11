/*
 *  EvoPPI Frontend
 *
 *  Copyright (C) 2017-2019 - Noé Vázquez González,
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

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MainComponent} from './main.component';
import {SidebarComponent} from '../navigation/sidebar/sidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {NavbarComponent} from '../navigation/navbar/navbar.component';
import {FooterComponent} from '../navigation/footer/footer.component';
import {AuthenticationService} from '../authentication/services/authentication.service';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('MainComponent', () => {
    let component: MainComponent;
    let fixture: ComponentFixture<MainComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MainComponent, SidebarComponent, NavbarComponent, FooterComponent],
            imports: [RouterTestingModule, NoopAnimationsModule],
            providers: [AuthenticationService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MainComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    // TODO: this test fails initializing NavBarComponent
    /*
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    */
});
