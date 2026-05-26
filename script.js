// =============================================
// Developer Todo App — Main JavaScript File
// =============================================
//
// WHAT THIS FILE DOES:
// - Listens for user actions (clicks, form submits)
// - Talks to PHP API files using fetch() (AJAX)
// - Updates the page WITHOUT refreshing
//
// HOW IT CONNECTS:
//   HTML (user clicks) → JS (sends fetch) → PHP (talks to MySQL)
//   MySQL (data) → PHP (returns JSON) → JS (updates the page)
//
// =============================================

// =============================================
// 1. Wait for the Page to Load
// =============================================
//
// document.addEventListener("DOMContentLoaded", ...)
// This waits until ALL HTML is loaded before running our code.
// Why? Because our code needs to find HTML elements by their IDs.
// If we ran too early, the elements wouldn't exist yet!
//
// The callback function () => { ... } is an "arrow function"
// It runs when the DOM is ready.

document.addEventListener("DOMContentLoaded", () => {

    // =============================================
    // 2. Get References to HTML Elements
    // =============================================
    //
    // document.getElementById() finds an HTML element by its "id" attribute.
    // We store these references in CONSTANTS (variables that can't change).
    // This way we can use them later without searching for them again.
    //
    // Think of these as "handles" or "remote controls" for each HTML element.

    const todoForm = document.getElementById("todoForm");       // The <form> element
    const todoInput = document.getElementById("todoInput");     // The <input> text field
    const todoList = document.getElementById("todoList");       // The <div> where tasks go
    const taskCount = document.getElementById("taskCount");     // The <span> showing count
    const emptyState = document.getElementById("emptyState");   // The "No tasks" message

    // =============================================
    // 3. Define the Base URL for API Calls
    // =============================================
    //
    // This is the path to our PHP files.
    // We store it once so we don't have to type it everywhere.
    // window.location.origin gives us "http://localhost"
    
    const API_BASE = window.location.origin + "/dev-todo-app/api";

    // =============================================
    // 4. FETCH ALL TASKS — Load tasks when page opens
    // =============================================
    //
    // This function runs automatically when the page loads.
    // It calls get-todos.php and displays all saved tasks.
    //
    // async means: "this function will wait for network requests"
    // await means: "wait here until the PHP file responds"
    //
    // Why async/await? Network requests take TIME (milliseconds).
    // Without await, the code would continue running before
    // we got the data back, causing errors.

    async function fetchTodos() {
        try {
            // =============================================
            // Step 4a: Send GET request to get-todos.php
            // =============================================
            //
            // fetch() is JavaScript's built-in way to make HTTP requests.
            // It's like typing a URL in the browser, but we capture the response.
            //
            // Syntax: fetch(url) → returns a "Promise" (a future response)
            // await → pauses until the promise resolves (PHP responds)

            const response = await fetch(`${API_BASE}/get-todos.php`);

            // =============================================
            // Step 4b: Parse the JSON Response
            // =============================================
            //
            // response.json() reads the body of the response
            // and converts it from JSON text → JavaScript object/array.
            //
            // PHP sent: {"success":true, "tasks": [...]}
            // JS gets:  {success: true, tasks: [...]}

            const data = await response.json();

            // =============================================
            // Step 4c: Check if API Call Was Successful
            // =============================================

            if (data.success) {
                // Clear the list first (remove any placeholder content)
                // We'll rebuild the list from scratch with fresh data
                renderTasks(data.tasks);
            } else {
                console.error("Failed to fetch tasks:", data.message);
            }

        } catch (error) {
            // =============================================
            // Step 4d: Handle Any Errors
            // =============================================
            //
            // If the network fails, PHP is down, or any error occurs,
            // the "catch" block runs. This prevents the app from crashing.
            
            console.error("Error fetching tasks:", error);
        }
    }

    // =============================================
    // 5. RENDER TASKS — Display tasks on the page
    // =============================================
    //
    // This function takes an array of tasks from the database
    // and creates HTML elements for each one inside the todoList div.
    //
    // Parameter: tasks → array of task objects from PHP
    // Each task looks like: { id: 1, task: "Buy eggs", is_completed: 0, created_at: "..." }

    function renderTasks(tasks) {
        // Clear the todoList div completely
        // innerHTML = "" removes all child elements
        todoList.innerHTML = "";

        // =============================================
        // Step 5a: Check if There Are Any Tasks
        // =============================================
        //
        // If no tasks exist (tasks.length === 0),
        // show the "No tasks yet" empty state message.
        // We use the .appendChild() method to add the emptyState element
        // back into the todoList.

        if (tasks.length === 0) {
            todoList.appendChild(emptyState);
            updateTaskCount(0);
            return; // Exit the function early
        }

        // =============================================
        // Step 5b: Loop Through Each Task
        // =============================================
        //
        // forEach() runs a function for EACH item in the array.
        // Think: "for each task in the tasks array, do something"
        //
        // (task) => { ... } is an arrow function that runs for each task.

        tasks.forEach((task) => {
            // Create a NEW HTML element for this task
            // createElement("div") makes a <div></div> in memory (not on page yet)
            const todoItem = document.createElement("div");
            
            // Add the CSS class "todo-item" to this div
            // This applies all the .todo-item styles from style.css
            todoItem.className = "todo-item";

            // If task is completed, add the "completed" class too
            // This gives the strikethrough + faded look from CSS
            if (task.is_completed == 1) {
                todoItem.classList.add("completed");
            }

            // =============================================
            // Step 5c: Build the Inner HTML of the Task
            // =============================================
            //
            // innerHTML sets the content INSIDE the div.
            // We use backticks (`) for "template literals" — 
            // they let us insert variables with ${variableName}.
            //
            // Structure we're building:
            // <div class="todo-item">
            //   <input type="checkbox" class="todo-checkbox" ...>
            //   <span class="todo-text">Buy groceries</span>
            //   <button class="todo-delete">✕</button>
            // </div>

            todoItem.innerHTML = `
                <!-- 
                    Checkbox input
                    checked attribute only appears if is_completed is 1
                    data-id stores the task's database ID (used by JS later)
                -->
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${task.is_completed == 1 ? "checked" : ""}
                    data-id="${task.id}"
                >
                
                <!-- Task text -->
                <span class="todo-text">${escapeHtml(task.task)}</span>
                
                <!-- Delete button -->
                <button class="todo-delete" data-id="${task.id}">
                    &#10005;
                </button>
            `;

            // =============================================
            // Step 5d: Add Event Listeners to This Task
            // =============================================
            //
            // Now we attach "listeners" that watch for user clicks.
            // When user clicks checkbox or delete button, the corresponding
            // function runs.

            // Find the checkbox inside this todoItem
            const checkbox = todoItem.querySelector(".todo-checkbox");
            
            // Find the delete button inside this todoItem
            const deleteBtn = todoItem.querySelector(".todo-delete");

            // When checkbox is clicked → toggle task completion
            checkbox.addEventListener("change", () => {
                toggleTask(task.id, todoItem, checkbox);
            });

            // When delete button is clicked → remove task
            deleteBtn.addEventListener("click", () => {
                deleteTask(task.id, todoItem);
            });

            // =============================================
            // Step 5e: Add the Task to the Page
            // =============================================
            //
            // appendChild() adds the task div INSIDE the todoList div
            // Now the task appears on screen!

            todoList.appendChild(todoItem);
        });

        // Update the task count display
        updateTaskCount(tasks.length);
    }

    // =============================================
    // 6. ADD A NEW TASK — When user submits form
    // =============================================
    //
    // This function runs when the user clicks "Add Task" or presses Enter.
    
    async function addTask(event) {
        // =============================================
        // Step 6a: Prevent Page Reload
        // =============================================
        //
        // event.preventDefault() is CRITICAL!
        // By default, submitting a form RELOADS the page.
        // We DON'T want that — we want to add the task silently
        // using AJAX without any page refresh.
        
        event.preventDefault();

        // =============================================
        // Step 6b: Get the Task Text from Input
        // =============================================
        //
        // todoInput.value reads what the user typed
        // trim() removes extra spaces from start and end

        const taskText = todoInput.value.trim();

        // =============================================
        // Step 6c: Validate — Don't Add Empty Tasks
        // =============================================
        //
        // If the input is empty (user clicked Add without typing),
        // show an error animation and exit early.

        if (taskText === "") {
            // Add a CSS class that makes the input shake (optional)
            todoInput.classList.add("error-shake");
            
            // Remove the shake class after 500ms so it can shake again
            setTimeout(() => {
                todoInput.classList.remove("error-shake");
            }, 500);
            
            return; // Stop here — don't send to server
        }

        try {
            // =============================================
            // Step 6d: Send POST Request to add-todo.php
            // =============================================
            //
            // fetch() with TWO parameters:
            //   1st: URL → where to send
            //   2nd: Object → configuration options
            //
            // Options:
            //   method: "POST"     → send data (not just read)
            //   headers:           → tell PHP we're sending JSON
            //   body: JSON.stringify() → convert JS object to JSON string

            const response = await fetch(`${API_BASE}/add-todo.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    task: taskText
                })
            });

            const data = await response.json();

            // =============================================
            // Step 6e: Handle Response
            // =============================================

            if (data.success) {
                // Clear the input field for the next task
                todoInput.value = "";
                
                // Re-fetch all tasks from the database
                // This refreshes the entire list including the new task
                fetchTodos();
            } else {
                console.error("Failed to add task:", data.message);
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error("Error adding task:", error);
            alert("Could not connect to server. Is XAMPP running?");
        }
    }

    // =============================================
    // 7. TOGGLE TASK — Mark as Complete/Incomplete
    // =============================================
    
    async function toggleTask(taskId, todoItem, checkbox) {
        try {
            // Send POST request to complete-todo.php with the task ID
            const response = await fetch(`${API_BASE}/complete-todo.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: taskId
                })
            });

            const data = await response.json();

            if (data.success) {
                // Toggle the "completed" CSS class on the task item
                // classList.toggle() adds the class if it's missing,
                // or removes it if it exists
                todoItem.classList.toggle("completed");
                
                // Update the task count
                updateCountFromList();
            } else {
                // If toggle failed, revert the checkbox state
                checkbox.checked = !checkbox.checked;
                console.error("Failed to toggle task:", data.message);
            }

        } catch (error) {
            // If network error, revert the checkbox
            checkbox.checked = !checkbox.checked;
            console.error("Error toggling task:", error);
        }
    }

    // =============================================
    // 8. DELETE TASK — Remove from Database
    // =============================================
    
    async function deleteTask(taskId, todoItem) {
        try {
            // Send POST request to delete-todo.php with the task ID
            const response = await fetch(`${API_BASE}/delete-todo.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: taskId
                })
            });

            const data = await response.json();

            if (data.success) {
                // =============================================
                // Add a fade-out animation before removing
                // =============================================
                //
                // We add a CSS class that triggers a fadeOut animation
                // Then wait 300ms (the animation duration) before removing
                
                todoItem.style.opacity = "0";
                todoItem.style.transform = "translateX(20px)";
                todoItem.style.transition = "all 0.3s ease";
                
                // setTimeout() runs code after a delay (300ms = 0.3 seconds)
                setTimeout(() => {
                    // Remove the element from the DOM
                    todoItem.remove();
                    
                    // Refresh the task list to update count
                    fetchTodos();
                }, 300);
                
            } else {
                console.error("Failed to delete task:", data.message);
                alert("Error: " + data.message);
            }

        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Could not connect to server. Is XAMPP running?");
        }
    }

    // =============================================
    // 9. UPDATE TASK COUNT — Shows "3 tasks"
    // =============================================
    
    function updateTaskCount(count) {
        if (count === 1) {
            taskCount.textContent = "1 task";      // Singular
        } else {
            taskCount.textContent = `${count} tasks`; // Plural
        }
    }

    // =============================================
    // 10. UPDATE COUNT FROM CURRENT LIST
    // =============================================
    //
    // Counts the number of todo-item divs currently on the page
    // Used after toggling a task (without re-fetching entire list)
    
    function updateCountFromList() {
        const items = todoList.querySelectorAll(".todo-item");
        updateTaskCount(items.length);
    }

    // =============================================
    // 11. ESCAPE HTML — Prevent XSS Attacks
    // =============================================
    //
    // SECURITY: If someone types HTML as a task (like <script>alert('hack')</script>),
    // and we inject it directly with innerHTML, it could run malicious code.
    //
    // This function replaces dangerous characters with safe versions:
    //   < → &lt;    > → &gt;    & → &amp;    " → &quot;    ' → &#039;
    //
    // Now the browser shows the text literally instead of interpreting it as HTML.

    function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }

    // =============================================
    // 12. WIRE UP EVENT LISTENERS — Connect everything
    // =============================================
    //
    // Now we connect the JavaScript functions to HTML events.
    // This is where the "magic" happens — user actions trigger our code.

    // When the form is submitted (click Add or press Enter) → addTask()
    todoForm.addEventListener("submit", addTask);

    // =============================================
    // 13. START THE APP — Load tasks on page load
    // =============================================
    //
    // This is the FIRST thing that runs when the page opens.
    // It fetches all tasks from the database and displays them.
    
    fetchTodos();

// =============================================
// 14. CLOSE THE DOMContentLoaded Listener
// =============================================
});