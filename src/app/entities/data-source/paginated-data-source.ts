import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, Observable} from 'rxjs';
import {CollectionViewer} from '@angular/cdk/collections';
import {finalize} from 'rxjs/operators';
import {Pagination} from './pagination';

export abstract class PaginatedDataSource<T> extends DataSource<T> {
    private readonly paginatedDataSubject: BehaviorSubject<T[]>;
    private readonly fullDataSubject: BehaviorSubject<T[]>;
    private readonly countSubject: BehaviorSubject<number>;
    private readonly loadingSubject: BehaviorSubject<boolean>;

    public readonly paginatedData$: Observable<T[]>;
    public readonly fullData$: Observable<T[]>;
    public readonly count$: Observable<number>;
    public readonly loading$: Observable<boolean>;

    protected constructor() {
        super();

        this.paginatedDataSubject = new BehaviorSubject([]);
        this.fullDataSubject = new BehaviorSubject([]);
        this.countSubject = new BehaviorSubject(0);
        this.loadingSubject = new BehaviorSubject(false);

        this.paginatedData$ = this.paginatedDataSubject.asObservable();
        this.fullData$ = this.fullDataSubject.asObservable();
        this.count$ = this.countSubject.asObservable();
        this.loading$ = this.loadingSubject.asObservable();
    }

    public connect(collectionViewer: CollectionViewer): Observable<T[]> {
        return this.paginatedData$;
    }

    public disconnect(collectionViewer: CollectionViewer): void {
        this.paginatedDataSubject.complete();
        this.fullDataSubject.complete();
        this.countSubject.complete();
        this.loadingSubject.complete();
    }

    public update(newData: Observable<T[]>, pagination: Pagination): void {
        this.loadingSubject.next(true);

        const subscription = newData.pipe(
            finalize(() => {
                this.loadingSubject.next(false);
                subscription.unsubscribe();
            })
        )
            .subscribe((data: T[]) => {
                this.fullDataSubject.next(data);
                this.paginatedDataSubject.next(data.slice(pagination.initialIndex, pagination.finalIndex));
                this.countSubject.next(data.length);
            });
    }

    public updatePage(pagination: Pagination) {
        const data = this.fullDataSubject.getValue();
        this.paginatedDataSubject.next(data.slice(pagination.initialIndex, pagination.finalIndex));
    }
}

