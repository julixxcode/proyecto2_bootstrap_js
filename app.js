const todoList = document.getElementById("todo-list");
const todoForm = document.getElementById("todo-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dueDateInput = document.getElementById("dueDate");

const viewModal = new bootstrap.Modal(document.getElementById('viewModal'));
const editModal = new bootstrap.Modal(document.getElementById('editModal'));
const viewBody = document.getElementById("viewBody");
const editTitle = document.getElementById("editTitle");
const editDescription = document.getElementById("editDescription");
const editDueDate = document.getElementById("editDueDate");

let editId = null;

function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}
function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}
function renderTodos() {
  const todos = getTodos();
  todoList.innerHTML = "";
  
  if (todos.length === 0) {
    todoList.innerHTML = '<p class="text-center">No hay tareas</p>';
    return;
  }

  todos.forEach(todo => {
    const card = document.createElement("div");
    card.className = `card shadow-sm todo-card ${todo.completed ? "completed" : ""}`;

    card.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">${todo.title}</h5>
        <h6 class="card-subtitle text-muted mb-2">${todo.dueDate}</h6>
        <p class="card-text">${todo.description}</p>
        <div class="d-flex flex-wrap justify-content-between mt-2">
          <button class="btn btn-info btn-sm" onclick="viewTodo(${todo.id})">Ver</button>
          <button class="btn btn-success btn-sm" onclick="toggleComplete(${todo.id})">
            ${todo.completed ? 'Desmarcar' : 'Completar'}
          </button>
          <button class="btn btn-warning btn-sm" onclick="prepareEdit(${todo.id})">Editar</button>
          <button class="btn btn-danger btn-sm" onclick="deleteTodo(${todo.id})">Eliminar</button>
        </div>
      </div>
    `;

    todoList.appendChild(card);
  });
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dueDateInput.value;
  if (!title || !description || !dueDate) return;

  const todos = getTodos();
  const newTodo = { id: Date.now(), title, description, dueDate, completed: false };
  todos.push(newTodo);
  saveTodos(todos);
  todoForm.reset();
  renderTodos();
});

function viewTodo(id) {
  const todo = getTodos().find(t => t.id === id);
  if (!todo) return;
  viewBody.innerHTML = `
    <p><strong>Nombre:</strong> ${todo.title}</p>
    <p><strong>Descripción:</strong> ${todo.description}</p>
    <p><strong>Fecha de vencimiento:</strong> ${todo.dueDate}</p>
    <p><strong>Completada:</strong> ${todo.completed ? 'Sí' : 'No'}</p>
  `;
  viewModal.show();
}

function prepareEdit(id) {
  const todo = getTodos().find(t => t.id === id);
  if (!todo) return;
  editId = id;
  editTitle.value = todo.title;
  editDescription.value = todo.description;
  editDueDate.value = todo.dueDate;
  editModal.show();
}

document.getElementById("saveEdit").addEventListener("click", () => {
  const newTitle = editTitle.value.trim();
  const newDescription = editDescription.value.trim();
  const newDueDate = editDueDate.value;
  if (!newTitle || !newDescription || !newDueDate) return;

  const todos = getTodos();
  const index = todos.findIndex(t => t.id === editId);
  if (index !== -1) {
    todos[index].title = newTitle;
    todos[index].description = newDescription;
    todos[index].dueDate = newDueDate;
    saveTodos(todos);
    renderTodos();
    editModal.hide();
  }
});

function deleteTodo(id) {
  if (!confirm("¿Deseas eliminar esta tarea?")) return;
  let todos = getTodos().filter(t => t.id !== id);
  saveTodos(todos);
  renderTodos();
}

function toggleComplete(id) {
  const todos = getTodos();
  const index = todos.findIndex(t => t.id === id);
  if (index !== -1) {
    todos[index].completed = !todos[index].completed;
    saveTodos(todos);
    renderTodos();
  }
}

renderTodos();
