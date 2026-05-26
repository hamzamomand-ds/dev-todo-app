<?php
// =============================================
// Developer Todo App — API: Mark Task as Complete
// =============================================
// 
// WHAT THIS FILE DOES:
// - Receives a task ID from JavaScript
// - Toggles the is_completed status (0→1 or 1→0)
//   So if it's incomplete, mark complete. If complete, mark incomplete.
// - Sends back the updated task as JSON
//
// WHY TOGGLE? (instead of just "set to 1")
// - Better UX: user can "uncheck" a task if they clicked by mistake
// - More flexible: same button works for both complete and uncomplete
// =============================================

header('Content-Type: application/json');

// =============================================
// STEP 1: Database Connection
// =============================================

$host = "localhost";
$username = "root";
$password = "";
$database = "dev_todo_db";

$conn = mysqli_connect($host, $username, $password, $database);

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed: " . mysqli_connect_error()
    ]);
    exit;
}

// =============================================
// STEP 2: Read the Task ID from Request
// =============================================
//
// JavaScript sends: { "id": 1 }
// We read it from the request body just like add-todo.php

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// =============================================
// STEP 3: Validate the ID
// =============================================
//
// We check:
// 1. Does $data have an "id" key?
// 2. Is the id a positive number?
//
// intval() converts the value to an integer (whole number)
// If someone sends "abc", intval returns 0, which fails the > 0 check

if (!isset($data["id"]) || intval($data["id"]) <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid task ID"
    ]);
    exit;
}

$task_id = intval($data["id"]);

// =============================================
// STEP 4: Toggle the Completion Status
// =============================================
//
// We use a clever SQL trick with NOT:
//   UPDATE todos SET is_completed = NOT is_completed WHERE id = $task_id
//
// How it works:
// - If is_completed is 0 (false), NOT 0 = 1 (true) → now completed
// - If is_completed is 1 (true), NOT 1 = 0 (false) → now uncompleted
//
// This is cleaner than: "first check current value, then set opposite"

$sql = "UPDATE todos SET is_completed = NOT is_completed WHERE id = $task_id";
$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to toggle task: " . mysqli_error($conn)
    ]);
    exit;
}

// =============================================
// STEP 5: Fetch the Updated Task
// =============================================
//
// We read the task again from the database to get the NEW values
// (especially the toggled is_completed status)

$sql = "SELECT * FROM todos WHERE id = $task_id";
$result = mysqli_query($conn, $sql);
$updated_task = mysqli_fetch_assoc($result);

// =============================================
// STEP 6: Send Success Response
// =============================================

echo json_encode([
    "success" => true,
    "message" => "Task toggled successfully",
    "task" => $updated_task
]);

mysqli_close($conn);
?>