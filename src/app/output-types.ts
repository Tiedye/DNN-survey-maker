import { Condition } from './condition';
import { GetBlankCondition } from './util';

export class BasicOutput {
    type: "basic";
    constructor(
        public id:string = "basic",
        public content: string = "", 
        public display: boolean = true, 
        public condition: Condition = null) {
        this.type = "basic";
    }
}