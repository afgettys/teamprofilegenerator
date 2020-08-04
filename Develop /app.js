const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const member = ("engineer", "intern", "manager");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const employees = [];

function initApp() {
    //startHtml();
    addMember();
}

function addMember() {
    inquirer.prompt([{
        message: "Please inform name",
        name: "name"
    },
    {
        message: "Enter team member's id",
        name: "id"
    },
    {
        message: "What role does this person play?",
        name: "role"
    },
    {
        message: "Enter team member's email address",
        name: "email"
    }])
        .then(function ({ name, role, id, email }) {
            let roleInfo = "";
            if (role === "Engineer") {
                roleInfo = "GitHub username";
            } else if (role === "Intern") {
                roleInfo = "school name";
            } else {
                roleInfo = "office phone number";
            }
            inquirer.prompt([{
                message: `Enter team member's ${roleInfo}`,
                name: "roleInfo"
            },
            {
                type: "list",
                message: "Would you like to add more team members?",
                choices: [
                    "yes",
                    "no"
                ],
                name: "moreMembers"
            }])
                .then(function ({ roleInfo, moreMembers }) {
                    let newMember;
                    if (role === "Engineer") {
                        newMember = new Engineer(name, id, email, roleInfo);
                    } else if (role === "Intern") {
                        newMember = new Intern(name, id, email, roleInfo);
                    } else {
                        newMember = new Manager(name, id, email, roleInfo);
                    }
                    employees.push(newMember);
                    //addHtml(newMember)
                    //.then(function() {
                    if (moreMembers === "yes") {
                        addMember();
                    } else {
                        renderHtml();
                    }
                });

        });
};


function renderHtml() {
    const html = render(employees);
    if (!fs.existsSync(OUTPUT_DIR)){
        fs.mkdirSync(OUTPUT_DIR)
    }
    fs.writeFile(outputPath, html, function (err) {
        if (err) {
            console.log(err)
        }
    });
};

// function startHtml() {
//     const html = `<!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <meta http-equiv="X-UA-Compatible" content="ie=edge">
//         <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
//         <title>Team Profile</title>
//     </head>
//     <body>
//         <nav class="navbar navbar-dark bg-dark mb-5">
//             <span class="navbar-brand mb-0 h1 w-100 text-center">Team Profile</span>
//         </nav>
//         <div class="container">
//             <div class="row">`;
//     fs.writeFile("./output/team.html", html, function(err) {
//         if (err) {
//             console.log(err);
//         }
//     });
//     console.log("start");
// }       


//     fs.appendFile("./output/team.html", html, function (err) {
//         if (err) {
//             console.log(err);
//         };
//     });
//     console.log("end");



initApp();
