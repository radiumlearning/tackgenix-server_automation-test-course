// use "import" to import libraries
import express from 'express';

// use "require" to import JSON files
const superAdminsRouter = require('./resources/super-admins');

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());
app.use('/super-admins', superAdminsRouter);

app.get('/', async (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Example app listening on port ${port}`);
});
