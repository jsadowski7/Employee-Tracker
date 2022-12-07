// Import MySQL2
const mysql = require('mysql2');

// Import Inquirer
const inquirer = require('inquirer');

// Import console.table
const cTable = require('console.table');
const Connection = require('mysql/lib/Connection');

const PORT = process.env.PORT || 3001;
const app = express();

// Create connection to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'employees_db'
    },
    console.log(`Connected to the employees_db database.`)
);
// If Error
connection.connect(err => {
    if (err) throw err;
    console.log('connected as id ' + connection.threadId);
    afterConnection();
  });
// Welcome Image 
afterConnection = () => {
    console.log("--------------------")
    console.log("                    ")
    console.log("- EMPLOYEE MANAGER -")
    console.log("                    ")
    console.log("--------------------")
    promptUser();
};

// Inquirer user prompts
const promptUser = () => {
    inquirer.prompt ([
        {
            type: "list",
            name: "choices",
            message: "What would you like to do?",
            choices: [ 'View all departments',
                       'View all roles',
                       'View all employees',
                       'Add a department',
                       'Add a role',
                       'Add an employee',
                       'Update an employee role',
                       'Update an employee manager',
                       'Delete a department',
                       'Delete a role',
                       'Delete an employee',
                       'No Action']
        }
    ])
    .then((answers) => {
        const { choices } = answers;

        if (choices === "View all departments") {
            showDepartments();
        }

        if (choices === "View all roles") {
            showRoles();
        }

        if (choices === "View all employees") {
            showEmployees();
        }

        if (choices === "Add a department") {
            addDepartment();
        }

        if (choices === "Add a role") {
            addRole();
        }

        if (choices === "Add an employee") {
            addEmployee();
        }

        if (choices === "Update an employee role") {
            updateEmployee();
        }

        if (choices === "Update an employee manager") {
            updateManager();
        }

        if (choices === "Delete a department") {
            deleteDepartment();
        }
        
        if (choices === "Delete a role") {
            deleteRole();
        }

        if (choices === "Delete an employee") {
            deleteEmployee();
        }

        if (choices === "No Action") {
            connection.end()
        };
    });
};
// Function to show all departments
showDepartments = () => {
    console.log('Showing all departments:\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
// Function to show all roles
showRoles = () => {
    console.log('Showing all roles:\n');
    const sql = `SELECT role.id, role.title, department.name AS department
                 FROM role
                 INNER JOIN department ON role.department_id = department.id`;
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
// Function to show all employees
showEmployees = () => {
    console.log('Showing all employees:\n');
    const sql = `SELECT employee_id,
                        employee.first_name,
                        employee.last_name,
                        role.title,
                        department.name AS department,
                        role.salary,
                        CONCAT (manager.first_name, " ", manager.last_name) AS manager FROM employee
                        LEFT JOIN role ON employee.role_id = role.id
                        LEFT JOIN department ON role.department_id = department_id
                        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    connection.promise().query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        promptUser();
    });
};
// Function to add a department
addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'addDept',
            message: 'What department would you like to add?',
            validate: addDept => {
                if (addDept) {
                    return true;
                } else {
                    console.log('Please add a department.');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name)
                     VALUES (?)`;
        connection.query(sql, answer.addDept, (err, result) => {
            if (err) throw err;
            console.log('Added' + answer.addDept + ' to departments.');
            showDepartments();
        });
    });
};
// Function to add a role
addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'role',
            message: 'What role would you like to add?',
            validate: addRole => {
                if (addRole) {
                    return true;
                } else {
                    console.log('Please enter in a role.');
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of this role?',
            validate: addSalary => {
                if (isNaN(addSalary)) {
                    return true;
                } else {
                    console.log('Please enter a salary.');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.role, answer.salary];
        const roleSql = `SELECT name, id FROM department`;
        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;
            const dept = data.map(({ name, id }) => ({ name: name, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'dept',
                    message: 'What department is this role in?',
                    choices: dept
                }
            ])
            .then(deptChoice => {
                const dept = deptChoice.dept;
                params.push(dept);

                const sql = `INSERT INTO role (title, salary, department_id)
                             VALUES (?, ?, ?)`;
                connection.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log( 'Added' + answer.role + ' to roles.');
                    showRoles();
                });
            });
        });
    });
};

addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the first name of the employee?',
            validate: addFirst => {
                if (addFirst) {
                    return true;
                } else {
                    console.log('Please enter a first name.')
                    return false;
                }
            }
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the last name of the employee?',
            validate: addLast => {
                if (addLast) {
                    return true;
                } else {
                    console.log('Please enter a last name.')
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const params = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.promise().query(roleSql, (err, data) => {
            if (err) throw err;
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: "What is the employee's role?",
                    choices: roles
                  }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                params.push(role);
                
                const managerSql = `SELECT * FROM employee`;
                connection.promise().query(managerSql, (err, data) => {
                    if (err) throw err;
                    const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
                })
            })
        })
    })
};
// ----------------------------------------------------------------
updateEmployee = () => {};

updateManager = () => {};

deleteDepartment = () => {};

deleteRole = () => {};

deleteEmployee = () => {};
