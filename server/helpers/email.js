import sgMail from '@sendgrid/mail';

export const send = async (to, subject, message) => {
	sgMail.setApiKey(process.env.SENDGRID_API);
	try {
		await sgMail.send({
			to,
			from: process.env.SENDER,
			subject,
			text: message,
		});
	} catch (e) {
		throw new Error(e.message);
	}
};
