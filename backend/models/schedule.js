export default (sequelize, DataTypes) =>
	sequelize.define(
		'schedules',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			workspace_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'workspaces', key: 'id' } },
			workspace_code: { type: DataTypes.STRING(64), allowNull: false },
			team_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
			title: { type: DataTypes.STRING(150), allowNull: true },
			message: { type: DataTypes.TEXT, allowNull: true },
			description: { type: DataTypes.TEXT, allowNull: true },
			time_start: { type: DataTypes.STRING(50), allowNull: true },
			time_end: { type: DataTypes.STRING(50), allowNull: true },
			start_at: { type: DataTypes.DATE, allowNull: true },
			end_at: { type: DataTypes.DATE, allowNull: true },
			status: { type: DataTypes.ENUM('planned', 'active', 'completed', 'cancelled'), allowNull: false, defaultValue: 'planned' },
			target_team_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
			target_user_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
			created_by: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		},
		{ timestamps: false }
	);
