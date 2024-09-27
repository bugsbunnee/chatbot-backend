import express, { Express } from 'express';
import registerConfig from './startup/config';
import registerRoutes from './startup/routes';
import registerDB from './startup/db';

const app: Express = express();

registerConfig();
registerDB();
registerRoutes(app);

const port = process.env.PORT || 4000;
const server = app.listen(port, () => console.log(`Listening on port: ${port}`));

export default server;