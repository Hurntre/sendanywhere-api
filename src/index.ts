import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import db from './db';
import routes from './routes';
import { trimmer } from './middleware';

// Load environment variables
dotenv.config();
const port = process.env.PORT || 1999;
const baseUrl = '/api/v1';

// Initialize express app
const app: Express = express();

// Express inbuilt body parser to read json data and urlencoded to read url encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply request body trimmer middleware
app.use(trimmer);

// Third party middleware
app.use(cors()); // cors middleware to enable cors
app.use(helmet()); // helmet middleware to secure the app by setting various HTTP headers
app.use(compression()); // compression middleware to compress response body

// Welcome route
app.get('/', (req: Request, res: Response) => {
    res.redirect(301, baseUrl);
});
app.get(`${baseUrl}/`, (req: Request, res: Response) => {
    res.status(200).json({
        message: 'Welcome to the SendAnywhere API',
    });
});

// Routes with base URL
app.use(baseUrl, routes);

// catch invalid routes
app.all('*', (req, res) => {
    res.status(404).json({
        error: 'This route does not exist yet!',
    });
});

// connect to database server and start application server
db.connect()
    .then(() => {
        app.listen(port, () =>
            console.log(`Server listening on port ${port}...`)
        );
    })
    .catch((error) => {
        console.log('Error connecting to MongoDB', error);
    });

// export for access to server in tests
export default app;
