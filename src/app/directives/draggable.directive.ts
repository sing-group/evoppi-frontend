import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import {D3Service} from '../services/d3.service';
import {ForceDirectedGraph} from '../classes/force-directed-graph';
import {Node} from '../classes/node';

@Directive({
    selector: '[appDraggable]'
})
export class DraggableDirective implements OnInit {
    @Input('draggableNode') draggableNode: Node;
    @Input('draggableInGraph') draggableInGraph: ForceDirectedGraph;

    constructor(private d3Service: D3Service, private _element: ElementRef) { }

    ngOnInit() {
        this.d3Service.applyDraggableBehaviour(this._element.nativeElement, this.draggableNode, this.draggableInGraph);
    }
}
