import { Condition } from './condition';
import { GetBlankCondition } from './util';
import { v4 } from 'uuid';

export class OutputContent {
    id:string = v4();
    constructor(
        public content: string = '',
        public style: string = '',
        public hide: boolean = false) {
    }
}

export class OutputGroup {
    id:string = v4();
    constructor(
        public items:OutputContent[] = [],
        public hide:boolean = false,
        public condition: Condition = null) {
    }
}