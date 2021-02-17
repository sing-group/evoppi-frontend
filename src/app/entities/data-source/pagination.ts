export class Pagination {
    public constructor(
        public readonly page: number,
        public readonly pageSize: number
    ) {
    }

    public get initialIndex(): number {
        return this.page * this.pageSize;
    }

    public get finalIndex(): number {
        return (this.page + 1) * this.pageSize - 1;
    }
}