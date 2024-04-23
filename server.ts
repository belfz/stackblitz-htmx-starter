import express from 'express';
import { resolve } from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('static'));

const dumbDb = ['elo mordo'];

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get('/todo', (req, res) => {
  res.send(dumbDb.map((el) => `<li>${el}</li>`).join(''));
});

app.post('/todo', (req, res) => {
  const { newTodo } = req.body;
  dumbDb.push(newTodo);
  res.send(`<li>${newTodo}</li>`);
});

app.get('/todo/next', (req, res) => {
  res.send(`
    <li>next</li>
  `);
});

app.listen(port, () => {
  console.log('yo');
});
