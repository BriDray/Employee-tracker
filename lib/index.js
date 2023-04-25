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

    // VIEW DEPARTMENTS -I am presented with a formatted table showing department names and department ids
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

//VIEW ROLES -I am presented with the job title, role id, the department that role belongs to, and the salary for that role
const viewRoles = () => {
    const sql = `SELECT roles.id, 
                        roles.title, 
                        roles.salary, 
                        departments.name AS department
                  FROM roles
                  LEFT JOIN departments ON roles.department_id = departments.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return startInquirer();
    });
};

// VIEW EMPLOYEES -I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
const viewEmployees = () => {
    const sql = `SELECT employees.id, 
                        employees.first_name, 
                        employees.last_name,
                        roles.title AS title,
                        roles.salary AS salary,
                        departments.name AS department,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager 
                  FROM employees
                  LEFT JOIN roles ON employees.role_id = roles.id
                  LEFT JOIN departments ON roles.department_id = departments.id
                  LEFT JOIN employees manager ON employees.manager_id = manager.id`;
    db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log("\n");
        console.table(rows);
        return startInquirer();
    });
};

// ADD A DEPARTMENT -I am prompted to enter the name of the department and that department is added to the database
const addDepartment = () => {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What would you like to name the New Department?",
            validate: nameInput => {
                if (nameInput) {
                    return true;
                } else {
                    console.log("Please enter a name for the New Department");
                    return false;
                };
            }
        }
    ])
        .then(answer => {
            const sql = `INSERT INTO departments (name)
        VALUES (?)`;
            const params = answer.name;
            db.query(sql, params, (err) => {
                if (err) {
                    throw err;
                }
                console.log("New Department added!");
                return viewDepartments();
            });
        });
};
// ADD ROLE -I am prompted to enter the name, salary, and department for the role and that role is added to the database
const departments = rows.map(({ name, id }) => ({ name: name, value: id }));
inquirer.prompt([
    {
        type: "list",
        name: "department",
        message: "What department does this role belong to?",
        choices: departments
    }
])
    .then(departmentAnswer => {
        const department = departmentAnswer.department;
        params.push(department);
        const sql = `INSERT INTO roles (title, salary, department_id)
      VALUES (?, ?, ?)`;
        db.query(sql, params, (err) => {
            if (err) {
                throw err;
            }
            console.log("Role added!");
            return viewRoles();
        });
    });

    // ADD NEW EMPLOYEE -I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
    const addEmployee = () => {
        return inquirer.prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?",
            validate: nameInput => {
              if (nameInput) {
                return true;
              } else {
                console.log("Please enter a name");
                return false;
              };
            }
          },
          {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?",
            validate: nameInput => {
              if (nameInput) {
                return true;
              } else {
                console.log("Please enter a name");
                return false;
              };
            }
          }
        ])
        .then (answer => {
          const params = [answer.firstName, answer.lastName];
          const sql = `SELECT * FROM roles`;
          db.query(sql, (err, rows) => {
            if (err) {
              throw err;
            }
            // ADD ROLE TO NEW EMPLOYEE
            const roles = rows.map(({title, id}) => ({name: title, value: id}));
            inquirer.prompt([
              {
                type: "list",
                name: "role",
                message: "What is the role of this employee?",
                choices: roles
              }
            ])
            .then(roleAnswer => {
                const role = roleAnswer.role;
                params.push(role);
                const sql = `SELECT * FROM employees`;
                db.query(sql, (err, rows) => {
                  if (err) {
                    throw err;
                  }
                  const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
                  managers.push({name: "No manager", value: null});
                  inquirer.prompt([
                    {
                      type: "list",
                      name: "manager",
                      message: "Who is this employee's manager?",
                      choices: managers
                    }
                  ])
                  .then(managerAnswer => {
                    const manager = managerAnswer.manager;
                    params.push(manager);
                    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                      VALUES (?, ?, ?, ?)`;
                    db.query(sql, params, (err) => {
                      if (err) {
                        throw err;
                      }
                      console.log("Employee added!");
                      return viewEmployees();
                    });
                  });
                });
              });
            });
          });
        };
// UPDATE EMPLOYEE ROLE -I am prompted to select an employee to update and their new role and this information is updated in the database
        const updateEmployeeRole = () => {
            const sql = `SELECT first_name, last_name, id FROM employees`
            db.query(sql, (err, rows) => {
              if (err) {
                throw err;
              }
              const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
    inquirer.prompt([
      {
        type: "list",
        name: "employee",
        message: "Choose which employee's role would you like to update?",
        choices: employees
      }
    ])
    .then(employeeAnswer => {
        const employee = employeeAnswer.employee;
        const params = [employee];
        const sql = `SELECT title, id FROM roles`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const roles = rows.map(({title, id}) => ({name: title, value: id}));
          inquirer.prompt([
            {
              type: "list",
              name: "role",
              message: "What is the new role of this employee?",
              choices: roles
            }
          ])
          .then(rolesAnswer => {
            const role = rolesAnswer.role;
            params.unshift(role);
            const sql = `UPDATE employees
                          SET role_id = ?
                          WHERE id = ?`
            db.query(sql, params, (err) => {
              if (err) {
                throw err;
              }
              console.log("Employee updated!");
              return viewEmployees();
            });
          });
        });
      });
    });
  };
// UPDATE MANAGER
  const updateEmployeeManager = () => {
    const sql = `SELECT first_name, last_name, id FROM employees`
    db.query(sql, (err, rows) => {
      if (err) {
        throw err;
      }
      const employees = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
      inquirer.prompt([
        {
          type: "list",
          name: "employee",
          message: "Which employee would you like to update?",
          choices: employees
        }
      ])
      .then(employeeAnswer => {
        const employee = employeeAnswer.employee;
        const params = [employee];
        const sql = `SELECT first_name, last_name, id FROM employees`;
        db.query(sql, (err, rows) => {
          if (err) {
            throw err;
          }
          const managers = rows.map(({first_name, last_name, id}) => ({name: `${first_name} ${last_name}`, value: id}));
        managers.push({name: "No manager", value: null});
        inquirer.prompt([
          {
            type: "list",
            name: "manager",
            message: "Who is this employee's new manager?",
            choices: managers
          }
        ])
        .then(managerAnswer => {
          const manager = managerAnswer.manager;
          params.unshift(manager);
          const sql = `UPDATE employees
                        SET manager_id = ?
                        WHERE id = ?`
          db.query(sql, params, (err) => {
            if (err) {
              throw err;
            }
            console.log("Employee updated!");
            return viewEmployees();
          });
        });
      });
    });
  });
};
