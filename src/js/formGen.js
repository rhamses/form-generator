import Moment from "moment";
import Slug from "slug";

let draggables = document.querySelectorAll(".draggable");
let dropTarget = document.querySelector("#target");
let jsonButton = document.querySelector("#genJson");
let allButtons = '';
let allCheckRadio = '';
let index = 0;
const form = [];

dropTarget.addEventListener("drop", drop_handler);
dropTarget.addEventListener("dragover", dragover_handler);
dropTarget.addEventListener("dragenter", dragenter_handler);
dropTarget.addEventListener("dragleave", dragleave_handler);
draggables.forEach( draggable => draggable.addEventListener("dragstart", dragstart_handler));

jsonButton.addEventListener("click", createFormHtml);

function dragstart_handler(ev) 
{
  // Add the target element's id to the data transfer object
  ev.dataTransfer.setData("text/plain", ev.target.dataset.type);
  ev.dropEffect = "move";
}

function dragover_handler(ev) 
{
  ev.preventDefault();
  // Set the dropEffect to move
  ev.dataTransfer.dropEffect = "move"
}

function dragenter_handler(ev) 
{
  ev.preventDefault();
  console.log('entered', ev.target);
  if (ev.target.id == "target") {
    ev.target.classList.add("hovering")
    // console.log('Comentário');
  }
}

function dragleave_handler(ev) 
{
  ev.preventDefault();
  console.log('leavered', ev.target);
  checkChildTarget();
}

function drop_handler(ev) 
{
  ev.preventDefault();
  let droppedZone = '';
  if (ev.target.id == "target" || ev.target.id == "intro") {
    droppedZone = checkChildTarget(ev.target);
    const htmlEl = createInputElement(ev.dataTransfer.getData("text/plain"));
    let el = document.createElement("div");
    el.setAttribute("class", "form--item form--item__wrapper");
    el.innerHTML = htmlEl;
    droppedZone.appendChild(el);
    loadElements();
  } 
}

function createInputElement(htmlType)
{
  let el = '',
  inputType = '',
  inputValidation = '';
  const options = formFilters(index++);

  switch(htmlType){
    case "input":
    inputType = `<input disabled type="text" name="inputText" placeholder="Insira sua informações aqui...">`;
    inputValidation = ` ${options.inputType} ${options.validation.required} ${options.validation.disabled}`;
    break;
    case "radio":
    inputType = `<input disabled type="radio">Item`;
    inputValidation = `${options.validation.required} <div class="child--item__wrapper"><button class="child--items__button">Adicionar novo</button>${options.select.items}</div>`;
    break;
    case "checkbox":
    inputType = `<input disabled type="checkbox">Item`;
    inputValidation = `${options.validation.required} <div class="child--item__wrapper"><button class="child--items__button">Adicionar novo</button>${options.select.items}</div>`;
    break;
    case "select":
    inputType = `<select disabled name="inputSelect" class="sampleSelect"></select>`;
    inputValidation = `${options.validation.required} ${options.select.all} <div class="child--item__wrapper"><button class="child--items__button">Adicionar novo</button>${options.select.items}</div>`;
    break;
    case "button":
    inputType = `<button disabled name="inputButton" class="sampleButton">Nome do Campo:</input>`;
    inputValidation = `${options.validation.required}`; 
    break;
    case "upload":
    inputType = `<input type="file" disabled>`;
    inputValidation = `${options.validation.required} ${options.select.all}`; 
    break;
  }

  el = `<div class="action--wrapper">
  <button type="button" class="arrow-w" data-action="toogleView">Toggle View</button>
  <button type="button" class="delete" data-action="delete">Delete Field</button>
  </div>
  <h2 class="form--title"><span contenteditable>Nome do Campo:</span></h2>
  <div class="input-highlight">${inputType}</div>
  ${inputValidation}`;
  return el;
}

function inputElementControls()
{
  if (this.dataset.action == "toogleView") {
    let item = this.closest(".form--item__wrapper");
    if (item.classList.contains("hide")) {
      item.classList.remove("hide");
    } else {
      item.classList.add("hide");
    }
  } else {
    let parentEl = this.parentElement.parentElement;
    document.getElementById("target").removeChild(parentEl);
    checkChildTarget();
  }
}

