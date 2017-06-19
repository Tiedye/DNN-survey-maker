import { Question } from './question';
import { Condition } from './condition';
import { v4 } from 'uuid';

export class Page {
    id = v4();
    constructor(public title:string = '', public questions: Question[] = [], public condition: Condition = null) {}
}