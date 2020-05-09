import { openDB } from 'idb';

export async function initDB() {
  const config = window.config;
  const db = await openDB('awesome-todo', config.version || 1, {
    upgrade(db) {
      // Create a store of objects
      const store = db.createObjectStore('todos', {
      // The 'id' property of the object will be the key.
      keyPath: 'id',
      });

      // store.createIndex('synced', 'synced');
      // store.createIndex('updated', 'updated');
      // store.createIndex('done', 'done');
      // store.createIndex('date', 'date');
      const storeToAdd = db.createObjectStore('todosToAdd', {
      // The 'id' property of the object will be the key.
      keyPath: 'id',
      });
      // Create an index on the 'date' property of the objects.
      // storeToAdd.createIndex('synced', 'synced');
      // storeToAdd.createIndex('updated', 'updated');
      // storeToAdd.createIndex('done', 'done');
      // storeToAdd.createIndex('date', 'date');
    },
  });
  return db;
}

export async function setTodos(data) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite');
  tx.store.clear()
  console.log(data)
  data.forEach(item => {
    tx.store.put(item);
  });
  await tx.done;
  return await db.getAll('todos');
}

export async function setTodo(data) {
  const db = await initDB();
  const tx = db.transaction('todos', 'readwrite');
  return await tx.store.put(data);
} 

export async function setFuturTodo(data) {
  const db = await initDB();
  const tx = db.transaction('todosToAdd', 'readwrite');
  return await tx.store.put(data);
} 

export async function getFutureTodos() {
  const db = await initDB();
  return await db.getAll('todosToAdd');
}
export async function getTodos() {
  const db = await initDB();
  return await db.getAll('todos');
}

export async function deleteFutureTodos(id) {
  const db = await initDB();
  return await db.delete('todosToAdd',id);
}