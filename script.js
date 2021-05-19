const addButton = document.querySelector("#add-button");
const deleteButton = document.querySelector("#delete-button");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const radioContainer = document.querySelector("#radio-container");

/**
 * Eventhandler for keypress event on input
 * @param {*} e
 */
function addTodoOnEnter(e) {
  if (e.key.toLowerCase() === "enter") {
    addTodo();
  }
}
todoInput.addEventListener("keypress", addTodoOnEnter);

/**
 * Filter todo list when radio button selection
 * @param {*} e
 */
function filterTodos(e) {
  switch (e.target.value) {
    case "done":
      showDoneTodos();
      break;
    case "open":
      showOpenTodos();
      break;
    case "all":
      showAllTodos();
      break;
  }
}
radioContainer.addEventListener("change", filterTodos);

/**
 * add new todo every time the add button is clicked
 */
function addTodo() {
  const newTodoText = todoInput.value;
  if (newTodoText.length < 5) {
    return;
  }

  todoInput.value = "";

  const newTodoLi = document.createElement("li");
  newTodoLi.innerText = newTodoText;

  const checkBox = document.createElement("input");
  checkBox.setAttribute("type", "checkbox");
  newTodoLi.appendChild(checkBox);

  todoList.appendChild(newTodoLi);
}
addButton.addEventListener("click", addTodo);

/**
 * Show only done todos in list
 */
function showDoneTodos() {
  for (let li of todoList.children) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const isChecked = checkbox.checked;
    if (isChecked === false) {
      li.hidden = true;
    } else {
      li.hidden = false;
    }
  }
}

/**
 * Show only done todos in list
 */
function showOpenTodos() {
  for (let li of todoList.children) {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const isChecked = checkbox.checked;
    if (isChecked === true) {
      li.hidden = true;
    } else {
      li.hidden = false;
    }
  }
}

/**
 * Show all todos in list
 */
function showAllTodos() {
  for (let li of todoList.children) {
    li.hidden = false;
  }
}

/**
 * Change style of li depending on checkbox state
 * @param {*} e
 */
function changeTodoStyle(e) {
  if (e.target.checked === true) {
    e.target.parentElement.style.textDecoration = "line-through";
  } else {
    e.target.parentElement.style.textDecoration = "none";
  }
}
todoList.addEventListener("change", changeTodoStyle);

/**
 * Show only done todos in list
 */
function removeDoneTodos() {
  const children = todoList.children;
  const length = children.length - 1;

  for (let i = length; i >= 0; i--) {
    const li = children[i];
    const checkbox = li.querySelector('input[type="checkbox"]');
    const isChecked = checkbox.checked;
    if (isChecked === true) {
      li.remove();
    }
  }
}
deleteButton.addEventListener("click", removeDoneTodos);
