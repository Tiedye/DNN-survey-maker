import { Condition } from './condition';
import { Page } from './page';

export function GetBlankCondition(): Condition {
    return {questionId: null, compare: null, compareMin: null, compareMax: null, comparator: "eq"};
}

export function GetBlankPage(): Page {
    return {condition: null, questions: [], title: ""};
}