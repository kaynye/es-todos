import page from '/node_modules/page/page.mjs';
import checkConnectivity from './network.js';
import { addTodo,getAllTodo } from './api/todo.js';
import { setTodos, setTodo, getTodos,getFutureTodos,deleteFutureTodos } from './idb.js';


//Setup coversion function
Object.prototype.formToJson=function(form){
  var formElement = document.getElementsByTagName("form")[0],
      inputElements = formElement.querySelectorAll("input,textarea"),
      jsonObject = {};
  for(var i = 0; i < inputElements.length; i++){
      var inputElement = inputElements[i];
      jsonObject[inputElement.name] = inputElement.value;

  }
  return jsonObject;
}

Object.prototype.formToJsonString=function(form){
  var formElement = document.getElementsByTagName("form")[0],
      inputElements = formElement.querySelectorAll("input,textarea"),
      jsonObject = {};
  for(var i = 0; i < inputElements.length; i++){
      var inputElement = inputElements[i];
      jsonObject[inputElement.name] = inputElement.value;

  }
  return JSON.stringify(jsonObject);
}



const app = document.querySelector('#app .outlet');

const homeCtn = app.querySelector('[page=home]');
const createCtn = app.querySelector('[page=create]');

const pages = [
  homeCtn,   
  createCtn   
];


checkConnectivity({});
document.addEventListener('connection-changed', e => {
  let root = document.documentElement;
  document.offline = !e.detail;
  if (e.detail) {
    root.style.setProperty('--app-blue', '#007eef');
    getFutureTodos().then(function(listeTodoToCreate){
      console.log(listeTodoToCreate)
      if (listeTodoToCreate.length>0){
        for ( let todo of listeTodoToCreate){
          let oldId= todo["id"];
          delete todo["id"];
          fetch(window.config.api+"/todos",{
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(todo)
          }).then(function(response){
            if (response.status==201){
              deleteFutureTodos(oldId)
            }
          })
        }
      }
    })
    
  } else {
    root.style.setProperty('--app-blue', '#7D7D7D');
  }
});


fetch('/config.json')
  .then((result) => result.json())
  .then(async (config) => {
    console.log('[todo] Config loaded !!!');
    window.config = config;

    
    page('/', async () => {
      const module = await import('./views/Home.js');
      const Home = module.default;

      let todos = [];
      if (!document.offline) {
        const data = await getAllTodo();
        todos = await setTodos(data);
      } else {
        todos = await getTodos();
      }
      

      const el = Home(app, todos);
      el.addEventListener('create-todo', async ({ detail }) => {
        await setTodo(detail);
        if (!document.offline) {
          const result = await createTodo(detail);
          if (result !== false) {
            await setTodo(detail);
          }
        } else {
          detail.synced = true;
          await setTodo(detail);
          console.log('[todo] Todo created offline');
        }
      });
    });



    page('/create', async () => {
      const module = await import('./views/Create.js');
      const Create = module.default;
      Create(app);
    });
    
    page();


  });
page()