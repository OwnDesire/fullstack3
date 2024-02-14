import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
const app = express();

let persons = [
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

const getNextId = () => {
  return Math.floor(Math.random() * 500) + 500;
}

app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

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

app.post('/api/persons', (request, response) => {
  // Currently rely on 'any' type for body value.
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({
      error: `Data is missing: ${!name ? 'name' : ''} ${!number ? 'number' : ''}`
    });
  }

  if (persons.find(person => person.name === (name as string))) {
    return response.status(400).json({
      error: 'Person with such name has already added.'
    });
  }

  const person = {
    id: getNextId(),
    name: name as string,
    number: number as string,
  };
  persons.push(person);
  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = +request.params.id;
  persons = persons.filter(person => person.id !== id);
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));