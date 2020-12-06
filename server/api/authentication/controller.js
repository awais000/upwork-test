import mongoose from 'mongoose';
import { Tryangle } from '../../models/tryangle';
import { User, validateUser, validateLogin } from '../../models/user';

export const signup = async (req, res) => {
	const { name, email, password } = req.body;

	const { error } = validateUser({ name, email, password });
	if (error) return res.status(400).send({ error: error[0]?.details?.message });

	let user = await User.findOne({ email });
	if (user) return res.status(400).send({ error: 'email already registered' });

	user = new User({ name, email, password, amount: 900 });

	user.hashPassword();
	user = await user.save();

	const tryangle = new Tryangle({ user: user._id });
	await tryangle.save();

	const token = user.generateAuthToken();

	res.send({
		user,
		token,
	});
};

export const signin = async (req, res) => {
	const { email, password } = req.body;

	const { error } = validateLogin({ email, password });

	if (error) {
		return res.status(400).send({ error: error[0]?.details?.message });
	}

	let user = await User.findOne({ email });
	if (!user) {
		return res.status(400).send({ error: 'Invalid email or password' });
	}

	const validPassword = user.validatePassword(password);
	if (!validPassword) {
		return res.status(400).send({ error: 'Invalid email or password' });
	}

	const token = user.generateAuthToken();

	res.send({
		user,
		token,
	});
};

export const refreshUser = async (req, res) => {
	const {
		user: { _id },
	} = req;

	console.log(req.user);
	const user = await User.findOne({ _id });
	if (!user) {
		return res.status(401).send({ error: 'Access removed for the user' });
	}

	const token = user.generateAuthToken();

	res.send({
		user,
		token,
	});
};
