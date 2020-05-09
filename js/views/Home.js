import { setTodos, setTodo, getTodos } from '../idb.js';
import page from '/node_modules/page/page.mjs';


export default function Home(pageH, data) {
  pageH.innerHTML = '';
  const constructor = document.createElement('div');
  constructor.innerHTML = `
    <section class="h-full" name="Home">
    <button class="ml-4 rounded-lg text-uppercase bg-blue-500  text-center px-3 text-white font-bold" id="retourButton" onclick="location.href='/create'" >Add</button>
      <section class="todolist">
        <ul></ul>
      </section>
    </section>
  `;

  

  const view = constructor
    .querySelector('[name="Home"]')
    .cloneNode(true);
  console.log(page)
  view.querySelector("[id=retourButton]").onclick=function(){
    page.redirect('/create');
  }
  let divUl=view.querySelector("ul");

  data=data.reverse()

  for ( let item of data){
    let divTodo=document.createElement("div")
    divTodo.classList.add("card")
    let todo=document.createElement("div")
    todo.innerHTML=`<div class="max-w-sm w-full lg:max-w-full lg:flex">
    <div class="h-10 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" >
    </div>
    <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
      <div style="display:flex" class="text-right">
        <p class="text-black-600" style="margin-right:0.5rem">Terminé</p>
        <input class="mr-2 leading-tight" type="checkbox"  ${item.checked} >
        <p class="text-red-900 text-right leading-none" name="delete" style="flex:auto">Delete</p>
      </div>
      <div class="mb-8">
        <div class="text-gray-900 font-bold text-xl mb-2">${item.titre}</div>
        <p class="text-gray-700 text-base">${item.description}</p>
      </div>
      <div class="flex items-center">
        <div class="text-sm">
          <p class="text-gray-900 leading-none">${item.username}</p>
          <!--<p class="text-gray-600">Aug 18</p>-->
        </div>
      </div>
    </div>
  </div>`

  todo.querySelector("input[type=checkbox]").onclick=function handleCheck(){
    let newItem=item;
    if (this.checked){
      newItem["checked"]="checked";
    }else{
      delete newItem["checked"];
    }
    
    fetch(`${config.api}/todos/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newItem)
    })
    .then(result => result.json()).catch( error => {
      let errorMsg=document.createElement("div")
      errorMsg.innerHTML=`
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Erreurs !</strong>
        <span class="block sm:inline">Erreurs, cette action n'est pas disponible hors connexion</span>
        <span class="absolute top-0 bottom-0 right-0 px-4 py-3">
          <svg class="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </span>
      </div>
      `
      errorMsg.querySelector("svg").onclick=function(){
        errorMsg.parentNode.removeChild(errorMsg);
      }
      document.getElementById("erreurs").appendChild(errorMsg)
      this.checked=!this.checked
    } )
  }


  todo.querySelector("[name=delete]").onclick=function(){

    fetch(`${config.api}/todos/${item.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item)
    })
    .then(result =>     page.redirect('/') )
  }


    divUl.appendChild(todo)
    
  }


  
  //app.appendChild(divTodo)
  

  // const form = view.querySelector('#addTodo');
  // const input = form.querySelector('input');
  // form.addEventListener('submit', e => {
  //   e.preventDefault();
  //   if (input.value === '') return console.warn('[todo] Value is required !!!');

  //   const todo = {
  //     id: Date.now(),
  //     title: input.value,
  //     synced: true,
  //     updated: false,
  //     done: false,
  //     date: Date.now()
  //   };

  //   const event = new CustomEvent('create-todo', { detail: todo });
  //   view.dispatchEvent(event);

  //   // Clean input
  //   input.value = '';
  // });

  pageH.appendChild(view);
  return view;
}
