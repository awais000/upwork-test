import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv-flow';
import cors from 'cors';
import debug from 'debug';

import * as db from './db';
import api from './api';

dotenv.config();

const port = process.env.PORT || 4040;
const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

if (!isProduction) {
	debug.enable('*,-babel:config:config-chain');
	app.use(morgan('dev'));
} else {
	app.use(morgan('combined'));
	app.use((req, res, next) => {
		if (req.secure) {
			next();
		} else {
			res.redirect('https://' + req.headers.host + req.url);
		}
	});
}

app.use('/api', api);

app.listen(port, () => console.log(`App listening on port ${port}`));

db.connectMongoDb();
