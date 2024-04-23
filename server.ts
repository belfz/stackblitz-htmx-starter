import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

const dumbDb = ['initial item'];

app.get('/todo', (req, res) => {
  res.send(dumbDb.map((el) => `<li>${el}</li>`).join(''));
});

app.post('/todo', (req, res) => {
  const { newTodo } = req.body;
  dumbDb.push(newTodo);
  res.send(`<li>${newTodo}</li>`);
});

app.listen(port, () => {
  console.log('yo');
});
