import config from './utils/config';
import express from 'express';
import cors from 'cors';
import personsRouter from './controllers/persons';
import morgan from 'morgan';
import middleware from './utils/middleware';
import logger from './utils/logger';
import mongoose from 'mongoose';

const app = express();

logger.info('connection to', config.MONGODB_URI);
mongoose.set('strictQuery', false);
mongoose.connect(config.MONGODB_URI!)
  .then(result => {
    logger.info('Connected to MongoDB');
  })
  .catch(error => {
    logger.error('error connecting to MongoDB', error.message);
  });

app.use(cors());
app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));
app.use('/api/persons', personsRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

export default app;