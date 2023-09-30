interface Task {
  id: number;
  title: string;
  completed: boolean;
}

class TaskManager {
  private arrayOfTasks: Task[] = [];

  constructor(private input: HTMLInputElement, private add: HTMLElement, private tasks: HTMLElement) {
    this.addEventListeners();
    this.getDataFromLocalStorage();
  }


  private addEventListeners(): void {
    this.add.addEventListener("click", () => {
      if (this.input.value !== "") {
        this.addTasksToArray(this.input.value);
        this.input.value = "";
      }
    });

    this.tasks.addEventListener("click", (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.classList.contains("del")) {
        const taskId = target.parentElement?.getAttribute("data-id");
        if (taskId) {
          this.deleteTaskWith(taskId);
          target.parentElement?.remove();
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

  private addTasksToArray(yourTask: string): void {
    const task: Task = {
      id: Date.now(),
      title: yourTask,
      completed: false,
    };

    this.arrayOfTasks.push(task);
    this.addElementsToPage(this.arrayOfTasks);
    this.addDataToLocalStorage(this.arrayOfTasks);
  }

  private addElementsToPage(arrayOfTasks: Task[]): void {
    this.tasks.innerHTML = "";
    arrayOfTasks.forEach((task) => {
      const eachTask = document.createElement("div");
      eachTask.className = "eachTask";
      eachTask.addEventListener("click", (e: Event) => {
        const target = e.target as HTMLElement;
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

  private addDataToLocalStorage(arrayOfTasks: Task[]): void {
    window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
  }


  private getDataFromLocalStorage(): void {
    const data = window.localStorage.getItem("tasks");
    if (data) {
      const tasks = JSON.parse(data) as Task[];
      this.addElementsToPage(tasks);
    }
  }


  private deleteTaskWith(taskId: string): void {
    this.arrayOfTasks = this.arrayOfTasks.filter((task) => task.id.toString() !== taskId);
    this.addDataToLocalStorage(this.arrayOfTasks);
  }

  private toggleStatus(taskId: string): void {
    for (let i = 0; i < this.arrayOfTasks.length; i++) {
      if (this.arrayOfTasks[i].id.toString() === taskId) {
        this.arrayOfTasks[i].completed = !this.arrayOfTasks[i].completed;
      }
    }
    this.addDataToLocalStorage(this.arrayOfTasks);
  }
}

const input = <HTMLInputElement>document.querySelector(".input") ;
const add = <HTMLElement> document.querySelector(".add")  ;
const tasks =  <HTMLElement>document.querySelector(".tasks")  ;

new TaskManager(input, add, tasks);