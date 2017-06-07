import {ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion, HeaderQuestion} from './question-types';
export type Question = ChoiceQuestion | TextQuestion | NumericQuestion | DateQuestion | HeaderQuestion;
