import mongoose from 'mongoose';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import Joi from '@hapi/joi';

import { AUTH } from '../constants';

const {
	Schema: { Types },
} = mongoose;

const usersSchema = new mongoose.Schema({
	name: {
		type: Types.String,
		required: true,
		minlength: 5,
		maxlength: 50,
	},
	email: {
		type: Types.String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: Types.String,
		required: true,
		minlength: 5,
		maxlength: 1024,
	},
	amount: {
		type: Types.Number,
		required: true,
		default: 1000,
	},
	salt: {
		type: Types.String,
		required: false,
	},
});

usersSchema.methods.hashPassword = function () {
	this.salt = crypto.randomBytes(AUTH.crypto.randomBytesSize).toString('hex');
	this.password = crypto
		.pbkdf2Sync(
			this.password,
			this.salt,
			AUTH.crypto.iterations,
			AUTH.crypto.keyLength,
			AUTH.crypto.digest
		)
		.toString('hex');
};

usersSchema.methods.validatePassword = function (password) {
	const hash = crypto
		.pbkdf2Sync(
			password,
			this.salt,
			AUTH.crypto.iterations,
			AUTH.crypto.keyLength,
			AUTH.crypto.digest
		)
		.toString('hex');
	return this.password === hash;
};

usersSchema.methods.generateAuthToken = function () {
	return jwt.sign({ _id: this._id }, process.env.JWT_PRIVATE_KEY, {
		expiresIn: AUTH.tokenExpiresIn,
	});
};

const User = mongoose.model('User', usersSchema);

function validateUser(request) {
	const schema = Joi.object({
		name: Joi.string().min(5).max(50).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(1024).required(),
	});

	return schema.validate(request);
}

function validateLogin(request) {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(1024).required(),
	});

	return schema.validate(request);
}

export { User, validateUser, validateLogin };
