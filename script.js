document.addEventListener("DOMContentLoaded", loadTodo);
let btn = document.querySelector("#btn");
let addedTodos = document.querySelector(".addedTodos");
let donetodo = document.querySelector(".donetodo");
let url = "https://crudcrud.com/api/685cbefe4d9748f2bad14627c1de425d/todos";

btn.addEventListener("click", addTodo);

function addTodo(e) {
  let todo = document.querySelector("#todo-name").value;
  let description = document.querySelector("#description").value;

  let mytodo = {
    todo,
    description,
    isTodoDone: false,
  };

  axios
    .post(url, mytodo)
    .then((response) => {
      newTodo(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadTodo() {
  axios
    .get(url)
    .then((response) => {
      let items = response.data;
      items.forEach((element) => {
        newTodo(element);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

function removeFromServer(li) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${url}/${li.dataset.id}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function removeItem(e) {
  if (e.target.classList.contains("delbtn")) {
    if (confirm("Are you sure")) {
      let li = e.target.parentElement;
      addedTodos.removeChild(li);
      removeFromServer(li);
    }
  }
}

function newTodo(mytodo) {
  let li = document.createElement("li");
  li.dataset.id = mytodo._id;
  li.appendChild(
    document.createTextNode(`${mytodo.todo} => ${mytodo.description}`)
  );

  let donebtn = document.createElement("button");
  donebtn.classList = "done";
  donebtn.appendChild(document.createTextNode(`✅`));
  donebtn.addEventListener("click", taskDone);

  let delBtn = document.createElement("button");
  delBtn.classList = "delbtn";
  delBtn.appendChild(document.createTextNode("❌"));
  delBtn.addEventListener("click", removeItem);

  li.appendChild(donebtn);
  li.appendChild(delBtn);
  addedTodos.appendChild(li);
}

function taskDone(e) {
  if (e.target.classList.contains("done")) {
    let li = e.target.parentElement;
    let todoId = li.dataset.id;

    axios
      .put(`${url}/${todoId}`, { isTodoDone: true })
      .then((response) => {
        moveTodoToDown(li);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

function moveTodoToDown(li) {
  li.removeChild(li.querySelector(".done"));
  li.removeChild(li.querySelector(".delbtn"));

  let newLi = document.createElement("li");
  newLi.appendChild(document.createTextNode(li.textContent));

  donetodo.appendChild(newLi);

  addedTodos.removeChild(li);
}
