import jwt from 'jsonwebtoken';

import { Tryangle } from '../../models/tryangle';
import { User } from '../../models/user';

import * as email from '../../helpers/email';

export const getTryangles = async (req, res) => {
	const { user } = req;
	const tryangles = await Tryangle.find({ user: user._id });

	res.send({ tryangles });
};

export const getTryangle = async (req, res) => {
	const { id } = req.params;

	const tryangle = await Tryangle.findById(id);

	res.send({ tryangle });
};

export const createTryangle = async (req, res) => {
	const {
		user: { _id },
	} = req;

	let user = await User.findById(_id);

	if (user.amount < 100) {
		return res.status(402).send({ error: 'Insufficient Funds' });
	}

	let tryangle = new Tryangle({ user: user._id });
	tryangle = await tryangle.save();

	user = await User.findByIdAndUpdate(
		user._id,
		{ amount: user.amount - 100 },
		{ new: true }
	);

	res.status(201).send({ tryangle, user });
};

export const getTryangleBalance = async (req, res) => {
	const { id } = req.params;

	if (!id) {
		return res.status(400).send({ error: 'Tryangle id is missing' });
	}

	const tryangle = await Tryangle.findById(id);

	if (!tryangle) {
		return res.status(204).send({ error: 'Tryangle does not exist' });
	}

	res.status(200).send({ balance: tryangle.balance });
};

export const checkoutTryangle = async (req, res) => {
	const {
		user: { _id },
		body: { tryangleId },
	} = req;

	const tryangle = await Tryangle.findById(tryangleId);
	let user = await User.findById(_id);

	const amount = user.amount + tryangle.balance;

	user = await User.findByIdAndUpdate(user._id, { amount }, { new: true });

	await Tryangle.findByIdAndDelete(tryangleId);

	res.status(200).send({ user });
};

export const sendInvite = async (req, res) => {
	const { tryangleId, to } = req.body;

	const inviteCode = jwt.sign(
		{ tryangleId, userId: req.user._id },
		process.env.JWT_PRIVATE_KEY,
		{ expiresIn: '14 days' }
	);

	const message = `Invite link: https://www.tryangle.com/invite/${inviteCode}`;

	try {
		await email.send(to, 'Tryangle Invite', message);
	} catch (e) {
		console.log(e);
		return res.status(503).send({ error: 'Could not send email', e });
	}

	let tryangle = await Tryangle.findById(tryangleId);
	tryangle = await Tryangle.findByIdAndUpdate(
		tryangleId,
		{
			invitesSent: tryangle.invitesSent + 1,
			pendingInvites: tryangle.pendingInvites + 1,
		},
		{ new: true }
	);

	res.status(200).send({ tryangle });
};

export const acceptInvite = async (req, res) => {
	const { inviteCode } = req.body;

	let decoded;
	try {
		decoded = jwt.verify(inviteCode, process.env.JWT_PRIVATE_KEY);
	} catch (e) {
		return res.status(400).send({ error: 'Invalid Code' });
	}

	const { tryangleId, userId } = decoded;

	const tryangle = await Tryangle.findById(tryangleId);

	if (!tryangle) {
		return res.status(401).send({ error: 'Tryangle does not exist anymore' });
	}

	const user = await User.findById(userId);

	const balance =
		tryangle.acceptedInvites === 0
			? tryangle.balance + 50
			: tryangle.balance + 100;

	await Tryangle.findByIdAndUpdate(tryangleId, {
		balance,
		acceptedInvites: tryangle.acceptedInvites + 1,
		pendingInvites: tryangle.pendingInvites - 1,
	});

	res.status(200).send({ message: 'Invite Accepted' });
};
