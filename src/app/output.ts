import { Condition } from './condition';
import { GetBlankCondition } from './util';
import { v4 } from 'uuid';

export class OutputContent {
    constructor(
        public content: string = '',
        public style: string = '',
        public hide: boolean = false,
        public id: string = v4()) {
    }
    regenId() { this.id = v4(); }
}

export class OutputGroup {
    constructor(
        public items: OutputContent[] = [],
        public pageBreak: boolean = false,
        public hide: boolean = false,
        public condition: Condition = null,
        public id: string = v4()) {
    }
    regenId() { this.id = v4(); }
}
