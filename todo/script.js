var taskContainer = document.getElementById("tasks");
var input = document.getElementById("todoContainer");
var saveButton = document.getElementById("button");

saveButton.addEventListener("click", saveTask);

function onLoad() {
	input.value = "";
	getAllTasks(function (tasks) {
		tasks.forEach(function (task) {
			createListItem(task);
		});
	});
}

onLoad();

function createListItem(task) {
	var list = document.createElement("div");
	list.setAttribute("class", "list-item");

	var span = document.createElement("span");
	span.setAttribute("class", "span");
	span.innerHTML = task.todo;

	var controls = document.createElement("div");
	controls.setAttribute("class", "controls");

	var deleteBtn = document.createElement("button");
	deleteBtn.setAttribute("class", "controlBtn");
	deleteBtn.innerHTML = "Delete";
	deleteBtn.addEventListener("click", deleteTask(task));

	var editBtn = document.createElement("button");
	editBtn.setAttribute("class", "controlBtn");
	editBtn.innerHTML = "Edit";
	editBtn.addEventListener("click", editTask(task));

	var isMarked = document.createElement("input");
	isMarked.setAttribute("type", "checkbox");
	if (task.isDone) {
		isMarked.checked = true;
		span.style.textDecoration = "line-through";
	}

	isMarked.onchange = changeCheckStatus(task);

	controls.appendChild(isMarked);
	controls.appendChild(editBtn);
	controls.appendChild(deleteBtn);
	list.appendChild(span);
	list.appendChild(controls);
	taskContainer.appendChild(list);
}

function saveTask() {
	var taskContent = input.value;
	if (taskContent.length > 0) {
		var data = {
			todo: taskContent,
			isDone: false,
			id: Date.now(),
		};

		var body = JSON.stringify(data);

		var request = new XMLHttpRequest();
		request.open("POST", "/save");
		request.setRequestHeader("Content-Type", "application/json");
		console.log(body);
		request.send(body);

		request.addEventListener("load", function () {
			createListItem(data);
			input.value = "";
		});
	} else {
		alert("Please enter a task");
	}
}

function getAllTasks(onResponse) {
	var request = new XMLHttpRequest();
	request.open("GET", "/todo");
	request.setRequestHeader("Content-Type", "application/json");
	request.send();

	request.addEventListener("load", () => {
		onResponse(JSON.parse(request.responseText));
	});
}

function deleteTask(task) {
    return function (event) { 
        event.stopPropagation();

        var rmvBtn = event.target;
        var request = new XMLHttpRequest();
        data = {
            id: task.id
        }

        request.open("POST", "/delete");
        request.setRequestHeader("Content-Type", "application/json");
        request.send(JSON.stringify(data));

        request.addEventListener("load", function () { 
            var listItem = rmvBtn.parentNode.parentNode;
            taskContainer.removeChild(listItem);
        });
    }
}

function editTask(task) {
    return function (event) {
		event.stopPropagation();
		var editedTask = prompt("Enter the updated task");
		if (editedTask.trim() !== "") {
			var body = {
				updatedTodo: editedTask,
				id: task.id,
			};
			var request = new XMLHttpRequest();
			request.open("POST", "/update");
			request.setRequestHeader("Content-type", "application/json");
			request.send(JSON.stringify(body));
			request.addEventListener("load", function () {
				var listItem = event.target.parentNode.parentNode;
				listItem.firstChild.innerHTML = editedTask;
				//  responseDivInnerHtml(request.responseText)
			});
		}
	};
}

function changeCheckStatus(task) {
	return function (event) {
		var doneMark = event.target;
		console.log(doneMark.checked);
		var request = new XMLHttpRequest();
		request.open("POST", "/doneStatus");
		var body = { id: task.id, isMarkDone: doneMark.checked };
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify(body));
		request.addEventListener("load", function () {
			var lineThrough = doneMark.parentNode.parentNode.firstChild;
			if (doneMark.checked) {
				lineThrough.style.textDecoration = "line-through";
			} else {
				lineThrough.style.textDecoration = "none";
			}
			// responseDivInnerHtml(request.responseText)
		});
	};
}
