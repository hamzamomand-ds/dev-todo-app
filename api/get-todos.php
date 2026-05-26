<?php
header('Content-Type: application/json');
// =============================================
// Developer Todo App — API: Get All Tasks
// =============================================
// 
// WHAT THIS FILE DOES:
// - Connects to the MySQL database
// - Fetches ALL tasks from the 'todos' table
// - Sends them back as JSON (a format JS can read)
//
// HOW IT'S CALLED:
// - JavaScript (script.js) sends a request to this file
// - Using fetch() or AJAX when the page loads
//
// WHAT IT RETURNS:
// - A JSON array of tasks, like:
//   [
//     {"id": 1, "task": "Buy groceries", "is_completed": 0},
//     {"id": 2, "task": "Finish project", "is_completed": 1}
//   ]
// =============================================

// =============================================
// STEP 1: Database Connection
// =============================================
// 
// mysqli_connect() connects PHP to MySQL.
// It needs 4 things:
//   1. Host     = "localhost" (MySQL runs on the same machine)
//   2. Username = "root"      (XAMPP default user)
//   3. Password = ""          (XAMPP default — empty!)
//   4. Database = "dev_todo_db" (the database we created)
//
// The result ($conn) is a "connection object" we'll use to talk to MySQL.

$host = "localhost";
$username = "root";
$password = "";
$database = "dev_todo_db";

// Create the connection
$conn = mysqli_connect($host, $username, $password, $database);

// =============================================
// STEP 2: Check if Connection Failed
// =============================================
//
// If the connection failed (wrong password, DB doesn't exist, etc.),
// mysqli_connect_error() gives us the error message.
// We stop immediately and send back the error as JSON.

if (!$conn) {
    // Create an error response array
    $response = [
        "success" => false,
        "message" => "Database connection failed: " . mysqli_connect_error()
    ];
    
    // Convert the array to JSON format
    // json_encode() turns PHP arrays/objects into JSON strings
    echo json_encode($response);
    
    // Exit the script — don't run any more code
    exit;
}

// =============================================
// STEP 3: SQL Query — Get All Tasks
// =============================================
//
// SQL (Structured Query Language) lets us talk to the database.
// 
// Query: SELECT * FROM todos ORDER BY created_at DESC
//   SELECT *    → "get all columns"
//   FROM todos  → "from the todos table"
//   ORDER BY created_at DESC → "newest tasks first"
//
// mysqli_query() sends the SQL command to MySQL and returns the result.

$sql = "SELECT * FROM todos ORDER BY created_at DESC";
$result = mysqli_query($conn, $sql);

// =============================================
// STEP 4: Check if Query Failed
// =============================================

if (!$result) {
    $response = [
        "success" => false,
        "message" => "Query failed: " . mysqli_error($conn)
    ];
    echo json_encode($response);
    exit;
}

// =============================================
// STEP 5: Convert Results to an Array
// =============================================
//
// mysqli_fetch_all() takes the result from MySQL
// and converts it into a PHP array.
// MYSQLI_ASSOC means: use column names as array keys
// So instead of $task[0], we can use $task["task"] (more readable!)

$tasks = mysqli_fetch_all($result, MYSQLI_ASSOC);

// =============================================
// STEP 6: Prepare Success Response
// =============================================
//
// We build a PHP array with:
//   - "success" → true (everything worked)
//   - "message" → a note
//   - "tasks"   → the actual list of todos
//
// This array will be converted to JSON and sent to the browser.

$response = [
    "success" => true,
    "message" => "Tasks fetched successfully",
    "tasks" => $tasks
];

// =============================================
// STEP 7: Send JSON Response Back
// =============================================
//
// echo outputs text to the browser.
// json_encode() converts our PHP array to a JSON string.
// 
// The browser's JavaScript will receive this JSON
// and use it to display the tasks on the page.

echo json_encode($response);

// =============================================
// STEP 8: Close the Database Connection
// =============================================
//
// Always close the connection when done!
// It frees up resources on the server.

mysqli_close($conn);

?>