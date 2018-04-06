
let draggables = document.querySelectorAll(".draggable");
let dropTarget = document.querySelector("#target");
let jsonButton = document.querySelector("#genJson");
let allButtons = '';
let allCheckRadio = '';
let index = 0;
const form = [];

dropTarget.addEventListener("drop", drop_handler);
dropTarget.addEventListener("dragover", dragover_handler);
draggables.forEach( draggable => draggable.addEventListener("dragstart", dragstart_handler));

jsonButton.addEventListener("click", function(){
  // const jsonForm = generateJson();
  const jsonForm = [{
    "title":"Email:",
    "type":"text",
    "option":"isEmail"
  },
  {
    "title":"Sexo:",
    "type":"radio",
    "required":true,
    "childItems":["mas", "fem"]
  },{
    "title":"Cor:",
    "type":"checkbox",
    "childItems":["zaul", "yellow"]
  },{
    "title":"Signo:",
    "type":"select",
    "childItems":["Aries", "Peixes"]
  },{
    "title":"Enviar",
    "type":"button"
  }];
  console.log('resposta', jsonForm);
  // example result
  const result = document.querySelector("#result");
  const preview = document.querySelector("#preview");

  result.insertAdjacentHTML('beforeend', `<code> ${JSON.stringify(jsonForm)} </code>`);

  const form = document.createElement("form");

  preview.appendChild(form);

  jsonForm.map((el, index, array) =>{
    let type = '';
    let attr = '';
    let childItem = '';
    let value = '';
    let select = '';

    if (el.type == "text") {
      if (el.option) {
        type = el.option;    
      }
    } else {
      type = el.type;
    }

    if (el.type == 'select') {
      input = `<select name="${el.title}" id="${el.title}" ${attr}>`;
    } else {
      input = `<input name="${el.title}" type="${type}" value="${value}" ${attr}>`;  
    }

    if (el.required) {
      attr = 'required';
    }

    if (el.childItems) {
      if (el.type != "select") {
        input = '';
        for (item of el.childItems) {
          input += `<input name="${el.title}" type="${type}" value="${item}" ${attr}>${item}`;
        }
      } else {
        for (item of el.childItems) {
          childItem += `<option value="${item}">${item}</option>`;
        }
        input += `${childItem} </select>`;
      }
    }

    let label = `<div class="form--element"><label>${el.title}</label>${input}</div>`;

    form.insertAdjacentHTML('beforeEnd', label);
  });

});

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

function drop_handler(ev) 
{
  ev.preventDefault();
  const htmlEl = createFormElement(ev.dataTransfer.getData("text/plain"));
  let el = document.createElement("div");
  el.setAttribute("class", "form--item form--item__wrapper");
  el.innerHTML = htmlEl
  ev.target.appendChild(el);
  loadElements();
}

function createFormElement(htmlType)
{
  let el = '',
  inputType = '',
  inputValidation = '';
  const options = formFilters(index++);

  switch(htmlType){
    case "input":
    inputType = `<input type="text" name="inputText">`;
    inputValidation = `${options.validation.email}
    ${options.validation.number}
    ${options.validation.regex}
    ${options.validation.required}`;
    break;
    case "radio":
    inputType = `<input type="radio">Item`;
    inputValidation = `${options.validation.required} ${options.select.all} <div class="child--item__wrapper"><button class="child--items__button">Adicionar novo</button>${options.select.items}</div>`;
    break;
    case "checkbox":
    inputType = `<input type="checkbox">Item`;
    inputValidation = `${options.validation.required} ${options.select.one} <div class="child--item__wrapper"><button class="child--items__button">Adicionar novo</button>${options.select.items}</div>`;
    break;
    case "select":
    inputType = `<select name="inputSelect" class="sampleSelect"></select>`;
    inputValidation = `${options.validation.required} ${options.select.all} <div class="child--item__wrapper"><button class="child--items__button">Adicionar novo</button>${options.select.items}</div>`;
    break;
    case "button":
    inputType = `<button name="inputButton" class="sampleButton">Nome do Campo:</input>`;
    inputValidation = `${options.validation.required}`; 
    break;
  }

  el = `<button type="button" data-action="delete">Delete Field</button>
  <h2 class="form--title"><span contenteditable>Nome do Campo:</span> <i><small>do tipo ${htmlType}</small></i></h2>
  <div class="input-highlight">${inputType}</div>
  ${inputValidation}`;
  return el;
}

