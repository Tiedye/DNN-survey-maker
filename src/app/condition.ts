export interface Condition {
    questionId: string;
    compare: string;
    compareMin: string;
    compareMax: string;
    comparator: 'eq'|'ne'|'gt'|'lt'|'gte'|'lte'|'range';
}
