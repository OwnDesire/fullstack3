import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Person from './models/person';

const app = express();
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (request, response) => {
  response.send('Hello from backend!');
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      response.json(person);
    })
    .catch(error => {
      response.status(404).end();
    })

});

app.post('/api/persons', (request, response) => {
  // Currently rely on 'any' type for body value.
  const { name, number } = request.body;
  if (!name || !number) {
    return response.status(400).json({
      error: `Data is missing: ${!name ? 'name' : ''} ${!number ? 'number' : ''}`
    });
  }

  // if (persons.find(person => person.name === (name as string))) {
  //   return response.status(400).json({
  //     error: 'Person with such name has already added.'
  //   });
  // }

  const person = new Person({
    name: name as string,
    number: number as string,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
});

// app.delete('/api/persons/:id', (request, response) => {
//   const id = +request.params.id;
//   persons = persons.filter(person => person.id !== id);
//   response.status(204).end();
// });

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));