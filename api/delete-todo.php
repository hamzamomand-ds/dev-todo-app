<?php
// =============================================
// Developer Todo App — API: Delete a Task
// =============================================
// 
// WHAT THIS FILE DOES:
// - Receives a task ID from JavaScript
// - Permanently deletes it from the database
// - Sends a success/failure response
//
// ⚠️ WARNING: Deletion is PERMANENT
// - Once deleted, the task is gone forever
// - There's no "undo" (in this simple version)
// - That's why we add a confirmation before calling this!
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

$json_data = file_get_contents("php://input");
$data = json_decode($json_data, true);

// =============================================
// STEP 3: Validate the ID
// =============================================

if (!isset($data["id"]) || intval($data["id"]) <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Invalid task ID"
    ]);
    exit;
}

$task_id = intval($data["id"]);

// =============================================
// STEP 4: Delete from Database
// =============================================
//
// SQL DELETE command:
//   DELETE FROM todos WHERE id = $task_id
//   DELETE FROM todos → "remove a row from the todos table"
//   WHERE id = $task_id → "but only the row with this specific ID"
//
// ⚠️ Without WHERE, it would delete ALL todos!

$sql = "DELETE FROM todos WHERE id = $task_id";
$result = mysqli_query($conn, $sql);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Failed to delete task: " . mysqli_error($conn)
    ]);
    exit;
}

// =============================================
// STEP 5: Check if Anything Was Actually Deleted
// =============================================
//
// mysqli_affected_rows() tells us how many rows were changed.
// If the ID didn't exist in the database, 0 rows were affected.
// We should inform the user in that case.

if (mysqli_affected_rows($conn) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Task not found (may have been already deleted)"
    ]);
    exit;
}

// =============================================
// STEP 6: Send Success Response
// =============================================

echo json_encode([
    "success" => true,
    "message" => "Task deleted successfully",
    "deleted_id" => $task_id
]);

mysqli_close($conn);
?>