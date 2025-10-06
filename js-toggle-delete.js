let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let customCategories = JSON.parse(localStorage.getItem('customCategories')) || ['旅行', '健康'];
const reservedCategories = new Set(['全部', '工作', '学习', '生活', '购物', '其他']);

document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    renderCustomCategories();
    updateStats();
});

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const categorySelect = document.getElementById('categorySelect');
    if (taskInput.value.trim() === '') return;
    const newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false,
        category: categorySelect.value,
        createdAt: new Date()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    updateStats();
    taskInput.value = '';
    taskInput.focus();
}

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!tasks.length) {
        taskList.innerHTML = '<div class="empty-state">暂无任务</div>';
        return;
    }
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${task.id})">
            <span class="task-text">${task.text}</span>
            <span class="task-category">${task.category}</span>
            <div class="task-actions">
                <button class="delete-btn" onclick="deleteTask(${task.id})">删除</button>
            </div>
        `;
        taskList.appendChild(li);
    });
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? {...t, completed: !t.completed} : t);
    saveTasks();
    renderTasks();
    updateStats();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
    updateStats();
}

function renderCustomCategories() {
    const box = document.getElementById('customCategoriesContainer');
    if (!box) return;
    box.innerHTML = customCategories.map(c => `<span class="custom-category-tag">${c}</span>`).join('');
}

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(x => x.completed).length;
    document.getElementById('totalTasks').textContent = total;
    document.getElementById('completedTasks').textContent = done;
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
