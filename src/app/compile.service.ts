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

    script(`
    function getValue(element) {
      let elem = $(element);
      let val = elem.find('.input').val();
      let type;
      if (elem.hasClass('qustn-choice')) {
        type = 'choice';
      } else if (elem.hasClass('qustn-date')) {
        type = 'date';
      } else if (elem.hasClass('qustn-number')) {
        type = 'number';
      } else if (elem.hasClass('qustn-text')) {
        type = 'text';
      }
      return {val: val, type: type};
    }

    function checkCondition(condition) {
      let checkee = $('#' + condition.questionId);
      let val, type;
      let result = getValue(checkee);
			val = result.val;
			type = result.type;
      switch (type) {
        case 'choice':
        case 'text':
          switch(condition.comparator) {
            case 'eq':
              return val === condition.compare;
            case 'ne':
              return val !== condition.compare;
            default:
              return false;
          }
        case 'date':
          val = new Date(val).time();
          condition.compare = new Date(condition.compare).time();
          condition.compareMIn = new Date(condition.compareMin).time();
          condition.compareMax = new Date(condition.compareMax).time();
        case 'number':
          val = parseFloat(val);
          condition.compare = parseFloat(condition.compare);
          condition.compareMin = parseFloat(condition.compareMin);
          condition.compareMax = parseFloat(condition.compareMax);
          switch (condition.comparator) {
            case 'eq': return val === condition.compare;
            case 'ne': return val !== condition.compare;
            case 'gt': return val > condition.compare;
            case 'lt': return val < condition.compare;
            case 'gte': return val >= condition.compare;
            case 'lte': return val <= condition.compare;
            case 'range': return condition.compareMin <= val && val <= condition.compareMax;
            default: return false;
          }
      }
    }

    function update(id) {
      let block = $('#'+id);
      let condition = block.data('condition');
      if (condition !== undefined) {
        let pCond = JSON.parse(atob(condition));
        if (checkCondition(pCond)) {
          block.show();
        } else {
          block.hide();
        }
      }
    }

    let deps = new Map();

    function addDep(dependent, dependency) {
      if (deps.has(dependency)) {
        deps.get(dependency).push(dependent);
      } else {
        deps.set(dependency, [dependent]);
      }
    }

    function updateDependents(dependency) {
      if (deps.has(dependency)) {
        deps.get(dependency).forEach(update);
      }
    }

    function initChangeListener(id) {
      let e = $('#' + id);
      e.on('change', '.input', function(event) {
        updateDependents(id);
      });
    }

    let fields = new Set([${questions.map(q => `'${q.id}'`).join(',')}]); 
    `);

    function qHead(q:Question, type:string) {
      return `<div id="${q.id}" class="qustn qustn-${type}" ${ 
              (q.condition !== null) ? `data-condition="${btoa(JSON.stringify(q.condition))}"` : ''
            }>
            <div class="qustn-text">${q.question}</div>
            <div class="qustn-input">`;
    }

    html(`
    <div class="survey">
      <div class="container"><div class="row"><div class="col-sm-12">
        <div id="quesitons">`)

    questions.forEach(q => {
      switch(q.type) {
        case 'choice':
          html(
            qHead(q, 'choice') + 
            `<select class="input">
            <option value="null"></option>
            ${q.choices.map(choice => `<option value="${choice.value}">${choice.name}</option>`).join("")}
            </select>
            </div>
            </div>`
          );
          break;
        case 'date':
          html(
            qHead(q, 'date') + 
            `<input class="input" type="text">
            </div>
            </div>`
          );
          break;
        case 'number':
          html(
            qHead(q, 'numder') + 
            `<input class="input" type="number" min="${q.min}" max="${q.max}">          
            </div>
            </div>`
          );
          break;
        case 'text':
          html(
            qHead(q, 'text') + 
            `<input class="input" type="text">
            </div>
            </div>`
          );
          break;
      }
      script(
        `update('${q.id}');
        ${(q.condition) ? `addDep('${q.id}', '${q.condition.questionId}');`:``}
        initChangeListener('${q.id}');
        `
      )
    });

    script(`
    $('input[type=date]').datepicker();
    $('input[type=date]').datepicker( "option", "dateFormat", 'yy-mm-dd' );
    `);

    html(`
    <div><input id="quesitonnaire-submit" type="submit" class="btn btn-primary"><span class="text-warning" id="err"></span></div>
    `);
    html(`</div>`);

    script(`
    let outputs = new Map([${outputs.map(out => `["${out.id}", ${JSON.stringify(out)}]`).join(',')}]);
    let order = [${outputs.filter(out => out.display).map(out => `"${out.id}"`).join(',')}];
    function renderOutput() {
      let unRendered = new Set(outputs.keys());
      let rendered = new Map();
      let output = '';
      function renderItem(id) {
        if(rendered.has(id)) {
        } else if(unRendered.has(id)) {
          unRendered.delete(id);
          let item = outputs.get(id);
          if (item.condition !== null && !checkCondition(item.condition)) {
            rendered.set(id, '');
          } else {
            rendered.set(id, item.content.replace(/\\[([^\\[\\]]*)\\]/g, (_, item) => renderItem(item)));
          }
        } else if (fields.has(id)) {
          rendered.set(id, getValue('#'+id).val);
        } else {
          console.log('Render error');
          return 'Was unable to render field';
        }
				return rendered.get(id);
      }
      for (let item of order) {
        output += renderItem(item);
      }
      $('#output').html(output);
    }
    `);
    html(`<div id="output"></div>`);
    html(`
      </div></div></div>
    </div>`);
    
    script(`
    function checkFilled() {
      return Array.from(fields).every(f => {
        let block = $('#'+f);
        let condition = block.data('condition');
        if (condition !== undefined && !checkCondition(JSON.parse(atob(condition)))) {
          return true;
        } else {
          return getValue(block).val !== 'null'
        }
      }); 
    }

    function submitQuestionnaire(event) {
      event.preventDefault();
      if (checkFilled()) {
        $('#quesitons').hide();
        renderOutput();
      } else {
        $('#err').text('You must complete the form!');
      }
    }
    $('#quesitonnaire-submit').on('click', submitQuestionnaire);
    `);

    style(`
    .survey input[type="text"], .survey input[type="date"], .survey input[type="number"], .survey textarea, .survey select {
      width: 100%;
      display: inline-block;
      padding: 12px 10px;
      background:#33383D;
      color: #ddd;
      font-size: 13px;
      font-family: 'Open Sans', sans-serif;
      border: 1px solid rgba(255,255,255,0.15);
      outline: none;
      margin: 0 0 20px;
    }
    .survey input[type="submit"] {
      display: inline-block;
      outline: none;
      padding: 10px 57px;
      font-size: 16px;
      font-family: 'Open Sans', sans-serif;
      font-weight: 300;
      transition: all 0.2s ease-in-out;
      color: #ffffff;
        border-radius: 4px;
      border:none;
    }
    .qustn-text {
      font-size: 130%;
      padding-bottom: 10px;
    }
    #output {
      color: #ddd;
    }
    #output p, #output li {
      font-size: 110%;
      padding-bottom: 10px;
    }
    `);

    return {html:htmlOutput.replace(/\s+/g, ' '), style:styleOutput.replace(/\s+/g, ' '), script:scriptOutput.replace(/\s+/g, ' ')};
  }

}
