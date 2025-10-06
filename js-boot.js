let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let customCategories = JSON.parse(localStorage.getItem('customCategories')) || ['旅行', '健康'];
const reservedCategories = new Set(['全部', '工作', '学习', '生活', '购物', '其他']);

document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
    renderCustomCategories();
    updateStats();
});

function renderTasks() {
    const taskList = document.getElementById('taskList');
    if (!taskList) return;
    if (!tasks.length) {
        taskList.innerHTML = '<div class="empty-state">暂无任务</div>';
        return;
    }
    taskList.innerHTML = tasks.map(t => `<li class="task-item"><span class="task-text">${t.text || ''}</span></li>`).join('');
}

function renderCustomCategories() {
    const box = document.getElementById('customCategoriesContainer');
    if (!box) return;
    box.innerHTML = customCategories.map(c => `<span class="custom-category-tag">${c}</span>`).join('');
}

function updateStats() {
    const total = tasks.length;
    const done = tasks.filter(x => x.completed).length;
    const a = document.getElementById('totalTasks');
    const b = document.getElementById('completedTasks');
    if (a) a.textContent = total;
    if (b) b.textContent = done;
}
