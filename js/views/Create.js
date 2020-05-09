import { setFuturTodo } from '../idb.js';
import page from '/node_modules/page/page.mjs';




export default function Create(pageH) {
  pageH.innerHTML = '';
  console.log('dd')
  const constructor = document.createElement('div');
  constructor.innerHTML = `

    <div class="w-full max-w-xs" name="Create">

  <form id="formAdd" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Nom de l'utilisateur
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="username" id="username" type="text" placeholder="Username">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="titre">
        Titre
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="titre" id="titre" type="text" placeholder="Tire">
    </div>
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="description">
        Description
      </label>
      <textarea class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="description" name="description" type="text" placeholder="Description"></textarea>
    </div>
    <div class="flex items-center justify-between">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" id="ajouter" type="button">
        Ajouter
      </button>
      <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="/">
        Retour
      </a>
    </div>
  </form>
</div>
  `;

  const view = constructor
    .querySelector('[name="Create"]')
    .cloneNode(true);
    
  view.querySelector("#ajouter").onclick=function(){
    //alert("haha")
    if (document.offline){
      let obj=Object.formToJson(view.querySelector("#formAdd"))
      obj["id"]=Date.now()
      setFuturTodo(obj).then(function(){page.redirect('/');})
    }else{
          fetch(window.config.api+"/todos",{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: Object.formToJsonString(view.querySelector("#formAdd"))
          })
            .then(function(response) {
              if (response.status==201){
                console.log(page)
                page.redirect('/');
              }
             
          })
    }
  }

  pageH.appendChild(view);
  return view;
}
