// To-Do List App JavaScript

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.searchQuery = '';
        this.sortBy = 'created';
        this.init();
    }

    init() {
        this.loadTasks();
        this.setupEventListeners();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();
        this.checkOverdueTasks();
        
        // Check for overdue tasks every minute
        setInterval(() => this.checkOverdueTasks(), 60000);
    }

    setupEventListeners() {
        // Add task button
        document.getElementById('addTaskBtn').addEventListener('click', () => this.addTask());
        
        // Enter key in input field
        document.getElementById('taskInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });

        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.renderTasks();
            this.updateSearchClearButton();
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            document.getElementById('searchInput').value = '';
            this.searchQuery = '';
            this.renderTasks();
            this.updateSearchClearButton();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.setCategory(e.target.dataset.category);
            });
        });

        // Sort functionality
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.renderTasks();
        });

        // Clear buttons
        document.getElementById('clearCompletedBtn').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clearAllBtn').addEventListener('click', () => this.clearAll());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportTasks());

        // Quick add button
        document.getElementById('quickAddBtn').addEventListener('click', () => {
            document.getElementById('taskInput').focus();
        });
    }

    addTask() {
        const input = document.getElementById('taskInput');
        const text = input.value.trim();
        
        if (!text) {
            this.showNotification('Please enter a task description', 'error');
            return;
        }

        const category = document.getElementById('taskCategory').value;
        const priority = document.getElementById('taskPriority').value;
        const deadline = document.getElementById('taskDeadline').value;
        const recurring = document.getElementById('taskRecurring').value;

        const task = {
            id: Date.now() + Math.random(),
            text: text,
            completed: false,
            category: category,
            priority: priority,
            deadline: deadline ? new Date(deadline).getTime() : null,
            recurring: recurring,
            createdAt: Date.now(),
            completedAt: null
        };

        this.tasks.push(task);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();
        
        // Reset form
        input.value = '';
        document.getElementById('taskDeadline').value = '';
        document.getElementById('taskRecurring').value = 'none';
        
        this.showNotification('Task added successfully!', 'success');
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();
        this.showNotification('Task deleted successfully!', 'info');
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            task.completedAt = task.completed ? Date.now() : null;
            
            // Handle recurring tasks
            if (task.completed && task.recurring !== 'none') {
                this.createNextRecurringTask(task);
            }
            
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgress();
            
            const message = task.completed ? 'Task completed!' : 'Task marked as pending';
            this.showNotification(message, 'success');
        }
    }

    createNextRecurringTask(completedTask) {
        const nextTask = { ...completedTask };
        nextTask.id = Date.now() + Math.random();
        nextTask.completed = false;
        nextTask.completedAt = null;
        nextTask.createdAt = Date.now();

        // Calculate next occurrence
        const now = new Date();
        switch (completedTask.recurring) {
            case 'daily':
                nextTask.deadline = now.setDate(now.getDate() + 1);
                break;
            case 'weekly':
                nextTask.deadline = now.setDate(now.getDate() + 7);
                break;
            case 'monthly':
                nextTask.deadline = now.setMonth(now.getMonth() + 1);
                break;
        }

        this.tasks.push(nextTask);
        this.showNotification(`Next ${completedTask.recurring} task created!`, 'info');
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        this.renderTasks();
    }

    setCategory(category) {
        this.currentCategory = category;
        
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        this.renderTasks();
    }

    updateSearchClearButton() {
        const clearBtn = document.getElementById('clearSearchBtn');
        if (this.searchQuery) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
    }

    getFilteredTasks() {
        const now = Date.now();
        let filteredTasks = this.tasks;
        
        // Apply search filter
        if (this.searchQuery) {
            filteredTasks = filteredTasks.filter(task => 
                task.text.toLowerCase().includes(this.searchQuery) ||
                task.category.toLowerCase().includes(this.searchQuery)
            );
        }
        
        // Apply status filter
        switch (this.currentFilter) {
            case 'pending':
                filteredTasks = filteredTasks.filter(task => !task.completed);
                break;
            case 'completed':
                filteredTasks = filteredTasks.filter(task => task.completed);
                break;
            case 'overdue':
                filteredTasks = filteredTasks.filter(task => 
                    !task.completed && 
                    task.deadline && 
                    task.deadline < now
                );
                break;
        }
        
        // Apply category filter
        if (this.currentCategory !== 'all') {
            filteredTasks = filteredTasks.filter(task => task.category === this.currentCategory);
        }
        
        // Apply sorting
        filteredTasks.sort((a, b) => {
            switch (this.sortBy) {
                case 'deadline':
                    if (!a.deadline && !b.deadline) return 0;
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;
                    return a.deadline - b.deadline;
                case 'priority':
                    const priorityOrder = { high: 3, medium: 2, low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                case 'category':
                    return a.category.localeCompare(b.category);
                default: // created
                    return b.createdAt - a.createdAt;
            }
        });
        
        return filteredTasks;
    }

    renderTasks() {
        const taskList = document.getElementById('taskList');
        const emptyState = document.getElementById('emptyState');
        const tasksTitle = document.getElementById('tasksTitle');
        const filteredTasks = this.getFilteredTasks();

        // Update tasks title
        let title = 'All Tasks';
        if (this.currentFilter !== 'all') {
            title = this.currentFilter.charAt(0).toUpperCase() + this.currentFilter.slice(1) + ' Tasks';
        }
        if (this.currentCategory !== 'all') {
            title = this.currentCategory.charAt(0).toUpperCase() + this.currentCategory.slice(1) + ' Tasks';
        }
        if (this.searchQuery) {
            title = `Search Results for "${this.searchQuery}"`;
        }
        tasksTitle.textContent = title;

        if (filteredTasks.length === 0) {
            taskList.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        taskList.innerHTML = '';

        filteredTasks.forEach(task => {
            const taskElement = this.createTaskElement(task);
            taskList.appendChild(taskElement);
        });
    }

    createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''} ${task.priority}-priority`;
        
        // Add overdue class if task is overdue
        if (!task.completed && task.deadline && task.deadline < Date.now()) {
            li.classList.add('overdue');
        }

        const isOverdue = !task.completed && task.deadline && task.deadline < Date.now();
        const deadlineText = task.deadline ? this.formatDeadline(task.deadline, isOverdue) : '';
        const recurringText = task.recurring !== 'none' ? `🔄 ${task.recurring}` : '';
        const categoryText = this.getCategoryDisplayName(task.category);

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <div class="task-text">${this.escapeHtml(task.text)}</div>
                <div class="task-meta">
                    <span class="task-category ${task.category}">${categoryText}</span>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                    ${deadlineText ? `<span class="task-deadline">${deadlineText}</span>` : ''}
                    ${recurringText ? `<span class="task-recurring">${recurringText}</span>` : ''}
                </div>
            </div>
            <div class="task-actions">
                <button class="task-action-btn delete" title="Delete task">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Add event listeners
        const checkbox = li.querySelector('.task-checkbox');
        const deleteBtn = li.querySelector('.task-action-btn.delete');

        checkbox.addEventListener('change', () => this.toggleTask(task.id));
        deleteBtn.addEventListener('click', () => this.deleteTask(task.id));

        return li;
    }

    getCategoryDisplayName(category) {
        const categoryNames = {
            personal: '👤 Personal',
            work: '💼 Work',
            health: '🏃‍♂️ Health',
            learning: '📚 Learning',
            shopping: '🛒 Shopping',
            other: '📝 Other'
        };
        return categoryNames[category] || category;
    }

    formatDeadline(deadline, isOverdue) {
        const date = new Date(deadline);
        const now = new Date();
        const diff = date - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (isOverdue) {
            return `⚠️ Overdue by ${Math.abs(days)}d ${Math.abs(hours)}h`;
        } else if (days === 0) {
            return `⏰ Due in ${hours}h`;
        } else if (days === 1) {
            return `⏰ Due tomorrow`;
        } else {
            return `⏰ Due in ${days}d`;
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    clearCompleted() {
        const completedCount = this.tasks.filter(task => task.completed).length;
        this.tasks = this.tasks.filter(task => !task.completed);
        this.saveTasks();
        this.renderTasks();
        this.updateStats();
        this.updateProgress();
        this.showNotification(`${completedCount} completed tasks cleared!`, 'info');
    }

    clearAll() {
        if (this.tasks.length === 0) {
            this.showNotification('No tasks to clear!', 'warning');
            return;
        }

        if (confirm('Are you sure you want to delete all tasks? This action cannot be undone.')) {
            const taskCount = this.tasks.length;
            this.tasks = [];
            this.saveTasks();
            this.renderTasks();
            this.updateStats();
            this.updateProgress();
            this.showNotification(`${taskCount} tasks cleared!`, 'info');
        }
    }

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Tasks exported successfully!', 'success');
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const pending = total - completed;
        const overdue = this.tasks.filter(task => 
            !task.completed && 
            task.deadline && 
            task.deadline < Date.now()
        ).length;

        document.getElementById('totalTasks').textContent = total;
        document.getElementById('completedTasks').textContent = completed;
        document.getElementById('pendingTasks').textContent = pending;
        document.getElementById('overdueTasks').textContent = overdue;
    }

    updateProgress() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(task => task.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        
        document.getElementById('progressFill').style.width = `${percentage}%`;
        document.getElementById('progressText').textContent = `${percentage}% Complete`;
    }

    checkOverdueTasks() {
        const now = Date.now();
        const overdueTasks = this.tasks.filter(task => 
            !task.completed && 
            task.deadline && 
            task.deadline < now
        );

        if (overdueTasks.length > 0) {
            this.showNotification(`You have ${overdueTasks.length} overdue task(s)!`, 'warning');
        }
    }

    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        container.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    saveTasks() {
        try {
            localStorage.setItem('todoTasks', JSON.stringify(this.tasks));
        } catch (error) {
            console.error('Error saving tasks to localStorage:', error);
        }
    }

    loadTasks() {
        try {
            const saved = localStorage.getItem('todoTasks');
            if (saved) {
                this.tasks = JSON.parse(saved);
            }
        } catch (error) {
            console.error('Error loading tasks from localStorage:', error);
            this.tasks = [];
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});

// Add some sample tasks for demonstration (remove in production)
function addSampleTasks() {
    const app = window.todoApp;
    if (!app) return;

    const sampleTasks = [
        {
            text: 'Complete project documentation',
            category: 'work',
            priority: 'high',
            deadline: Date.now() + 24 * 60 * 60 * 1000, // Tomorrow
            recurring: 'none'
        },
        {
            text: 'Review team meeting notes',
            category: 'work',
            priority: 'medium',
            deadline: null,
            recurring: 'weekly'
        },
        {
            text: 'Update portfolio website',
            category: 'personal',
            priority: 'low',
            deadline: Date.now() + 7 * 24 * 60 * 60 * 1000, // Next week
            recurring: 'none'
        },
        {
            text: 'Go for a 30-minute run',
            category: 'health',
            priority: 'medium',
            deadline: Date.now() + 2 * 60 * 60 * 1000, // 2 hours
            recurring: 'daily'
        },
        {
            text: 'Learn React hooks',
            category: 'learning',
            priority: 'high',
            deadline: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
            recurring: 'none'
        },
        {
            text: 'Buy groceries for the week',
            category: 'shopping',
            priority: 'medium',
            deadline: Date.now() + 12 * 60 * 60 * 1000, // 12 hours
            recurring: 'weekly'
        }
    ];

    sampleTasks.forEach(taskData => {
        const task = {
            id: Date.now() + Math.random(),
            text: taskData.text,
            completed: false,
            category: taskData.category,
            priority: taskData.priority,
            deadline: taskData.deadline,
            recurring: taskData.recurring,
            createdAt: Date.now(),
            completedAt: null
        };
        app.tasks.push(task);
    });

    app.saveTasks();
    app.renderTasks();
    app.updateStats();
    app.updateProgress();
}

// Uncomment the line below to add sample tasks for demonstration
// setTimeout(addSampleTasks, 1000); 