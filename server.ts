import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// request.html example
app.get('/users', async (req, res) => {
  // artificial delay to show the loader (spinner) in the UI
  await new Promise(resolve => setTimeout(resolve, 500));

  console.log(req.query);
  const limit = +(req.query.limit || '10');
  const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
  const users = await response.json() as { id: number; name: string }[];

  res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
      ${users.map(user => `<li>${user.name}</li>`).join('')}
    </ul>
  `);
});

// temperature.html example
app.post('/convert', (req, res) => {
  const fahrenheit = parseFloat(req.body.fahrenheit);
  const celsius = (fahrenheit - 32) * (5/9);

  res.send(`
    <p>
      ${fahrenheit} degrees Fahrenheit is equal to ${celsius.toFixed(2)} degrees Celsius
    </p>
  `);
});

// weather.html example
let currentTemperature = 20;
app.get('/temperature', (req, res) => {
  currentTemperature += Math.random() * 2 - 1; // random temperature change
  res.send(`${currentTemperature.toFixed(1)} °C`);
});

// search.html example
app.post('/search', async (req, res) => {
  const { search } = req.body;

  if (typeof search !== "string") {
    res.send("<tr></tr>");
  }

  const response = await fetch(`https://jsonplaceholder.typicode.com/users`);
  const users = await response.json() as { id: number; name: string; email: string; }[];

  const searchResults = users.filter(user => {
    const name = user.name.toLowerCase();
    const email = user.email.toLowerCase();

    return (name.includes(search) || email.includes(search));
  });

  res.send(searchResults.map(result => `
    <tr>
      <td><div class="my-4 p-2">${result.name}</div></td>
      <td><div class="my-4 p-2">${result.email}</div></td>
      <td></td>
    </tr>
  `).join(''))
});

// const dumbDb = ['initial item'];

// app.get('/todo', (req, res) => {
//   res.send(dumbDb.map((el) => `<li>${el}</li>`).join(''));
// });

// app.post('/todo', (req, res) => {
//   const { newTodo } = req.body;
//   dumbDb.push(newTodo);
//   res.send(`<li>${newTodo}</li>`);
// });

app.listen(port, () => {
  console.log('yo');
});
