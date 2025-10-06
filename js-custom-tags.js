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

function addTaskToCategory(category) {
    const taskInput = document.getElementById('taskInput');
    if (taskInput.value.trim() === '') return;
    const newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        completed: false,
        category: category,
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
    const categoryFilter = document.querySelector('.category-tab.active')?.textContent || '全部';
    let show = tasks;
    if (categoryFilter !== '全部') show = tasks.filter(t => t.category === categoryFilter);
    taskList.innerHTML = '';
    if (!show.length) {
        taskList.innerHTML = '<div class="empty-state">暂无任务</div>';
        return;
    }
    show.forEach(task => {
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

function filterTasks(filter, el) {
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    if (el) el.classList.add('active');
    renderTasks();
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

function saveCustomCategories() {
    localStorage.setItem('customCategories', JSON.stringify(customCategories));
}

function addCustomCategory() {
    const input = document.getElementById('newCategoryInput');
    const name = input.value.trim();
    if (name === '') return;
    if (reservedCategories.has(name)) {
        alert(`「${name}」为内置或保留分类，不能作为自定义分类。`);
        input.value = '';
        return;
    }
    if (customCategories.includes(name)) {
        alert(`已存在「${name}」分类。`);
        input.value = '';
        return;
    }
    customCategories.push(name);
    saveCustomCategories();
    renderCustomCategories();
    input.value = '';
}

function renderCustomCategories() {
    const box = document.getElementById('customCategoriesContainer');
    box.innerHTML = '';
    customCategories.forEach(c => {
        const tag = document.createElement('span');
        tag.className = 'custom-category-tag';
        tag.textContent = c;
        tag.setAttribute('role', 'button');
        tag.setAttribute('title', `点击可将上方输入框内容添加到「${c}」`);
        tag.onclick = () => addTaskToCategory(c);
        const del = document.createElement('button');
        del.className = 'delete-category-btn';
        del.title = `删除「${c}」`;
        del.textContent = '×';
        del.onclick = (e) => {
            e.stopPropagation();
            deleteCustomCategory(c);
        };
        tag.appendChild(del);
        box.appendChild(tag);
    });
}

function deleteCustomCategory(category) {
    if (category === '全部') return;
    if (!customCategories.includes(category)) return;
    const ok = confirm(`确定删除分类「${category}」吗？\n该分类下的任务将自动移动到「其他」。`);
    if (!ok) return;
    customCategories = customCategories.filter(x => x !== category);
    saveCustomCategories();
    let changed = false;
    tasks = tasks.map(t => {
        if (t.category === category) {
            changed = true;
            return {...t, category: '其他'};
        }
        return t;
    });
    if (changed) saveTasks();
    renderCustomCategories();
    renderTasks();
    updateStats();
}
