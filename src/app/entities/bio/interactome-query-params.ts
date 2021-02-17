import {InteractomeField} from './interactome-field';
import {SortDirection} from '../data';

export class InteractomeQueryParams {
    public readonly page?: number;
    public readonly pageSize?: number;
    public readonly orderField?: InteractomeField;
    public readonly sortDirection?: SortDirection;
}