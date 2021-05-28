class TodoApp {
  constructor() {
    this.baseUrl = "http://localhost:4730/todos";
    this.todos = [];
    this.listElement = document.querySelector("#todo-list");
    this.addButton = document.querySelector("#add-button");
    this.textInput = document.querySelector("#todo-input");
    this.deleteButton = document.querySelector("#delete-button");

    // Eventhandlers
    this.addButton.addEventListener("click", this.addNewTodo);
    this.listElement.addEventListener("change", this.updateTodoStatus);
    this.deleteButton.addEventListener("click", this.removeDoneTodos);

    this.loadTodosFromBackend();
  }

  loadTodosFromBackend() {
    fetch(this.baseUrl)
      .then((response) => response.json())
      .then((todosFromApi) => {
        this.todos = todosFromApi;
        this.renderTodos();
      });
  }

  renderTodos() {
    this.todos.forEach((todo) => {
      this.renderTodo(todo);
    });
  }

  renderTodo(todo) {
    const liElement = document.createElement("li");
    liElement.innerText = todo.description;

    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.checked = todo.done;
    liElement.appendChild(checkBox);

    liElement.todo = todo;

    this.listElement.appendChild(liElement);
  }

  addNewTodo = () => {
    const newTodoText = this.textInput.value;
    if (newTodoText.length < 5) {
      return;
    }

    const body = {
      description: newTodoText,
      done: false,
    };

    fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(body),
    })
      .then((response) => response.json())
      .then((newTodoObj) => {
        this.textInput.value = "";
        this.todos.push(newTodoObj);
        this.renderTodo(newTodoObj);
      });
  };

  updateTodoStatus = (e) => {
    const newCheckedStatus = e.target.checked;
    const todoObj = e.target.parentElement.todo;

    todoObj.done = newCheckedStatus;
    const putUrl = this.baseUrl + "/" + todoObj.id;
    fetch(putUrl, {
      method: "PUT",
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: JSON.stringify(todoObj),
    }).then(
      (response) => {
        if (response.ok === true) {
          return response.json();
        } else {
          e.target.checked = !newCheckedStatus;
          todoObj.done = !newCheckedStatus;
        }
      },
      () => {
        e.target.checked = !newCheckedStatus;
        todoObj.done = !newCheckedStatus;
      }
    );
  };

  removeDoneTodos = () => {
    const todosToDelete = this.todos.filter((todo) => todo.done === true);

    todosToDelete.forEach((deleteTodo) => {
      fetch(this.baseUrl + "/" + deleteTodo.id, {
        method: "DELETE",
      })
        .then((response) => response.json())
        .then(() => {
          this.todos = this.todos.filter((todo) => todo.id !== deleteTodo.id);

          let foundLi = undefined;
          const len = this.listElement.children.length;
          for (let i = 0; i < len; i++) {
            const li = this.listElement.children[i];
            if (li.todo.id === deleteTodo.id) {
              foundLi = li;
              break;
            }
          }

          if (foundLi) {
            foundLi.remove();
          }
        });
    });
  };
}

new TodoApp();
