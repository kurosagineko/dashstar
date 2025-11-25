export default (sequelize, DataTypes) =>
	sequelize.define(
		'xp_events',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
			task_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'tasks', key: 'id' } },
			delta: { type: DataTypes.INTEGER, allowNull: false },
			reason: { type: DataTypes.STRING(255), allowNull: false },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		},
		{ timestamps: false }
	);
