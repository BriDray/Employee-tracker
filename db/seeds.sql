USE company;
INSERT INTO departments (name)
VALUES
 ("Sales"),
 ("Engineering"),
 ("Finance"),
 ("Legal");

INSERT INTO roles (title, salary, department_id)
VALUES 
("Sales Lead", 100000, 1), 
("Salesperson", 80000, 2), 
("Lead Engineer", 150000, 3), 
("Software Engineer", 120000, 4), 
("Accountant", 125000, 5), 
("Legal Team Lead", 250000, 6), 
("Lawyer", 190000, 7);

INSERT INTO employees (first_name, last_name, title_id)
VALUES 
("Brianda", "Dray", 4);