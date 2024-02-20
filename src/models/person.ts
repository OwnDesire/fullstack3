import mongoose from 'mongoose';

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
      validator: (v: string) => /\d{2,3}-\d{5,}/.test(v),
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