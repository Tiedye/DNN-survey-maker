import { Page } from './page';
import { OutputNode } from './output';

export interface Config {
    title: string;
    pages: Page[];
    outputs: OutputNode[];
}
