import 'dotenv/config';
/* global process */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	const token = authHeader.split(' ')[1];
	try {
		const payload = jwt.verify(token, JWT_SECRET);
		req.user = { id: payload.id };
		return next();
	} catch {
		return res.status(401).json({ message: 'Invalid token' });
	}
}

export function requireAdmin(req, res, next) {
	if (!req.user) {
		return res.status(401).json({ message: 'Unauthorized' });
	}

	if (req.user.role !== 'admin') {
		return res.status(403).json({ message: 'Forbidden' });
	}

	return next();
}
