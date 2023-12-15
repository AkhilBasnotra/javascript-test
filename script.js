document.addEventListener("DOMContentLoaded", loadTodo);

let btn = document.querySelector("#btn");
let addedTodos = document.querySelector(".addedTodos");
let donetodo = document.querySelector(".donetodo");
let url = "https://crudcrud.com/api/4f1a6603454e4d94a48f0cd6355e91a9/todos";

btn.addEventListener("click", addTodo);

function addTodo() {
  let todoName = document.querySelector("#todo-name").value;
  let description = document.querySelector("#description").value;

  let myTodo = {
    todoName,
    description,
    isTodoDone: false,
  };

  axios
    .post(url, myTodo)
    .then((response) => {
      console.log(response);
      responseTodo(response.data, addedTodos);
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadTodo() {
  axios
    .get(url)
    .then((response) => {
      console.log(response);
      let items = response.data;

      items.forEach((todo) => {
        if (!todo.isTodoDone) {
          responseTodo(todo, addedTodos); // Pass the container for remaining todos
        } else {
          responseTodo(todo, donetodo); // Pass the container for done todos
        }
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function removeFromServer(li) {
  axios
    .delete(`${url}/${li.dataset.id}`)
    .then((response) => {
      li.parentElement.removeChild(li);
    })
    .catch((error) => {
      console.log(error);
    });
}

function taskdone(li) {
  axios
    .put(`${url}/${li.dataset.id}`, {
      todoName: li.dataset.todoName,
      description: li.dataset.description,
      isTodoDone: true,
    })
    .then((response) => {
      donetodo.appendChild(li);
    })
    .catch((error) => {
      console.log(error);
    });
}

function responseTodo(data, container) {
  let li = document.createElement("li");
  li.dataset.id = data._id;
  li.dataset.todoName = data.todoName;
  li.dataset.description = data.description;

  let textNode = document.createTextNode(
    `${data.todoName} => ${data.description}`
  );
  li.appendChild(textNode);

  let doneTodoBtn = document.createElement("button");
  doneTodoBtn.classList = "done";
  doneTodoBtn.appendChild(document.createTextNode("✅"));
  doneTodoBtn.addEventListener("click", doneTodo);

  let delTodo = document.createElement("button");
  delTodo.classList = "delTodo";
  delTodo.appendChild(document.createTextNode("❌"));
  delTodo.addEventListener("click", removeTodo);

  li.appendChild(doneTodoBtn);
  li.appendChild(delTodo);
  container.appendChild(li);
}

function doneTodo(e) {
  if (e.target.classList.contains("done")) {
    let li = e.target.parentElement;
    taskdone(li);
  }
}

function removeTodo(e) {
  if (e.target.classList.contains("delTodo")) {
    let li = e.target.parentElement;
    removeFromServer(li);
  }
}
