const express = require('express');
const { uuid } = require('uuidv4');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

const repositories = [];

app.get('/repositories', (req, res) => {
  res.json(repositories);
});

app.post('/repositories', (req, res) => {
  const { title, url, techs } = req.body;

  if (!title || !url || !techs) {
    res.status(400).json({ error: 'System not able to insert a new repository. Check your sent fields.' });
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  res.json(repository);
});

app.put('/repositories/:id', (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found.'});
  }

  repositories[repositoryIndex].title = title ? title : repositories[repositoryIndex].title;
  repositories[repositoryIndex].url   = url ? url : repositories[repositoryIndex].url; 
  repositories[repositoryIndex].techs = techs ? techs : repositories[repositoryIndex].techs;

  res.json(repositories[repositoryIndex]);
});

app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'System not able to update the repository. Check your sent fields.' });
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post('/repositories/:id/like', (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400).json({ error: 'System not able to update the repository. Check your sent fields.' });
  }

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return res.status(400).json({error: 'Repository not found.'});
  }

  repositories[repositoryIndex].likes++;
  
  res.json(repositories[repositoryIndex]);
});

module.exports = app;