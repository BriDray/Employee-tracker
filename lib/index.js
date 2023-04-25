const db = require("../db/connection");
const console = require("console.table");
const inquirer = require("inquirer");

// INQUIRER PROMPTS
const startInquirer = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "mainMenu",
            Message: "What would you like to do?",
            choices: [
                "view all departments",
                "view all roles",
                "view all employees",
                "add a department",
                "add a role",
                "add an employee",
                "update an employee role",
                "Exit"
            ]

        }
    ])
        // INQUIRER ANSWERS
        .then(answers => {
            const nextPrompt = answers.toDo;
            if (nextPrompt === "View all departments") {
                viewDepartments();
            };

            if (nextPrompt === "view all roles") {
                viewRoles();
            };

            if (nextPrompt === "view all employees") {
                viewEmployees();
            };

            if (nextPrompt === "add a department") {
                addDepartment();
            };

            if (nextPrompt === "add a role") {
                addRole();
            };

            if (nextPrompt === "add an employee") {
                addEmployee();
            };

            if (nextPrompt === "update an employee role") {
                updateEmployee();
            };

            if (nextPrompt === "Exit") {
                process.exit();
            };
        })

    const viewDepartments = () => {
        const sql = `SELECT * FROM departments`;
        db.query(sql, (err, rows) => {
            if (err) {
                throw err;
            }
            console.log("\n");
            console.table(rows);
            return startInquirer();
        });
    };
}