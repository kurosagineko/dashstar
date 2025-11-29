import authRoutes from './backend/routes/authRoutes.js';
import express from 'express';
import sequelize from './backend/config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use('/api', authRoutes);

//Use this one for prod
(async () => {
	try {
		await sequelize.authenticate();
		console.log('connection established');

		await sequelize.sync();

		const server = app.listen(PORT, () => {
			console.log(`Server is listening at http://localhost:${PORT}`);
		});

		server.on('error', err => {
			console.error('HTTP server error:', err);
			process.exit(1);
		});
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
})();

// // sudo mysql -u <username> -p -h <host>

// export NODE_EXTRA_CA_CERTS=$(pwd)/certs/aiven-ca.pem
