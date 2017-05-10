import { Condition } from './condition';
import { GetBlankCondition } from './util';

export class BasicOutput {
    type: "basic";
    id: string;
    static numIds = 0;
    constructor(
        public content: string = "", 
        public display: boolean = true, 
        public condition: Condition = null) {
        this.type = "basic";
        this.id = `basic${++BasicOutput.numIds}`;

    }
}