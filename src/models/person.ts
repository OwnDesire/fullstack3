import mongoose from 'mongoose';

const url = process.env.MONGODB_URI!;
console.log('connection to', url);
mongoose.set('strictQuery', false);
mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB');
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error);
  });

interface IPerson {
  name: string,
  number: string
}

const personSchema = new mongoose.Schema<IPerson>({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: (v: string) => /(\d{2,3}-\d+){8,}/.test(v),
      message: props => `${props.value} has invalid number format.`,
      type: 'InvalidNumber'
    },
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

export default mongoose.model<IPerson>('Person', personSchema);