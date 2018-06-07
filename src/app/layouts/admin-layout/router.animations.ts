import {animate, group, query, style, transition, trigger} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('results => results-table', [
        query(':enter, :leave', style({position: 'fixed', width: '100%'}), {optional: true}),
        group([
            query(':enter', [
                style({transform: 'translateX(100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(0%)', opacity: 1}))
            ], {optional: true}),
            query(':leave', [
                style({transform: 'translateX(0%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(-100%)', opacity: 0.5}))
            ], {optional: true})
        ])
    ]),
    transition('results-table => results', [
        query(':leave, :enter', style({position: 'fixed', width: '90%'}), {optional: true}),
        group([
            query(':enter', [
                style({transform: 'translateX(-100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(0%)', opacity: 1}))
            ], {optional: true}),
            query(':leave', [
                style({transform: 'translateX(0%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(100%)', opacity: 0.5}))
            ], {optional: true}),
        ])
    ])
]);
