import express from 'express';
import 'express-async-errors';
import { propertyRoutes } from './routes';

import errorHandler from './middlewares/error-handler';

const app = express();
app.use('/properties', propertyRoutes);
app.use(errorHandler);

export default app;
