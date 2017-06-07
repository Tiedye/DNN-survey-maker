import { Condition } from './condition';

export class AbstractQuestion {
    constructor(public id:string = "question", public condition:Condition = null) {}
}
export class ChoiceQuestion extends AbstractQuestion {
    type: "choice";

    constructor(id:string = "choice", public question: string = "", public choices: {name: string, value: string}[] = [], condition:Condition = null) {
        super(id, condition);
        this.type = "choice";
    }
} 
export class TextQuestion extends AbstractQuestion {
    type: "text";

    constructor(id:string = "text", public question: string = "", condition:Condition = null) {
        super(id, condition);
        this.type = "text";
    }
} 
export class NumericQuestion extends AbstractQuestion {
    type: "number";

    constructor(id:string = "number", public question: string = "", public min:number = 0, public max:number = 0, condition:Condition = null) {
        super(id, condition);
        this.type = "number";
    }
}
export class DateQuestion extends AbstractQuestion {
    type: "date";

    constructor(id:string = "date", public question: string = "", public min:number = 0, public max:number = 0, condition:Condition = null) {
        super(id, condition);
        this.type = "date";
    }
}
export class HeaderQuestion extends AbstractQuestion {
    type: 'header';

    constructor(id:string = 'header', public content: string = 'A Header', public level: string = '2', condition:Condition = null) {
        super(id, condition);
        this.type = 'header';
    }
}
