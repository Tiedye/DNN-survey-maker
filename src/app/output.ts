import { Condition } from './condition';
import { GetBlankCondition } from './util';

export type OutputNode = BasicOutput | OutputGroup;

export class BasicOutput {
    type: 'basic';
    constructor(
        public id:string = 'basic',
        public content: string = '',
        public style: string = '',
        public hide: boolean = false,
        public condition: Condition = null) {
        this.type = 'basic';
    }
}

export class OutputGroup {
    type: 'group';
    constructor(
        public id:string = 'group',
        public items:OutputNode[] = [],
        public hide:boolean = false,
        public condition: Condition = null) {
        this.type = 'group';
    }
}