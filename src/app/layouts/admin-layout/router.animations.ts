import {animate, group, query, style, transition, trigger} from '@angular/animations';

export const routerTransition = trigger('routerTransition', [
    transition('results-list => results-detail', [
        query('.footer', style({opacity: 0})),
        query(':enter, :leave', style({position: 'fixed', width: '100%', height: '100%'}), {optional: true}),
        group([
            query(':enter', [
                style({transform: 'translateX(100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(0%)', opacity: 1}))
            ], {optional: true}),
            query(':leave', [
                style({transform: 'translateX(0%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(-100%)', opacity: 0.5}))
            ], {optional: true})
        ]),
        query('.footer', style({opacity: 1}))
    ]),
    transition('results-detail => results-list', [
        query('.footer', style({opacity: 0})),
        query(':leave, :enter', style({position: 'fixed', width: '100%', height: '100%'}), {optional: true}),
        group([
            query(':enter', [
                style({transform: 'translateX(-100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(0%)', opacity: 1}))
            ], {optional: true}),
            query(':leave', [
                style({transform: 'translateX(0%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateX(100%)', opacity: 0.5}))
            ], {optional: true}),
        ]),
        query('.footer', style({opacity: 1}))
    ])
]);
