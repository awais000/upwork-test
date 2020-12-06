import mongoose from 'mongoose';

const {
	Schema: { Types },
} = mongoose;

const tryangleSchema = mongoose.Schema({
	balance: {
		type: Types.Number,
		default: 0,
	},
	user: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	invitesSent: { type: Types.Number, default: 0 },
	pendingInvites: { type: Types.Number, default: 0 },
	acceptedInvites: { type: Types.Number, default: 0 },
});

export const Tryangle = mongoose.model('Tryangle', tryangleSchema);
