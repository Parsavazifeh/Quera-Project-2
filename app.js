const addTaskBtn = document.querySelector(".add-task-btn");
const image = document.querySelector(".image");
const todoCreationsContainer = document.querySelector(
	".todo-creations-container"
);
const todoCreationBtn = document.querySelector(".todo-creation-btn");
const todoCreationTitle = document.querySelector(".todo-creation-title");
const todoCreationDesc = document.querySelector(".todo-creation-desc");
const todoCreationTop = document.querySelector(".todo-creations-top");
const prioritySelectionBtn = document.querySelector(".priority-selection-btn");
const prioritySelectionBtnSvg = document.querySelector(
	".priority-selection-btn svg"
);
const priorityList = document.querySelector(".priority-list");
const priorities = document.querySelectorAll("input[name='priority']");
const selectedPrioritySpan = document.querySelector(".selected-priority");
const priorityContainer = document.querySelector(".priority-container")
const InCompletedCount = document.getElementById("incomplete");
const CompletedCount = document.getElementById("complete");
const priority = document.querySelectorAll(".priority");

const priorityLabels = {
	low: "پایین",
	mid: "متوسط",
	high: "بالا"
};

class Task {
	static _nextId = 1;

	constructor(taskName, taskDescription, priority, id = null, completed = false) {
		this.id = id !== null ? id : Task._nextId++;
		this.taskName = taskName;
		this.taskDescription = taskDescription;
		this.priority = priority;
		this.completed = completed;
	}

	static fromJSON(obj) {
		const t = new Task(obj.taskName, obj.taskDescription, obj.priority, obj.id, obj.completed || false);
		Task._nextId = Math.max(Task._nextId, obj.id + 1);
		return t;
	}

	displayTaskHTML() {
		const redLineMap = {
			high: "./assets/img/redline.png",
			mid: "./assets/img/yellowline.png",
			low: "./assets/img/greenline.png"
		};

		return `
			<section class="task" data-id="${this.id}">
				<div>
					<img class="red-line" src="${redLineMap[this.priority] || redLineMap.low}" alt="lines"/>
					<div class="task-title">
						<input type="checkbox" class="todo" id="todo-${this.id}"/>
						<p>${this.taskName}</p>
						<label class="${this.priority} priority" for="todo-${this.id}">${priorityLabels[this.priority] || priorityLabels.low}</label>
					</div>
					<h5 class="task-h5">${this.taskDescription}</h5>
				</div>
				<div class="task-threedots">
					<img src="./assets/img/threedots.png" alt="threedots" />
					<div class="task-popup hide">
						<img src="./assets/img/edit-button.png" alt="edit"/>
						<img src="./assets/img/trash-button.png" alt="delete"/>
					</div>
				</div>
			</section>
		`;
	}
	EditToDoList() { }
}

function saveTasksToLocalStorage(taskList) {
	localStorage.setItem("todoList", JSON.stringify(taskList));
}

todoCreationsContainer.classList.add("hide");

function loadTasksFromLocalStorage() {
	const data = localStorage.getItem("todoList");
	if (!data) return [];
	image.className = "hide";
	return JSON.parse(data).map(Task.fromJSON);
}

function styleTaskAsCompleted(taskEl) {
	const clonedTask = taskEl.cloneNode(true);

	const checkbox = clonedTask.querySelector(".todo");
	checkbox.disabled = true;
	checkbox.checked = true;

	const titleP = clonedTask.querySelector(".task-title p");
	titleP.style.textDecoration = "line-through";

	const desc = clonedTask.querySelector(".task-h5");
	const priorityLabel = clonedTask.querySelector("label.priority");

	desc.style.display = "none";
	priorityLabel.style.display = "none";

	const popup = clonedTask.querySelector(".task-popup");
	if (popup) popup.remove();

	const redLine = clonedTask.querySelector(".red-line");
	if (redLine) redLine.classList.replace('red-line', 'red-line-done');

	return clonedTask;
}

const setupCheckboxListeners = () => {
	const checkboxes = document.querySelectorAll(".task .todo");
	checkboxes.forEach(checkbox => {
		checkbox.addEventListener("change", (e) => {
			const taskId = Number(e.target.id.replace("todo-", ""));
			const task = tasks.find(t => t.id === taskId);
			const taskEl = e.target.closest(".task");

			if (e.target.checked) {
				task.completed = true;
				saveTasksToLocalStorage(tasks);

				const completedContainer = document.querySelector(".task-list-completed");
				const styledTask = styleTaskAsCompleted(taskEl);

				completedContainer.appendChild(styledTask);
				taskEl.remove();
			}
		});
	});
};
// end - Completed Tasks Functinality

