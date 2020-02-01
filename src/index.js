const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let count = 0;

/**
 * Global middleware that count requests.
 */
function requestCount(req, res, next) {
  count++;
  console.log(`Número de requests: ${count}`);

  return next();
}

server.use(requestCount);

/**
 * Middleware checks whether the informed project exists.
 */
function checkProjectIdExists(req, res, next) {
  const { id } = req.params;

  const project = projects.find(proj => proj.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  return next();
}

/**
 * Return all projects
 */
server.get("/projects", (req, res) => {
  return res.json(projects);
});

/**
 * Register a new project
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  project = { id, title, tasks: [] };

  projects.push(project);

  return res.json(project);
});

/**
 * Adds a new task to the project at the given id
 */
server.post("/projects/:id/tasks", checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id === id);

  project.tasks.push(title);

  return res.json(project);
});

/**
 * Change the title of the project with the id in the route parameters.
 */
server.put("/projects/:id", checkProjectIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(proj => proj.id === id);

  project.title = title;

  return res.json(project);
});

/**
 * Delete the project with the id present in the route parameters.
 */
server.delete("/projects/:id", checkProjectIdExists, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(proj => proj.id === id);

  projects.splice(projectIndex, 1);

  return res.status(200).send();
});

server.listen(3333);