function formFilters(index = 0)
{
  return  {
    validation: {
      email: `<label class="option--container">Email? <input type="radio" name="whichType-${index}" value="isEmail"></label>`,
      number: `<label class="option--container">Número? <input type="radio" name="whichType-${index}" value="isNumber"></label>`,
      required: `<label class="option--container">Required: <input type="checkbox" name="isRequired-${index}" value="isRequired"></label>`,
      regex: `<label class="option--container">Regex?: <input type="radio" name="whichType-${index}" value="isRegex"></label>`
    },
    select: {
      one: '<label class="option--container">Single Select: <input type="checkbox" name="singleSelect-${index}" value="singleSelect"></label>',
      all: '<label class="option--container">Multiple Select: <input type="checkbox" name="multipleSelect-${index}" value="multipleSelect"></label>',
      items: '<div class="child--items"><input type="text" name="childItem[]"><button class="child--items__button">Remover Item</button></div>',
    }
  }
}

function deleteItem()
{
  let parentEl = this.parentElement;
  document.getElementById("target").removeChild(parentEl);
}

function inputTitle()
{
  // console.log('aaaa', this.name, this.name == "childItem[]", this.nextElementSibling.children, this, e);
  if (this.nextElementSibling.children.item("button")) {
    console.log('teste');
    this.nextElementSibling.children.item("button").innerHTML = this.children.item("span").innerHTML;
  } 
}

function addChild()
{
  console.log('Comentário', this.innerHTML);
  if (this.innerHTML.match(/adicionar/i)) {
    const item = formFilters();
    const parent = this.parentElement;
    const wrapper = parent.parentElement;
    parent.insertAdjacentHTML('beforeend', item.select.items);
    loadElements();
  } else {
    const parent = this.parentElement;
    parent.remove();
  }
}

function loadElements()
{
  allFormTitles = document.querySelectorAll('.form--title');
  allChildTeams = document.querySelectorAll('.child--items input[type=text]');
  allCheckRadio = document.querySelectorAll("#target input"); 
  allButtons = document.querySelectorAll("button[data-action]");
  allChildItemsButtons = document.querySelectorAll(".child--items__button");

  allButtons.forEach(button => button.addEventListener("click", deleteItem));
  // allCheckRadio.forEach(button => button.addEventListener("click", inputFormat));
  allFormTitles.forEach(title => title.addEventListener("keyup", inputTitle));
  allChildTeams.forEach(title => title.addEventListener("keyup", inputTitle));
  allChildItemsButtons.forEach(title => title.addEventListener("click", addChild));
}

function generateJson()
{
  const items = Array.from(document.querySelectorAll(".form--item"));
  const jsonObject = [];
  for (item of items) {
    const childrens = Array.from(item.children);
    const objItem = {};
    const childItems = [];
    let title = '';
    let option = '';
    let required = '';

    childrens.map((el, index, array) => { 

      if (el.classList.contains("form--title")) {
        // clean input
        title = el.children.item("span").innerHTML;
        objItem["title"] = title;
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

      if (el.classList.contains("option--container")) {
        if (el.children.item('input').checked) {
          if (el.children.item('input').value == "isRequired") {
            required = true;
            objItem["required"] = required;
          } else {
            option = el.children.item('input').value;
            objItem["option"] = option;
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

    /*
    form: {
    fields: [
      {
        label: nome do campo,
        name: label-sanitized,
        type: type do campo,
        isRequired: true/false,
        pattern: null/regex,
        items: null/array
      }
    ]
    }

    */