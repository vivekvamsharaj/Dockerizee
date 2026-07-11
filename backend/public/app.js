const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const status = document.getElementById('status');

const API_URL = '/api/todos';

async function fetchTodos() {
  status.textContent = 'Loading...';
  try {
    const res = await fetch(API_URL);
    const todos = await res.json();
    renderTodos(todos);
    status.textContent = `${todos.length} todo(s)`;
  } catch (err) {
    status.textContent = 'Error loading todos. Is the backend running?';
  }
}

function renderTodos(todos) {
  list.innerHTML = '';
  todos.forEach((todo) => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    const span = document.createElement('span');
    span.textContent = todo.title;
    span.addEventListener('click', () => toggleTodo(todo));

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete';
    delBtn.addEventListener('click', () => deleteTodo(todo._id));

    li.appendChild(span);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

async function addTodo(title) {
  await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  fetchTodos();
}

async function toggleTodo(todo) {
  await fetch(`${API_URL}/${todo._id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: !todo.completed }),
  });
  fetchTodos();
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  fetchTodos();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = input.value.trim();
  if (!title) return;
  addTodo(title);
  input.value = '';
});

fetchTodos();
