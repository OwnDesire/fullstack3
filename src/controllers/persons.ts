import { Router } from "express";
import Person from "../models/person";

const personsRouter = Router();

// personsRouter.get('/info', (request, response) => {
//   Person.countDocuments({}, { hint: '_id_' })
//     .then(count => {
//       const output = `<p>Phonebook has info for ${count} people.<br/>${(new Date()).toString()}</p>`;
//       response.send(output);
//     });
// });

personsRouter.get('/', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

personsRouter.get('/:id', (request, response, next) => {
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

personsRouter.post('/', (request, response, next) => {
  // Currently rely on 'any' type for body value.
  const { name, number } = request.body;
  const person = new Person({
    name: name as string,
    number: number as string,
  });

  person.save()
    .then(savedPerson => {
      response.json(savedPerson);
    })
    .catch(error => next(error));
});

personsRouter.put('/:id', (request, response, next) => {
  // Currently rely on 'any' type for body value.
  const { name, number } = request.body;
  const person = {
    name: name as string,
    number: number as string
  };

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) {
        response.json(updatedPerson);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});

personsRouter.delete('/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
});

export default personsRouter;