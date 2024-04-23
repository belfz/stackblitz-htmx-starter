import express from 'express';
import bodyParser from 'body-parser';
import { v4 } from "uuid";

const app = express();
const port = 3010;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// request.html example
app.get('/users', async (req, res) => {
  const limit = +(req.query.limit || '10');
  const response = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}`);
  const users = await response.json() as { id: number; name: string }[];

  res.send(
    /*html*/
    `
      <h1 class="text-2xl font-bold my-4">Users</h1>
      <ul>
        ${users.map(user => `<li>${user.name}</li>`).join('')}
      </ul>
    `
  );
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

  res.send(searchResults.map(result => 
    /*html*/
    `
      <tr>
        <td><div class="my-4 p-2">${result.name}</div></td>
        <td><div class="my-4 p-2">${result.email}</div></td>
        <td></td>
      </tr>
    `
  ).join(''))
});

// validation.html example (email validation)
const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
app.post('/contact/email', (req, res) => {
  const { email } = req.body;

  const isValid = {
    message: "That email is valid",
    class: "text-green-700"
  };

  const isInvalid = {
    message: "Please use a valid email address",
    class: "text-red-700"
  };

  const result = emailRegex.test(email) ? isValid : isInvalid;

  return res.send(
    /*html*/
    `
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2">Email address</label>
        <input
          name="email"
          hx-post="/contact/email"
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-blue-500"
          type="email"
          id="email"
          value="${email}"
          required
        />
        <div class="${result.class}">${result.message}</div>
      </div>
    `);
});

// todos.html example
type TodoItem = {
  title: string;
  id: string;
  done: boolean;
}

const newTodo = (title: string): TodoItem => ({
  title,
  id: `id-${v4()}`, // make sure all ids start with a letter, otherwise they can't be used as valid ids for html elements
  done: false
});

// pretend this is a database ;)
let dumbDb: TodoItem[] = [newTodo('initial item')];

const renderTodoItem = (item: TodoItem): string => (
  /*html*/
  `
    <li class="flex items-center mb-2 bg-slate-500 p-2 rounded shadow" id="${item.id}">
      <button
        hx-delete="/todo/${item.id}"
        hx-target="#todo-list"
        hx-swap="innerHTML"
        hx-confirm="Are you sure you want to remove this item?"
        class="text-sm bg-gray-100 hover:bg-gray-300 py-2 px-2 rounded-full focus:outline-none focus:shadow-outline shadow transition duration-150 ease-in-out mr-2"
      >❌</button>
      <button
        hx-put="/todo/${item.id}"
        hx-target="#${item.id}"
        hx-swap="outerHTML"
        class="text-sm bg-gray-100 hover:bg-gray-300 py-2 px-2 rounded-full focus:outline-none focus:shadow-outline shadow transition duration-150 ease-in-out mr-2"
      >${item.done ? "⏳" : "✅"}</button>
      <h1 class="text-xl ${item.done ? "line-through" : "no-underline"}">${item.title}</h1>
    </li>
  `
)

app.get('/todo', (_req, res) => {
  res.send(dumbDb.map(renderTodoItem).join(''));
});

app.post('/todo', (req, res) => {
  const newTodoItem = newTodo(req.body.newTodo);
  dumbDb.push(newTodoItem);
  res.send(renderTodoItem(newTodoItem));
});

app.put('/todo/:id', (req, res) => {
  const { id } = req.params;
  const itemToModify = dumbDb.find(elem => elem.id === id);
  if (itemToModify) {
    itemToModify.done = !itemToModify.done;
    res.send(renderTodoItem(itemToModify));
  }

  res.status(400).send();
});

app.delete('/todo/:id', (req, res) => {
  const { id } = req.params;

  dumbDb = dumbDb.filter(elem => elem.id !== id);

  return res.send(dumbDb.map(renderTodoItem).join(""));
});

app.listen(port, () => {
  console.log('server is ready');
});
