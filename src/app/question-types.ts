import { Condition } from './condition';
import { v4 } from 'uuid';

export class AbstractQuestion {
    id = v4();
    constructor(public name:string = "question", public condition:Condition = null) {}
}
export class ChoiceQuestion extends AbstractQuestion {
    type: "choice";

    constructor(name:string = "choice", public question: string = "", public choices: {name: string, value: string}[] = [], condition:Condition = null) {
        super(name, condition);
        this.type = "choice";
    }
} 
export class TextQuestion extends AbstractQuestion {
    type: "text";

    constructor(name:string = "text", public question: string = "", condition:Condition = null) {
        super(name, condition);
        this.type = "text";
    }
} 
export class NumericQuestion extends AbstractQuestion {
    type: "number";

    constructor(name:string = "number", public question: string = "", public min:number = 0, public max:number = 0, condition:Condition = null) {
        super(name, condition);
        this.type = "number";
    }
}
export class DateQuestion extends AbstractQuestion {
    type: "date";

    constructor(name:string = "date", public question: string = "", public min:number = 0, public max:number = 0, condition:Condition = null) {
        super(name, condition);
        this.type = "date";
    }
}
export class HeaderQuestion extends AbstractQuestion {
    type: 'header';

    constructor(name:string = 'header', public content: string = 'A Header', public level: string = '2', condition:Condition = null) {
        super(name, condition);
        this.type = 'header';
    }
}