function formFilters(index = 0)
{
  return  {
    inputType: `<select name="inputType-${index}" class="inputType">
    <optgroup label="Tradicionais">
    <option value="text">Texto</option>
    <option value="textarea">Área de Texto</option>
    <option value="email">Email</option>
    <option value="number">Número</option>
    </optgroup>
    <optgroup label="Links e Urls">
    <option value="url">Url</option>
    <option value="tel">Telefone</option>
    </optgroup>
    <optgroup label="Datas e Horários">
    <option value="date">Data</option>
    <option value="datetime-local">Data e Horário</option>
    <option value="time">Horário</option>
    </optgroup>
    <optgroup label="Especiais">
    <option value="range">Slider</option>
    <option value="color">Cores</option>
    </optgroup>
    </select>`,
    validation: {
      required: `<label class="option--container"><input type="checkbox" name="isRequired-${index}" value="isRequired">Required: </label>`,
      disabled: `<label class="option--container"><input type="checkbox" name="isDisabled-${index}" value="isDisabled">Disabled: </label>`,
      currentTime: `<label class="option--container"><input type="checkbox" name="isCurrent-${index}" value="isCurrent">Current Time: </label>`,
      regex: `<label class="option--container"><input type="checkbox" name="whichType-${index}" value="regex">Regex:</label>`,
    },
    select: {
      one: '<label class="option--container"><input type="checkbox" name="singleSelect-${index}" value="singleSelect">Single Select:</label>',
      all: '<label class="option--container"><input type="checkbox" name="multipleSelect-${index}" value="multipleSelect">Multiple Select:</label>',
      items: '<div class="child--items"><input type="text" name="childItem[]"><button class="child--items__button delete">Remover Item</button></div>',
    }
  }
}

function inputTitle()
{
  if (this.nextElementSibling.children.item("button")) {
    this.nextElementSibling.children.item("button").innerHTML = this.children.item("span").innerHTML;
  } 
}

function addChild()
{
  if (this.innerHTML.match(/adicionar/i)) {
    const item = formFilters();
    const parent = this;
    parent.insertAdjacentHTML('afterEnd', item.select.items);
    loadElements();
  } else {
    const parent = this.parentElement;
    parent.remove();
  }
}

function selectedOption()
{
  if (this.value.match(/date|time|datetime-local/)) {
    if (this.nextSibling.children == null) {
      const index = this.name.split("-")[1];
      const options = formFilters(index);
      this.insertAdjacentHTML("afterEnd", options.validation.currentTime);
    }
  }
}

function loadElements()
{
  const allFormTitles = document.querySelectorAll('.form--title');
  const allChildTeams = document.querySelectorAll('.child--items input[type=text]');
  const allCheckRadio = document.querySelectorAll("#target input"); 
  const allButtons = document.querySelectorAll("button[data-action]");
  const allChildItemsButtons = document.querySelectorAll(".child--items__button");
  const allInputTypes = document.querySelectorAll(".inputType");

  allButtons.forEach(button => button.addEventListener("click", inputElementControls));
  // allCheckRadio.forEach(button => button.addEventListener("click", inputFormat));
  allFormTitles.forEach(title => title.addEventListener("keyup", inputTitle));
  allChildTeams.forEach(title => title.addEventListener("keyup", inputTitle));
  allChildItemsButtons.forEach(title => title.addEventListener("click", addChild));
  allInputTypes.forEach(title => title.addEventListener("change", selectedOption));
}

