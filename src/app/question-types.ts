import { Condition } from './condition';

export class AbstractQuestion {
    id: string;
    
    constructor(public condition:Condition = null) {}
}
export class ChoiceQuestion extends AbstractQuestion {
    type: "choice";
    //question: string;
    //choices: [{name: string, value: string}];
    static numIds = 0;

    constructor(public question: string = "", public choices: {name: string, value: string}[] = [], condition:Condition = null) {
        super(condition);
        this.type = "choice";
        ChoiceQuestion.numIds += 1;
        this.id = `choice${ChoiceQuestion.numIds}`;
    }
} 
export class TextQuestion extends AbstractQuestion {
    type: "text";
    //question: string;
    static numIds = 0;

    constructor(public question: string = "", condition:Condition = null) {
        super(condition);
        this.type = "text";
        TextQuestion.numIds += 1;
        this.id = `text${TextQuestion.numIds}`;
    }
} 
export class NumericQuestion extends AbstractQuestion {
    type: "number";
    // question: string;
    // min: number;
    // max: number;
    static numIds = 0;

    constructor(public question: string = "", public min:number = 0, public max:number = 0, condition:Condition = null) {
        super(condition);
        this.type = "number";
        NumericQuestion.numIds += 1;
        this.id = `number${NumericQuestion.numIds}`;
    }
}
export class DateQuestion extends AbstractQuestion {
    type: "date";
    // question: string;
    // min: number;
    // max: number;
    static numIds = 0;

    constructor(public question: string = "", public min:number = 0, public max:number = 0, condition:Condition = null) {
        super(condition);
        this.type = "date";
        DateQuestion.numIds += 1;
        this.id = `date${DateQuestion.numIds}`;
    }
}
