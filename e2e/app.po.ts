import { browser, element, by } from 'protractor';

export class SurveyMakerPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('surv-root h1')).getText();
  }
}
