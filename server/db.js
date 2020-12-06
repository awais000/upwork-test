import mongoose from 'mongoose';
import debug from 'debug';

const logDb = debug('db');
const logMongo = logDb.extend('mongo');

export const connectMongoDb = () => {
	const mongoDbOptions = {
		useUnifiedTopology: true,
		useNewUrlParser: true,
		useFindAndModify: false,
		useCreateIndex: true,
	};

	console.log(process.env.MONGO_URI);

	try {
		mongoose.connect(process.env.MONGO_URI, mongoDbOptions, (error) => {
			logMongo('Connection closed %O', error);
		});
		mongoose.set('debug', true);
	} catch (ex) {
		logMongo(ex);
	}
};
