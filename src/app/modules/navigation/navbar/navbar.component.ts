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

import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../authentication/services/authentication.service';
import {NavigationInfo} from '../../../entities';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

    private sidebarVisible: boolean;
    private mobileMenuVisible = false;

    @Input() public routes: NavigationInfo[];

    @ViewChild('navbarToggler', { static: true }) private buttonToggleMenuReference: ElementRef;
    private layerHideBodyElement: HTMLElement;

    constructor(
        private location: Location,
        private router: Router,
        private authentication: AuthenticationService
    ) {
    }

    ngOnInit() {
        this.sidebarVisible = false;

        this.layerHideBodyElement = document.createElement('div');
        this.layerHideBodyElement.classList.add('close-layer');

        this.router.events.subscribe((event) => {
            this.sidebarClose();

            if (this.layerHideBody) {
                this.layerHideBody.remove();
                this.mobileMenuVisible = false;
            }
        });
    }

    private get buttonToggleMenu(): HTMLElement {
        return this.buttonToggleMenuReference.nativeElement;
    }

    private get body(): HTMLElement {
        return document.getElementsByTagName('body')[0];
    }

    private get layerHideBody(): HTMLElement {
        return this.layerHideBodyElement;
    }

    private setButtonToggleMenuAsOpened(ms = 0) {
        if (ms <= 0) {
            this.buttonToggleMenu.classList.add('toggled');
        } else {
            setTimeout(() => this.buttonToggleMenu.classList.add('toggled'), ms);
        }
    }

    private setButtonToggleMenuAsClosed(ms = 0) {
        if (ms <= 0) {
          if (this.buttonToggleMenu !== undefined) {
            this.buttonToggleMenu.classList.remove('toggled');
          }
        } else {
            setTimeout(() => this.buttonToggleMenu.classList.remove('toggled'), ms);
        }
    }

    public get currentRoute(): NavigationInfo {
        let title = this.location.prepareExternalUrl(this.location.path());
        if (title.charAt(0) === '#') {
            title = title.slice(2);
        }

        let longestMatch = null;

        for (const route of this.routes) {
            if (title.startsWith(route.path)) {
                if (longestMatch === null || longestMatch.path.length < route.path.length) {
                    longestMatch = route;
                }
            }
        }

        return longestMatch;
    }

    public isGuest(): boolean {
        return this.authentication.isGuest();
    }

    public getUserName(): string {
        return this.authentication.getUserName();
    }

    sidebarOpen() {
        this.setButtonToggleMenuAsOpened(500);

        this.body.classList.add('nav-open');

        this.sidebarVisible = true;
    }

    sidebarClose() {
        this.setButtonToggleMenuAsClosed();

        this.sidebarVisible = false;

        this.body.classList.remove('nav-open');
    }

    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }

        if (this.mobileMenuVisible) {
            this.body.classList.remove('nav-open');
            if (this.layerHideBody) {
                this.layerHideBody.remove();
            }

            this.setButtonToggleMenuAsClosed(400);

            this.mobileMenuVisible = false;
        } else {
            this.setButtonToggleMenuAsOpened(430);

            if (this.body.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild(this.layerHideBody);
            } else if (this.body.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild(this.layerHideBody);
            }

            setTimeout(() => this.layerHideBody.classList.add('visible'), 100);

            this.layerHideBody.onclick = function () { // asign a function
                this.body.classList.remove('nav-open');
                this.mobileMenuVisible = false;
                this.layerHideBody.classList.remove('visible');
                setTimeout(() => {
                    this.layerHideBody.remove();
                    this.buttonToggleMenu.classList.remove('toggled');
                }, 400);
            }.bind(this);

            this.body.classList.add('nav-open');
            this.mobileMenuVisible = true;
        }
    }

    getTitle(): string {
        return this.currentRoute === null ? 'EvoPPI' : this.currentRoute.title;
    }

    hasBackRoute(): boolean {
        return this.currentRoute.backRoute !== undefined;
    }
}
