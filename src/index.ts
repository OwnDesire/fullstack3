import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import Person from './models/person';

const app = express();
app.use(express.static('dist'));
app.use(cors());
app.use(express.json());
app.use(morgan('tiny'));

app.get('/info', (request, response) => {
  Person.countDocuments({}, { hint: '_id_' })
    .then(count => {
      const output = `<p>Phonebook has info for ${count} people.<br/>${(new Date()).toString()}</p>`;
      response.send(output);
    });
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));

});

app.post('/api/persons', (request, response, next) => {
  // Currently rely on 'any' type for body value.
  const { name, number } = request.body;
  if (!name || !number) {
    next(`Data is missing: ${!name ? 'name' : ''} ${!number ? 'number' : ''}`);
  }

  const person = new Person({
    name: name as string,
    number: number as string,
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  })
});

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body;
  const person = {
    name: name,
    number: number
  };

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error))
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'Malformed id.' });
  }

  next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));