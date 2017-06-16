import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DragulaModule } from 'ng2-dragula';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ButtonsModule } from 'ngx-bootstrap/buttons';  

import { AppComponent } from './app.component';
import { QuestionBlockComponent } from './page-block/question-block/question-block.component';

import { CompileService } from './compile.service';
import { ConfigService } from './config.service';
import { ConditionComponent } from './condition/condition.component';
import { PageBlockComponent } from './page-block/page-block.component';
import { AutosizeDirective } from './autosize.directive';
import { OutputGroupComponent } from './output-group/output-group.component';
import { OutputContentComponent } from './output-group/output-content/output-content.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionBlockComponent,
    ConditionComponent,
    PageBlockComponent,
    AutosizeDirective,
    OutputGroupComponent,
    OutputContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DragulaModule,
    ModalModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [
    CompileService,
    ConfigService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
