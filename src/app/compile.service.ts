import { Injectable } from '@angular/core';

import { OutputContent, OutputGroup } from './output';
import { Question } from './question';
import { Page } from './page';
import { ChoiceQuestion, DateQuestion, NumericQuestion, TextQuestion } from './question-types';
import { Config } from './config';

@Injectable()
export class CompileService {

  constructor() { }

  compile(config:Config) {
    let pages = config.pages;
    let outputs = config.outputs;
    let htmlOutput = "";
    function html(s:string) {htmlOutput+=s;}
    let styleOutput = "";
    function style(s:string) {styleOutput+=s;}
    let scriptOutput = "";
    function script(s:string) {scriptOutput+=s;}

    function qHead(q:Question) {
      return `<div class="qustn qustn-type-${q.type}" data-type="${q.type}" data-id="${q.id}">`;
    }

    html(`
    <div class="survey">
      <div class="container"><div class="row"><div class="col-sm-12">
        ${pages.map((p, i) => `
        <div class="page" data-page-num="${i}">
          <h1>${p.title}</h1>
          ${p.questions.map(q => {
            switch(q.type) {
              case 'choice':
              return `
              ${qHead(q)}
                <div class="qustn-text">${q.question}</div>
                <div class="qustn-input">
                  <select class="input">
                    <option value="null"></option>
                    ${q.choices.map(choice => `<option value="${choice.value}">${choice.name}</option>`).join("")}
                  </select>
                </div>
              </div>`;
              case 'text':
              return `
              ${qHead(q)}
                <div class="qustn-text">${q.question}</div>
                <div class="qustn-input">
                  <input class="input" type="text">
                </div>
              </div>`;
              case 'number':
              return `
              ${qHead(q)}
                <div class="qustn-text">${q.question}</div>
                <div class="qustn-input">
                  <input class="input" type="number" min="${q.min}" max="${q.max}">
                </div>
              </div>`;
              case 'date':
              return `
              ${qHead(q)}
                <div class="qustn-text">${q.question}</div>
                <div class="qustn-input">
                  <input class="input" type="date">
                </div>
              </div>`;
              case 'header':
              return `
              ${qHead(q)}
                <h${q.level}>${q.name}</h${q.level}>
              </div>`;
              default:
            }
          }).join('')}
        </div>
        `).join('')}
        <div id="output"></div>
        <div class="survey-nav form-group">
          <button type="button" class="btnBack DefaultBackground">Back</button>
          <button type="button" class="btnNext DefaultBackground">Next</button>
          <button type="button" class="btnFinish DefaultBackground">Finish</button>
        </div>
        <div class="alert alert-danger error">

        </div>
      </div></div></div>
    </div>
    `);

    script(`
    let pages = new Map([${pages.map((p, i) => `[${i}, {
      num:${i}, 
      active:${p.condition ? 'false' : 'true'}, 
      title:'${p.title}', 
      fields: [${p.questions.map(q => `{
        id:'${q.id}', 
        active:${q.condition ? 'false' : 'true'}, 
        parent:${i}, 
        condition: ${JSON.stringify(q.condition)}}`).join(',')}], 
      condition: ${JSON.stringify(p.condition)}
    }]`).join(',')}]);
    let fields = new Map([].concat.apply([], Array.from(pages.values()).map(p => p.fields.map(q => [q.id, q])) ));

    function selectQuestion(id) {
      return $('.qustn[data-id='+id+']');
    }    
    function selectPage(num) {
      return $('.page[data-page-num='+num+']');
    }

    function getValue(id) {
      let elem = selectQuestion(id);
      let val = elem.find('.input').val();
      let type = elem.data('type');
      return {val: fields.get(id).active ? val === '' ? 'null' : val : 'null', type: type};
    }

    function checkCondition(condition) {
      if (!fields.has(condition.questionId)) {
        console.log('No such field: '+condition.questionId);
        return false;
      }
      let val, type;
      let result = getValue(condition.questionId);
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
      let elem;
      if (typeof id === 'number') {
        if (pages.has(id)) {
          elem = pages.get(id);
        } else {
          console.log('update: no such page: '+id);
          return false;
        }
      } else {
        if (fields.has(id)) {
          elem = fields.get(id);
        } else {
          console.log('update: no such question: '+id);
        }
      }
      if (elem.condition) {
        if (checkCondition(elem.condition)) {
          elem.active = true;
        } else {
          elem.active = false;
        }
      }
    }

    function updateVisibility(id) {
      if (fields.has(id)) {
        if (fields.get(id).active) {
          selectQuestion(id).show();
        } else {
          selectQuestion(id).hide();
        }
      }
    }

    function fullUpdate(id) {
      update(id);
      updateVisibility(id);
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
        deps.get(dependency).forEach(fullUpdate);
      }
    }

    function initChangeListener(id) {
      let e = selectQuestion(id);
      e.on('change', '.input', function(event) {
        updateDependents(id);
      });
    }

    pages.forEach(p => {
      update(p.num);
      if (p.condition) {
        addDep(p.num, p.condition.questionId);
      }
    });
    fields.forEach(q => {
      update(q.id);
      if (q.condition) {
        addDep(q.id, q.condition.questionId);
      }
      initChangeListener(q.id);
    });

    $('input[type=date]').datepicker();
    $('input[type=date]').datepicker( "option", "dateFormat", 'yy-mm-dd' );

    function isLastPage(num) {
      for(++num; pages.has(num); ++num) {
        if (pages.get(num).active) {
          return false;
        }
      }
      return true;
    }

    function getNextPage(num) {
      for(++num; pages.has(num); ++num) {
        if (pages.get(num).active) {
          return num;
        }
      }
      return -1;
    }

    function isFirstPage(num) {
      for(--num; pages.has(num); --num) {
        if (pages.get(num).active) {
          return false;
        }
      }
      return true;
    }

    function getPrevPage(num) {
      for(--num; pages.has(num); --num) {
        if (pages.get(num).active) {
          return num;
        }
      }
      return -1;
    }

    function showPage(num) {
      if (pages.has(num)) {
        selectPage(num).show();
        let page = pages.get(num);
        page.fields.forEach(q => {
          fullUpdate(q.id);
        });
      } else {
        console.log('showPages: no such page: '+num);
      }
    }

    function checkPage(num) {
      if (pages.has(num)) {
        return pages.get(num).fields.every(f => !f.active || getValue(f.id).val !== 'null');
      } else {
        console.log('checkPages: no such page: '+num);
        return false;
      }
    }

    let errorBox = $('.survey .error');
    let btnNext = $('.survey-nav .btnNext');
    let btnBack = $('.survey-nav .btnBack');
    let btnFinish = $('.survey-nav .btnFinish');
    btnNext.on('click', next);
    btnBack.on('click', back);
    btnFinish.on('click', finish);

    function updateNav() {
      if (isFirstPage(currentPage)) {
        btnBack.hide();
      } else {
        btnBack.show();
      }
      if (isLastPage(currentPage)) {
        btnFinish.show();
        btnNext.hide();
      } else {
        btnFinish.hide();
        btnNext.show();
      }
      errorBox.hide();
    }

    function back() {
      selectPage(currentPage).hide();
      --currentPage;
      showPage(currentPage);
      updateNav();
    }

    function next() {
      if (checkPage(currentPage)) {
        selectPage(currentPage).hide();
        ++currentPage;
        showPage(currentPage);
        updateNav();
      } else {
        errorBox.text('You must complete the form before moving on!');
        errorBox.show();
      }
    }

    function finish() {
      if (checkPage(currentPage)) {
        selectPage(currentPage).hide();
        $('.survey-nav').hide();
        errorBox.hide();
        renderOutput();
      } else {
        errorBox.text('You must complete the form before finishing up!');
        errorBox.show();
      }
    }

    pages.forEach(p => selectPage(p.num).hide());
    let currentPage = 0;
    showPage(currentPage);
    updateNav();

    let outputs = new Map([${outputs.map(out => `["${out.id}", ${JSON.stringify(out)}]`).join(',')}]);
    let order = [${outputs.filter(out => !out.hide).map(out => `"${out.id}"`).join(',')}];
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
          rendered.set(id, getValue(id).val);
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
    .survey input[type="submit"], .survey button {
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
    }
    #output p {
      padding-bottom: 0.5em;
    }
    #output li {
      padding-bottom: 0.2em;
      list-style-type: disc;
    }
    `);

    return {html:htmlOutput.replace(/\s+/g, ' '), style:styleOutput.replace(/\s+/g, ' '), script:scriptOutput.replace(/\s+/g, ' ')};
  }

}
