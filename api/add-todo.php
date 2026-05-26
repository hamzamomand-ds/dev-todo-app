<?php
// =============================================
// Developer Todo App — API: Add a New Task
// =============================================
// 
// WHAT THIS FILE DOES:
// - Receives a task text from JavaScript
// - Validates it (checks if it's not empty)
// - Inserts it into the MySQL database
// - Sends back the newly created task as JSON
//
// HOW IT'S CALLED:
// - JavaScript sends a POST request with the task text
// - Using fetch() with method: "POST"
//
// WHAT IT RETURNS:
// - On success: { "success": true, "task": { id, task, is_completed, created_at } }
// - On error:   { "success": false, "message": "error description" }
// =============================================

// =============================================
// STEP 1: Set Header for JSON Response
// =============================================
//
// header() sends an HTTP header to the browser.
// "Content-Type: application/json" tells the browser:
// "Hey, what I'm sending is JSON, not HTML!"
//
// This is important so JavaScript knows how to handle the response.

header('Content-Type: application/json');

// =============================================
// STEP 2: Database Connection
// =============================================
//
// Same connection code as get-todos.php.
// We connect to MySQL using the same credentials.

$host = "localhost";
$username = "root";
$password = "";
$database = "dev_todo_db";

$conn = mysqli_connect($host, $username, $password, $database);

// Check connection
if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . mysqli_connect_error()
    ]);
    exit;
}

// =============================================
// STEP 3: Get the Task Text from the Request
// =============================================
//
// JavaScript sends data in the request "body".
// We use file_get_contents("php://input") to read it.
//
// "php://input" is a special PHP stream that reads RAW data
// from the request body (JSON text sent by JavaScript).
//
// json_decode() converts the JSON string back into a PHP object.
// The second parameter "true" makes it return an ASSOCIATIVE array
// (so we can use $data["task"] instead of $data->task).

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// =============================================
// STEP 4: Validate the Task Text
// =============================================
//
// We check:
// 1. Does $data exist? (not null)
// 2. Does it have a "task" key?
// 3. Is the task text not empty after trimming whitespace?
//
// trim() removes spaces from start and end of text.
// isset() checks if a variable exists and is not null.
// empty() checks if a variable is empty ("" , null, 0, etc.)

if (!isset($data["task"]) || empty(trim($data["task"]))) {
    echo json_encode([
        "success" => false,
        "message" => "Task cannot be empty"
    ]);
    exit;
}

// Sanitize the task text — remove any dangerous characters
// mysqli_real_escape_string() prevents SQL injection attacks.
// It escapes special characters like quotes ' " that could break the SQL query.
// $conn is the connection object — it needs to know the character encoding.
$task = mysqli_real_escape_string($conn, trim($data["task"]));

// =============================================
// STEP 5: Insert into Database
// =============================================
//
// SQL INSERT command:
// INSERT INTO todos (task) VALUES ('$task')
//   INSERT INTO todos → "add a row to the todos table"
//   (task)           → "in the task column"
//   VALUES ('$task') → "with this value"
//
// The 'id' auto-increments, 'is_completed' defaults to 0,
// and 'created_at' auto-fills with the current time.

$sql = "INSERT INTO todos (task) VALUES ('$task')";

// Execute the query
$result = mysqli_query($conn, $sql);

// Check if insert failed
if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to add task: " . mysqli_error($conn)
    ]);
    exit;
}

// =============================================
// STEP 6: Get the Newly Created Task's ID
// =============================================
//
// mysqli_insert_id() returns the AUTO-GENERATED ID
// of the LAST inserted row.
// We need this so we can return the complete task object
// (including its ID) back to JavaScript.

$new_id = mysqli_insert_id($conn);

// =============================================
// STEP 7: Fetch the Full Task from Database
// =============================================
//
// We query the database to get the complete task row
// (with the created_at timestamp that was auto-generated).
// This ensures we return accurate data to JavaScript.

$sql = "SELECT * FROM todos WHERE id = $new_id";
$result = mysqli_query($conn, $sql);
$new_task = mysqli_fetch_assoc($result);
// mysqli_fetch_assoc() returns ONE row as an associative array

// =============================================
// STEP 8: Send Success Response
// =============================================
//
// Return the newly created task so JavaScript can
// add it to the page without refreshing.

echo json_encode([
    "success" => true,
    "message" => "Task added successfully",
    "task" => $new_task
]);

// =============================================
// STEP 9: Close Connection
// =============================================

mysqli_close($conn);

?>