function renderTasks() {
	const priorityOrder = { high: 1, mid: 2, low: 3 };
	
	const activeTasks = tasks.filter(t => !t.completed);
	const completedTasks = tasks.filter(t => t.completed);
	CompletedCount.innerHTML = `${completedTasks.length || 0} `;
	InCompletedCount.innerHTML = `${activeTasks.length || 0} `;

	const sortedActiveTasks = activeTasks.sort((a, b) => {
		return priorityOrder[a.priority] - priorityOrder[b.priority];
	});

	const activeContainer = document.querySelector(".task-list");
	const completedContainer = document.querySelector(".task-list-completed");

	activeContainer.innerHTML = sortedActiveTasks.map(t => t.displayTaskHTML()).join("");

	completedContainer.innerHTML = "";
	completedTasks.forEach(task => {
		const temp = document.createElement("div");
		temp.innerHTML = task.displayTaskHTML();
		const styledTask = styleTaskAsCompleted(temp.firstElementChild);
		completedContainer.appendChild(styledTask);
	});
	setupCheckboxListeners();
}

let currentEditTaskId = null;
let tasks = loadTasksFromLocalStorage();
renderTasks();

// Show form
function showForm(mode = "add") {
	todoCreationsContainer.classList.remove("hide");
	todoCreationBtn.dataset.mode = mode;
	todoCreationBtn.textContent = mode === "edit" ? "ویرایش تسک" : "اضافه کردن تسک";
}

// Hide form and reset
function hideForm() {
	todoCreationsContainer.classList.add("hide");
	todoCreationTitle.value = "";
	todoCreationDesc.value = "";
	priorities.forEach(p => p.checked = false);
	todoCreationBtn.dataset.mode = "add";
	todoCreationBtn.textContent = "اضافه کردن تسک";
	currentEditTaskId = null;
}

const AddTaskBtnHandler = () => {
	hideForm();
	showForm("add");
	addTaskBtn.classList.add("hide");
	selectedPrioritySpan.classList.add("hide");
	image.className = "hide";
};

addTaskBtn.addEventListener("click", AddTaskBtnHandler);

// Create Todo Functionality
const TodoCreationBtnHandler = () => {
	let userSelectedPriority;
	for (let i = 0; i < priorities.length; i++) {
		if (priorities[i].checked) {
			userSelectedPriority = priorities[i].value;
		}
	}
	if (!todoCreationTitle.value.trim()) {
		alert("لطفاً نام تسک را وارد کنید");
		return;
	}
	if (userSelectedPriority === undefined) {
		alert("لطفاً اولویت تسک را انتخاب کنید");
		return;
	}

	if (todoCreationBtn.dataset.mode === "edit" && currentEditTaskId !== null) {
		const task = tasks.find(t => t.id === currentEditTaskId);
		task.taskName = todoCreationTitle.value.trim();
		task.taskDescription = todoCreationDesc.value.trim();
		task.priority = userSelectedPriority;
	} else {
		const newToDo = new Task(
			todoCreationTitle.value.trim(),
			todoCreationDesc.value.trim(),
			userSelectedPriority
		);
		tasks.push(newToDo);
	}

	saveTasksToLocalStorage(tasks);
	renderTasks();
	hideForm();
	addTaskBtn.classList.remove("hide");
};

todoCreationBtn.addEventListener("click", TodoCreationBtnHandler);

const PrioritySelectionBtnHandler = () => {
	priorityList.classList.toggle("show");
	prioritySelectionBtnSvg.classList.toggle("rotate-90");
	priorities.forEach(priority => {
		priority.checked = false;
	});
};

prioritySelectionBtn.addEventListener("click", PrioritySelectionBtnHandler);

const PrioritiesHandler = (event) => {
	const selected = event.target;
	const value = selected.value;
	priorityContainer.classList.add("hide");
	const span = document.createElement("span");
	span.className = `priority ${value}`;

	span.innerHTML = `
		<img src="./assets/img/close-icon.svg" 
		 	alt="remove" 
		 	class="priority-remove-icon" 
		 	style="cursor:pointer;" />
	  	<label for="${value}-priority">${priorityLabels[value]}</label>
	`;
	todoCreationTop.appendChild(span);

	span.querySelector(".priority-remove-icon")
		.addEventListener("click", () => {
			span.remove();
			priorityContainer.classList.remove("hide");
			priorities.forEach(p => p.checked = false);
		});
};

priorities.forEach(priority => {
	priority.addEventListener("click", PrioritiesHandler);
});


//Task List Three Dots Functinality
document.addEventListener("DOMContentLoaded", () => {
	const container = document.querySelector(".task-list");
	container.addEventListener("click", (e) => {
		const taskEl = e.target.closest(".task");
		if (!taskEl) return;

		const taskId = Number(taskEl.dataset.id);
		const task = tasks.find(t => t.id === taskId);
		console.log(e.target)

		if (e.target.closest(".task-threedots > img")) {
			const popup = taskEl.querySelector(".task-popup");
			popup.classList.toggle("hide");
			return;
		}

		if (e.target.alt === "edit") {
			currentEditTaskId = taskId;
			todoCreationTitle.value = task.taskName;
			todoCreationDesc.value = task.taskDescription;
			priorities.forEach(p => {
				p.checked = p.value === task.priority;
			});

			showForm("edit");
		}

		if (e.target.alt === "delete") {
			taskEl.querySelector(".task-popup").classList.add("hide");
			tasks = tasks.filter(t => t.id !== taskId);
			taskEl.remove();
			saveTasksToLocalStorage(tasks);
			return;
		}
	});
});