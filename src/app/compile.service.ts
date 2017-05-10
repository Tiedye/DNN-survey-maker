import { Injectable } from '@angular/core';

import { OutputNode } from './output';
import { Question } from './question';

@Injectable()
export class CompileService {

  constructor() { }

  compile(questions: Question[], outputs: OutputNode[]) {
    let htmlOutput = "";
    function html(s:string) {htmlOutput+=s;}
    let styleOutput = "";
    function style(s:string) {styleOutput+=s;}
    let scriptOutput = "";
    function script(s:string) {scriptOutput+=s;}

    function qHead(q:Question, type:string) {
      return `<div id="${q.id}" class="qustn qustn-${type}" ${ 
              (q.condition !== null) ? `data-condition="${q.condition.questionId} 
              data-compare="${q.condition.compare} 
              data-compareMin="${q.condition.compareMin} 
              data-compareMax="${q.condition.compareMax} 
              data-comparator="${q.condition.comparator}` : ''
            }>
            <div class="qustn-text">${q.question}</div>
            <div class="qustn-input">`;
    }

    questions.forEach(q => {
      switch(q.type) {
        case 'choice':
          html(
            qHead(q, 'choice') + 
            `<select class="form-control">
            ${q.choices.map(choice => `<option value="${choice.value}">${choice.name}</option>`).join("")}
            </select>
            </div>
            </div>`
          );
          script(
            ``
          )
          break;
        case 'date':
          html(
            qHead(q, 'date') + 
            `<input class="form-control" type="date">
            </div>
            </div>`
          )
          break;
        case 'number':
          html(
            qHead(q, 'numder') + 
            `<input class="form-control" type="number" min="${q.min}" max="${q.max}">          
            </div>
            </div>`
          )
          break;
        case 'text':
          html(
            qHead(q, 'text') + 
            `<input class="form-control" type="text">
            </div>
            </div>`
          )
          break;
      }
    });

    outputs.forEach(n => {

    });

    return {html:htmlOutput, style:styleOutput, script:scriptOutput};
  }

}
