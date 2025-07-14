# To-Do List App

A modern, feature-rich to-do list application built with vanilla HTML, CSS, and JavaScript. Perfect for learning web development fundamentals!

## Features

### Core Features
- ✅ **Add Tasks**: Create new tasks with descriptions
- ✅ **Delete Tasks**: Remove tasks you no longer need
- ✅ **Mark as Completed**: Check off completed tasks
- ✅ **Task Priority**: Set priority levels (Low, Medium, High)
- ✅ **Deadline Reminders**: Add due dates and times
- ✅ **Recurring Tasks**: Set tasks to repeat daily, weekly, or monthly
- ✅ **Local Storage**: Tasks persist even after page refresh

### Advanced Features
- 🔍 **Filter Tasks**: View All, Pending, Completed, or Overdue tasks
- 📊 **Statistics**: See total, pending, and completed task counts
- ⚠️ **Overdue Alerts**: Get notified about overdue tasks
- 🎨 **Modern UI**: Beautiful, responsive design with animations
- 📱 **Mobile Friendly**: Works great on all devices
- 🔔 **Notifications**: Toast notifications for user feedback

## How to Use

### Getting Started
1. Open `index.html` in your web browser
2. Start adding tasks using the input field
3. Set priority, deadline, and recurring options as needed
4. Click "Add Task" or press Enter to create the task

### Managing Tasks
- **Complete a Task**: Click the checkbox next to any task
- **Delete a Task**: Click the trash icon on the right side of a task
- **Filter Tasks**: Use the filter buttons (All, Pending, Completed, Overdue)
- **Clear Tasks**: Use "Clear Completed" or "Clear All" buttons

### Task Options
- **Priority**: Choose Low, Medium, or High priority
- **Deadline**: Set a specific date and time for the task
- **Recurring**: Make tasks repeat daily, weekly, or monthly

## File Structure

```
to-do-list/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling and animations
├── app.js          # JavaScript functionality
└── README.md       # This file
```

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox and Grid
- **Vanilla JavaScript**: ES6+ features and classes
- **Local Storage**: Browser-based data persistence
- **Font Awesome**: Icons for better UX

### Key Learning Concepts
- **DOM Manipulation**: Creating, updating, and removing elements
- **Event Handling**: User interactions and form submissions
- **Local Storage**: Saving and retrieving data
- **CSS Grid & Flexbox**: Modern layout techniques
- **Responsive Design**: Mobile-first approach
- **JavaScript Classes**: Object-oriented programming

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Customization

### Adding Sample Tasks
To add sample tasks for demonstration, uncomment the last line in `app.js`:
```javascript
setTimeout(addSampleTasks, 1000);
```

### Styling
Modify `styles.css` to customize colors, fonts, and layout:
- Change the gradient background in the `body` selector
- Update button colors in `.btn-*` classes
- Modify task item styling in `.task-item`

### Functionality
Extend `app.js` to add new features:
- Task categories/tags
- Task search functionality
- Export/import tasks
- Dark mode toggle
- Task sorting options

## Contributing

Feel free to fork this project and add your own features! Some ideas:
- Task categories
- Search functionality
- Drag and drop reordering
- Task sharing
- Multiple lists
- Data export/import

## License

This project is open source and available under the MIT License. 