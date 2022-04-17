var express = require("express");
var fs = require("fs");
var app = express();

app.use(express.static("todo"));
app.use(express.json());

app.get("/todo", function (req, res) {
	console.log(req.body);
	fs.readFile("./db.txt", "utf-8", function (err, data) {
		res.end(data);
	});
});

app.post("/save", function (req, res) {
	fs.readFile("./db.txt", "utf-8", function (err, data) {
		var todos = [];
		if (data.length > 0) {
			todos = JSON.parse(data);
		}
		todos.push(req.body);
		console.log(req.body);
		fs.writeFile("./db.txt", JSON.stringify(todos), function (err, data) {
			if (err) {
				res.end("error", err);
			} else {
				res.send("saved");
			}
		});
	});
});

app.post('/delete', function (req, res) { 
	fs.readFile("./db.txt", "utf-8", function (err, data) { 
		var taskId = req.body.id;
		var todos = [];
		if (data.length > 0) {
			todos = JSON.parse(data);
		}

		var newTodos = todos.filter(function (todo) { 
			return todo.id !== taskId;
		});

		fs.writeFile("./db.txt", JSON.stringify(newTodos), function (err, data) { 
			if (err) { 
				res.end("error", err); 
			} else { 
				res.send("deleted"); 
			}
		});
	});
});

app.post("/update", function (req, res) {
	fs.readFile("./db.txt", "utf-8", function (err, data) {
		var taskId = req.body.id;
		var updatedTodo = req.body.updatedTodo;
		var todos = [];
		if (data.length > 0) {
			todos = JSON.parse(data);
		}
		var newTodos = todos.map(function (task) {
			if (taskId === task.id) {
				task.todo = updatedTodo;
				return task;
			}
			return task;
		});
		fs.writeFile(
			"./db.txt",
			JSON.stringify(newTodos),
			function (err, data) {
				if (err) {
					res.end("error", err);
				} else {
					res.end("updated");
				}
			}
		);
	});
});

app.post("/doneStatus", function (req, res) {
	fs.readFile("./db.txt", "utf-8", function (err, data) {
		var taskId = req.body.id;
		var doneMark = req.body.isMarkDone;
		var todos = [];
		if (data.length > 0) {
			todos = JSON.parse(data);
		}
		var newTodos = todos.map(function (task) {
			if (taskId === task.id) {
				task.isDone = doneMark;
				return task;
			}
			return task;
		});
		fs.writeFile(
			"./db.txt",
			JSON.stringify(newTodos),
			function (err, data) {
				if (err) {
					res.end("error");
				} else {
					res.end("status changed");
				}
			}
		);
	});
});

app.listen(3000, function () {
	console.log("listening on 3000");
});
