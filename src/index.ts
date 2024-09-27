import express, { Express } from 'express';
import 'express-async-errors';

import registerConfig from './startup/config';
import registerRoutes from './startup/routes';
import registerDB from './startup/db';
import logger from './startup/logger';

const app: Express = express();

registerConfig();
registerDB();
registerRoutes(app);

const port = process.env.PORT || 4000;
app.listen(port, () => logger.info(`Listening on port: ${port}`));

export default app;