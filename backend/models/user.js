export default (sequelize, DataTypes) =>
	sequelize.define(
		'users',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			team_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
			username: { type: DataTypes.STRING(50), allowNull: false, unique: true },
			name: { type: DataTypes.STRING(100), allowNull: false },
			email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
			password_hash: { type: DataTypes.STRING(255), allowNull: false },
			role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
			level: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
			xp: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
			phone: { type: DataTypes.STRING(50), allowNull: true },
			country: { type: DataTypes.STRING(100), allowNull: true },
			city: { type: DataTypes.STRING(100), allowNull: true },
			timezone: { type: DataTypes.STRING(100), allowNull: true, defaultValue: 'UTC' },
			theme: { type: DataTypes.STRING(50), allowNull: true, defaultValue: 'light' },
			avatar_url: { type: DataTypes.STRING(255), allowNull: true },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			deleted_at: { type: DataTypes.DATE, allowNull: true },
		},
		{ timestamps: false }
	);
