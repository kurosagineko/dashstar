export default (sequelize, DataTypes) =>
	sequelize.define(
		'task_assignments',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			task_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'tasks', key: 'id' } },
			user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
			status: { type: DataTypes.ENUM('assigned', 'in_progress', 'completed'), allowNull: false, defaultValue: 'assigned' },
			completed_at: { type: DataTypes.DATE, allowNull: true },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		},
		{ timestamps: false }
	);
