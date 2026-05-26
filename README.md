# DevTodo — Developer Task Manager

A clean and minimal todo app built with HTML, CSS, JavaScript, PHP and MySQL.

---

## What It Does

- Add new tasks
- Mark tasks as complete or incomplete
- Delete tasks
- All tasks are saved in a real database

---

## Built With

- HTML & CSS — Frontend UI
- JavaScript — Dynamic interactions (AJAX)
- PHP — Backend API
- MySQL — Database
- XAMPP — Local server

---

## Project Structure

```
dev-todo-app/
├── index.html          → Main page
├── style.css           → All styling
├── script.js           → Frontend logic
├── api/
│   ├── get-todos.php       → Fetch all tasks
│   ├── add-todo.php        → Add a new task
│   ├── complete-todo.php   → Toggle task complete
│   └── delete-todo.php     → Delete a task
└── database/
    └── init.sql        → Database setup script
```

---

## How to Run Locally

### 1. Requirements
- [XAMPP](https://www.apachefriends.org/) installed on your machine

### 2. Clone the repository
```bash
git clone https://github.com/hamzamomand-ds/dev-todo-app.git
```

### 3. Move to XAMPP folder
```
/Applications/XAMPP/xamppfiles/htdocs/dev-todo-app
```

### 4. Set up the database
- Open your browser and go to `http://localhost/phpmyadmin`
- Click **Import**
- Select the file `database/init.sql`
- Click **Go**

### 5. Start XAMPP
- Open XAMPP
- Start **Apache** and **MySQL**

### 6. Open the app
```
http://localhost/dev-todo-app
```

---

## API Endpoints

| Method | File | Description |
|--------|------|-------------|
| GET | `/api/get-todos.php` | Get all tasks |
| POST | `/api/add-todo.php` | Add a new task |
| POST | `/api/complete-todo.php` | Toggle complete |
| POST | `/api/delete-todo.php` | Delete a task |

---

## Author

**Hamza Momand**  
GitHub: [@hamzamomand-ds](https://github.com/hamzamomand-ds)
