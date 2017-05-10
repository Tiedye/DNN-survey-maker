import {ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion} from './question-types';
export type Question = ChoiceQuestion | TextQuestion | NumericQuestion | DateQuestion;
