import express from 'express';
const app = express();

const persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "333-1223"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
];

app.get('/', (request, response) => {
  response.send('Hello from backend!');
});

app.get('/info', (request, response) => {
  const output = `<p>Phonebook has info for ${persons.length} people.<br/>${(new Date()).toString()}</p>`;
  response.send(output);
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  const person = persons.find(person => person.id === id);
  if (!person) {
    return response.status(404).end();
  }
  response.json(person);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));