const addTaskBtn = document.querySelector(".add-task-btn");
const image = document.querySelector(".image");
const todoCreationsContainer = document.querySelector(
  ".todo-creations-container"
);
const todoCreationBtn = document.querySelector(".todo-creation-btn");
const todoCreationTitle = document.querySelector(".todo-creation-title");
const todoCreationDesc = document.querySelector(".todo-creation-desc");
const prioritySelectionBtn = document.querySelector(".priority-selection-btn");
const prioritySelectionBtnSvg = document.querySelector(
  ".priority-selection-btn svg"
);
const priorityList = document.querySelector(".priority-list");
const priorities = document.querySelectorAll("input[name='priority']");
const spancount = document.getElementById("count");
const priority = document.querySelectorAll(".priority");

class Task {
  static _nextId = 1;

  constructor(taskName, taskDescription, priority, id = null) {
    this.id = id !== null ? id : Task._nextId++;
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.priority = priority;
  }

  static fromJSON(obj) {
    const t = new Task(obj.taskName, obj.taskDescription, obj.priority, obj.id);
    Task._nextId = Math.max(Task._nextId, obj.id + 1);
    return t;
  }

  displayTaskHTML() {
    const redLineMap = {
      low: "./assets/img/redline.png",
      mid: "./assets/img/yellowline.png",
      high: "./assets/img/greenline.png"
    };

    const labelText = {
      low: "پایین",
      mid: "متوسط",
      high: "بالا"
    };

    return `
    <section class="task" data-id="${this.id}">
      <div>
        <img 
          class="red-line" 
          src="${redLineMap[this.priority] || redLineMap.low}" 
          alt="red-line"
        />
        <div class="task-title">
          <input 
            type="checkbox" 
            class="todo" 
            id="todo-${this.id}"
          />
          <p>${this.taskName}</p>
          <label 
            class="${this.priority} priority" 
            for="todo-${this.id}"
          >${labelText[this.priority] || labelText.low}</label>
        </div>
        <h5>${this.taskDescription}</h5>
      </div>
      <img 
        class="task-threedots" 
        src="./assets/img/threedots.png" 
        alt="threedots"
      />
    </section>
  `;
  }

  EditToDoList() { }
  DeleteTask() { }
  static fromJSON(obj) {
    return new Task(obj.taskName, obj.taskDescription, obj.priority);
  }
}

function saveTasksToLocalStorage(taskList) {
  localStorage.setItem("todoList", JSON.stringify(taskList));
}

function loadTasksFromLocalStorage() {
  const data = localStorage.getItem("todoList");
  if (!data) return [];
  image.className = "hide";
  return JSON.parse(data).map(Task.fromJSON);
}

let tasks = loadTasksFromLocalStorage();

function renderTasks() {
  spancount.innerHTML = `${tasks.length || 0} `;
  const priorityOrder = { high: 1, mid: 2, low: 3 };

  if(tasks.length === 0) return;

  const sortedTasks = tasks.slice().sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const container = document.querySelector(".task-list");
  container.innerHTML = sortedTasks
    .map((task) => task.displayTaskHTML())
    .join("");
}

renderTasks();

// start - Create Container Todo Functionality
const AddTaskBtnHandler = () => {
  todoCreationsContainer.classList.toggle("show");
  addTaskBtn.classList.toggle("hide");
  image.className = "hide";
};

addTaskBtn.addEventListener("click", AddTaskBtnHandler);
// end - Create Container Todo Functionality

// start - Create Todo Functionality
const TodoCreationBtnHandler = () => {
  // console.log(todoCreationTitle.value, todoCreationDesc.value);
  let userSelectedPriority;
  for (let i = 0; i < priorities.length; i++) {
    if (priorities[i].checked) {
      userSelectedPriority = priorities[i].value;
    }
  }
  if (userSelectedPriority === undefined) {
    alert("شما اولویتی برای تسک خود انتخاب نکرده‌اید");
  }
  // console.log(userSelectedPriority);

  const newToDo = new Task(
    todoCreationTitle.value,
    todoCreationDesc.value,
    userSelectedPriority
  );

  console.log(newToDo);
  tasks.push(newToDo);
  saveTasksToLocalStorage(tasks);
  renderTasks();
};

todoCreationBtn.addEventListener("click", TodoCreationBtnHandler);
// end - Create Todo Functionality

//update todolist

// start - Priority Button Functionality
const PrioritySelectionBtnHandler = () => {
  priorityList.classList.toggle("show");
  prioritySelectionBtnSvg.classList.toggle("rotate-90");
  for (let i = 0; i < priorities.length; i++) {
    if (priorities[i].checked) {
      priorities[i].checked = false;
    }
  }
  //   console.log(userSelectedPriority);
};

prioritySelectionBtn.addEventListener("click", PrioritySelectionBtnHandler);
// end - Priority Button Functionality

const PrioritiesHandler = () => {
  priorityList.classList.toggle("hide");
  prioritySelectionBtn.classList.toggle("hide");

  for (let i = 0; i < priority.length; i++) {
    if (priority.checked) {
      priority.classList.add("show");
    }
  }
};

priority.forEach((priority) => {
  priority.addEventListener("click", PrioritiesHandler);
});
