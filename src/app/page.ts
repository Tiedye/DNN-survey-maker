import { Question } from './question';
import { Condition } from './condition';

export interface Page {
    title: string;
    questions: Question[];
    condition: Condition;
}