-- =============================================
-- Developer Todo App — Database Setup Script
-- =============================================
-- This script creates the database and table
-- needed to store our todo tasks permanently.
-- =============================================

-- Step 1: Create a new database
-- A "database" is like a container that holds all our tables.
-- IF NOT EXISTS means: only create if it doesn't already exist.
CREATE DATABASE IF NOT EXISTS dev_todo_db;

-- Step 2: Tell MySQL to use this database for all following commands
USE dev_todo_db;

-- Step 3: Create a table to store tasks
-- A "table" is like a spreadsheet with columns and rows.
-- Each row = one todo task.
CREATE TABLE IF NOT EXISTS todos (
    -- id: A unique number for each task (auto-increases)
    -- INT = whole number, AUTO_INCREMENT = +1 automatically
    -- PRIMARY KEY = each task has its own unique ID
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- task: The actual text of the todo (e.g., "Buy groceries")
    -- VARCHAR(255) = text up to 255 characters
    task VARCHAR(255) NOT NULL,
    
    -- is_completed: Whether the task is done or not
    -- TINYINT(1) = stores 0 (not done) or 1 (done)
    -- DEFAULT 0 = new tasks start as "not done"
    is_completed TINYINT(1) DEFAULT 0,
    
    -- created_at: When the task was added
    -- TIMESTAMP = stores date and time automatically
    -- DEFAULT CURRENT_TIMESTAMP = auto-fills with current time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);