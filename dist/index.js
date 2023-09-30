"use strict";
class TaskManager {
    constructor(input, add, tasks) {
        this.input = input;
        this.add = add;
        this.tasks = tasks;
        this.arrayOfTasks = [];
        this.addEventListeners();
        this.getDataFromLocalStorage();
    }
    addEventListeners() {
        this.add.addEventListener("click", () => {
            if (this.input.value !== "") {
                this.addTasksToArray(this.input.value);
                this.input.value = "";
            }
        });
        this.tasks.addEventListener("click", (e) => {
            var _a, _b;
            const target = e.target;
            if (target.classList.contains("del")) {
                const taskId = (_a = target.parentElement) === null || _a === void 0 ? void 0 : _a.getAttribute("data-id");
                if (taskId) {
                    this.deleteTaskWith(taskId);
                    (_b = target.parentElement) === null || _b === void 0 ? void 0 : _b.remove();
                }
            }
            if (target.classList.contains("eachTask")) {
                const taskId = target.getAttribute("data-id");
                if (taskId) {
                    this.toggleStatus(taskId);
                    target.classList.toggle("done");
                }
            }
        });
    }
    addTasksToArray(yourTask) {
        const task = {
            id: Date.now(),
            title: yourTask,
            completed: false,
        };
        this.arrayOfTasks.push(task);
        this.addElementsToPage(this.arrayOfTasks);
        this.addDataToLocalStorage(this.arrayOfTasks);
    }
    addElementsToPage(arrayOfTasks) {
        this.tasks.innerHTML = "";
        arrayOfTasks.forEach((task) => {
            const eachTask = document.createElement("div");
            eachTask.className = "eachTask";
            eachTask.addEventListener("click", (e) => {
                const target = e.target;
                if (target.classList.contains("task")) {
                    const taskId = target.getAttribute("data-id");
                    if (taskId) {
                        this.toggleStatus(taskId);
                        eachTask.classList.toggle("done");
                    }
                }
            });
            const div = document.createElement("div");
            const span = document.createElement("span");
            div.className = "task";
            span.className = "del";
            if (task.completed) {
                eachTask.className = "done";
            }
            div.setAttribute("data-id", task.id.toString());
            div.appendChild(document.createTextNode(task.title));
            eachTask.appendChild(div);
            span.appendChild(document.createTextNode("Delete"));
            eachTask.appendChild(span);
            this.tasks.appendChild(eachTask);
            span.addEventListener("click", () => {
                this.deleteTaskWith(task.id.toString());
                eachTask.remove();
            });
        });
    }
    addDataToLocalStorage(arrayOfTasks) {
        window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
    }
    getDataFromLocalStorage() {
        const data = window.localStorage.getItem("tasks");
        if (data) {
            const tasks = JSON.parse(data);
            this.addElementsToPage(tasks);
        }
    }
    deleteTaskWith(taskId) {
        this.arrayOfTasks = this.arrayOfTasks.filter((task) => task.id.toString() !== taskId);
        this.addDataToLocalStorage(this.arrayOfTasks);
    }
    toggleStatus(taskId) {
        for (let i = 0; i < this.arrayOfTasks.length; i++) {
            if (this.arrayOfTasks[i].id.toString() === taskId) {
                this.arrayOfTasks[i].completed = !this.arrayOfTasks[i].completed;
            }
        }
        this.addDataToLocalStorage(this.arrayOfTasks);
    }
}
const input = document.querySelector(".input");
const add = document.querySelector(".add");
const tasks = document.querySelector(".tasks");
new TaskManager(input, add, tasks);
 