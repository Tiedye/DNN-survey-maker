import { Condition } from "app/condition";

export function GetBlankCondition(): Condition {
    return {questionId: null, compare: null, compareMin: null, compareMax: null, comparator: "eq"};
}