function generateJson()
{
  const items = Array.from(document.querySelectorAll(".form--item"));
  const templateName = document.querySelector('input[name="frmTemplate"]').value;
  const jsonObject = [];
  let formNameSpace = 'frm';

  jsonObject.push({formName: templateName});

  if (templateName) {
    for (let str of templateName.split(" ")) {
      console.log('str', str);
      formNameSpace += str[0].toUpperCase();
    }
  }

  for (let item of items) {
    const childrens = Array.from(item.children);
    const childItems = [];
    const optionChecked = [];
    const objItem = {};
    let title = '';
    let option = '';
    let required = '';

    childrens.map((el, index, array) => { 
      if (el.classList.contains("form--title")) {
        // clean input
        title = el.children.item("span").innerHTML;
        objItem["title"] = title;
        objItem["slug"] = `${formNameSpace}${Slug(title)}`;
      }

      if (el.classList.contains("input-highlight")) {
        let input = '';
        if (el.children[0].tagName.toLowerCase() == "input") {
          input = el.children[0].type;
        } else {
          input = el.children[0].tagName.toLowerCase();
        }
        objItem["type"] = input;
      }

      if (el.classList.contains("inputType")) {
        objItem["type"] = el.value;
      }

      if (el.classList.contains("option--container")) {
        if (el.children.item('input').checked) {
          if (el.children.item('input').value == "isRequired") {
            required = true;
            objItem["required"] = required;
          } else {
            optionChecked.push(el.children.item('input').value);
            objItem["options"] = optionChecked;
          }
        }
      }

      if (el.classList.contains("child--item__wrapper")) {
        const childItems = Array.from(el.children);
        const childItemArray = [];
        childItems.map((el, index, array) => {
          if (el.firstElementChild) {
            if (el.firstElementChild.tagName.toLowerCase() == "input") {
              if (el.firstElementChild.value.length > 0) {
                childItemArray.push(el.firstElementChild.value);
              }
            }
          }
        });
        objItem["childItems"] = childItemArray;
      }

      if ((index + 1) == array.length) {
        jsonObject.push(objItem);
      }
    })
  }
  return jsonObject;
}

function createFormHtml()
{
  const jsonForm = generateJson();
  const result = document.querySelector("#result");
  const preview = document.querySelector("#preview");

  const form = document.createElement("form");

  jsonForm.map((el, index, array) =>{
    let input = '';
    let type = '';
    let attr = '';
    let childItem = '';
    let value = '';
    let select = '';
    let label = '';
    let legend = '';
    let component = '';

    form.classList.add("form--wrapper");

    if (el.formName != null) {
      form.id = `frm${Slug(el.formName)}`;
      component = `<legend>${el.formName}</legend>`;
    }

    if (el.required) {
      attr = 'required';
    }

    if (el.options) {
      for (let option of el.options) {
        if (option == "isCurrent") {
          value = Moment().format('Y-MM-DD');
        }
        if (option == "isDisabled") {
          attr += " disabled";
        }
        if (option == "multipleSelect") {
          attr += " multiple";
        }
      }
    }

    if (el.childItems) {
      if (el.type != "select") {
        input = '';
        for (item of el.childItems) {
          input += `<label><input name="${el.slug}" type="${el.type}" value="${item}" ${attr}>${item}</label>`;
        }
      } else {
        for (let item of el.childItems) {
          childItem += `<option value="${item}">${item}</option>`;
        }
        input += `${childItem} </select>`;
      }
    }

    if (el.type) {
      switch (el.type) {
        case 'select':
        label = `<label>${el.title}</label>`;
        input = `<select name="${el.slug}" id="${el.title}" ${attr}>`;
        break;
        case 'textarea':
        label = `<label>${el.title}</label>`;
        input = `<textarea name="${el.slug}" value="${value}" ${attr}></textarea>`;  
        break;
        case 'button':
        input = `<button type="button" id="${el.title}">${el.title}</button>`;
        break;
        default:
        label = `<label>${el.title}</label>`;
        input = `<input name="${el.slug}" type="${el.type}" value="${value}" ${attr}>`;
        break;
      }
      component = `<div class="form--element">${label} ${input}</div>`;
    }

    form.insertAdjacentHTML('beforeEnd', component);
  });

  const buttonsWrapper = `<div class="form--element"><button type="submit" class="btn--submit">Enviar</button></div>`;
  form.insertAdjacentHTML('beforeend', buttonsWrapper);

  // print the results

  preview.innerText = '';
  preview.appendChild(form);

  // const htmlForm = form;\
  result.innerText = '';
  result.insertAdjacentHTML('beforeend', `<code> ${JSON.stringify(jsonForm)} </code>`);
  result.insertAdjacentHTML('beforeend', `<textarea class="resultado" readonly></textarea>`);
  result.children.item(1).innerText = document.querySelector("form").outerHTML;
}

function checkChildTarget(target = null)
{
  if (target !== null && target.id == "intro"){
    target.classList.add("hide");
    return document.querySelector("#target");
  } else {
    target = document.querySelector("#target");
    target.classList.remove('hovering');
    if (target.childNodes.length == 1) {
      target.firstChild.classList.remove("hide");
    }
    return target;
  }
}
