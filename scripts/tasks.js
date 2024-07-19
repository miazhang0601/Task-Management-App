const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'login.html';
}

async function fetchTasks() {
    const response = await fetch('/tasks', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await response.json();
    document.getElementById('tasks').innerHTML = tasks.map(task => `
        <div>
            <input type="checkbox" ${task.completed ? 'checked' : ''} onclick="toggleTask(${task.id})">
            ${task.title}
            <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `).join('');
}

async function createTask() {
    const title = document.getElementById('taskTitle').value;
    await fetch('/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title })
    });
    document.getElementById('taskTitle').value = '';
    fetchTasks();
}

async function toggleTask(id) {
    const response = await fetch(`/tasks/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const task = await response.json();
    await fetch(`/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !task.completed })
    });
    fetchTasks();
}

async function deleteTask(id) {
    await fetch(`/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchTasks();
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

fetchTasks();
