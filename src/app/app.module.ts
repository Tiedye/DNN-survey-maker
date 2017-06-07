import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { DragulaModule } from 'ng2-dragula';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FroalaViewModule, FroalaEditorModule } from 'angular2-froala-wysiwyg';
import { ButtonsModule } from 'ngx-bootstrap/buttons';  

import { AppComponent } from './app.component';
import { QuestionBlockComponent } from './question-block/question-block.component';
import { NodeBlockComponent } from './node-block/node-block.component';

import { CompileService } from './compile.service';
import { ConditionComponent } from './condition/condition.component';
import { PageBlockComponent } from './page-block/page-block.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestionBlockComponent,
    NodeBlockComponent,
    ConditionComponent,
    PageBlockComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DragulaModule,
    ModalModule.forRoot(),
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    ButtonsModule.forRoot()
  ],
  providers: [CompileService],
  bootstrap: [AppComponent]
})
export class AppModule { }
