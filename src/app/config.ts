import { Page } from './page';
import { OutputGroup } from './output';

export interface SurveyProperties {
    title: string;
    disclaimer: string[];
}

export interface Config {
    properties: SurveyProperties;
    pages: Page[];
    outputs: OutputGroup[];
}

