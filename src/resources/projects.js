import express from 'express';
import fs from 'fs';

const projects = require('../data/projects.json');

const router = express.Router();

router.delete('/:id', (req, res) => {
  const reqId = req.params.id;
  const deleted = projects.filter((project) => project.id !== parseInt(reqId, 10));

  if (deleted.length !== projects.length) {
    fs.writeFile('src/data/projects.json', JSON.stringify(deleted, null, 2), (err) => (err ? res.status(404).json(
      {
        msg: 'Cannot delete project',
      },
    ) : res.json(
      {
        msg: 'Project deleted',
      },
    )
    ));
  } else {
    res.status(404).json(
      {
        msg: 'Invalid id',
      },
    );
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const reqBody = req.body;
  const updated = projects.find((project) => project.id === parseInt(id, 10));
  const deleted = projects.filter((project) => project.id !== parseInt(id, 10));
  const empty = Object.values(reqBody).filter((value) => value === '' || value === null);

  if (!reqBody) {
    res.status(400).json(
      {
        msg: 'Bad request',
      },
    );
  }
  if (!updated) {
    res.status(404).json(
      {
        msg: 'Project not found',
      },
    );
  } else if (Object.keys(reqBody).length < 5) {
    res.status(400).json(
      {
        msg: 'Must contains al least 5 fields',
      },
    );
  } else if (empty.length !== 0) {
    res.status(400).json(
      {
        msg: 'Property cannot be empty',
      },
    );
  } else {
    deleted.push(reqBody);
    reqBody.id = parseInt(id, 10);
    reqBody.projectManagerId = parseInt(id, 10);
    deleted.sort((a, b) => (a.id - b.id));
    fs.writeFile('src/data/projects.json', JSON.stringify(deleted, null, 2), (err) => (err ? res.status(400).json(
      {
        msg: 'Cannot delete project',
      },
    )
      : res.status(200).json(
        {
          msg: 'Project updated',
        },
      )));
  }
  res.json(
    {
      msg: 'Project updated',
    },
  );
});

router.get('/projects?', (req, res) => {
  const queryParams = req.query;
  let filter = projects;

  if (Object.keys(queryParams).length > 0) {
    const filterProjectName = queryParams.projectName;
    const filterProjectManagerId = parseInt(queryParams.projectManagerId, 10);
    const filterProjectStartDate = queryParams.projectStartDate;
    filter = projects.filter((project) => Object.keys(project) === Object.keys(queryParams));

    if (filterProjectName) {
      filter = projects.filter((project) => project.projectName.includes(filterProjectName));
    }

    if (filterProjectManagerId) {
      filter = projects.filter((project) => project.projectManagerId === filterProjectManagerId);
    }

    if (filterProjectStartDate) {
      filter = projects.filter(
        (project) => project.projectStartDate.includes(filterProjectStartDate),
      );
    }
  }
  if (filter.length !== 0) {
    res.status(200).json(
      {
        data: filter,
      },
    );
  } else {
    res.status(400).json({
      msg: 'Invalid value',
    });
  }
});

export default router;
