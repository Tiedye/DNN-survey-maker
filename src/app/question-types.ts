import { Condition } from './condition';
import { v4 } from 'uuid';

export class AbstractQuestion {
    id = v4();
    constructor(public name: string = 'question', public condition:Condition = null) {}
}
export class ChoiceQuestion extends AbstractQuestion {
    type: 'choice' = 'choice';

    constructor(name: string = 'choice', public question: string = '', public choices: {name: string, value: string}[] = [], condition: Condition = null) {
        super(name, condition);
    }
}
export class TextQuestion extends AbstractQuestion {
    type: 'text' = 'text';

    constructor(name: string = 'text', public question: string = '', condition: Condition = null) {
        super(name, condition);
    }
}
export class NumericQuestion extends AbstractQuestion {
    type: 'number' = 'number';

    constructor(name: string = 'number', public question: string = '', public min: number = 0, public max: number = 0, condition: Condition = null) {
        super(name, condition);
    }
}
export class DateQuestion extends AbstractQuestion {
    type: 'date' = 'date';

    constructor(name: string = 'date', public question: string = '', public min: number = 0, public max: number = 0, condition: Condition = null) {
        super(name, condition);
    }
}
export class HeaderQuestion extends AbstractQuestion {
    type: 'header' = 'header';

    constructor(name: string = 'header', public level: string = '2', condition: Condition = null) {
        super(name, condition);
    }
}
