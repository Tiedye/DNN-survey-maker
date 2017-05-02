import { SurveyMakerPage } from './app.po';

describe('survey-maker App', () => {
  let page: SurveyMakerPage;

  beforeEach(() => {
    page = new SurveyMakerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('surv works!');
  });
});
