import { Page } from './page';
import { OutputNode } from './output';

export interface SurveyProperties {
    title: string;
    disclaimer: string[];
}

export interface Config {
    properties: SurveyProperties;
    pages: Page[];
    outputs: OutputNode[];
}
