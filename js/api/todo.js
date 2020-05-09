export async function getAllTodo() {
  const config = window.config;
  return fetch(`${config.api}/todos`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
  .then(result => result.json())
  .catch(error => {
    console.error(error);
    return false;
  });
}

export async function addTodo(data) {
  const config = window.config;
  return fetch(`${config.api}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(result => result.json())
  .catch(error => {
    console.error(error);
    return false;
  }); 
}
