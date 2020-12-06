import jwt from 'jsonwebtoken';

export function authentication(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token)
		return res
			.status(401)
			.send({ message: 'Access denied. no token provided' });

	try {
		const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
		req.user = decoded;
		next();
	} catch (ex) {
		res.status(401).send({ message: ex.message });
	}
}
