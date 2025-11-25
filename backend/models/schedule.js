export default (sequelize, DataTypes) =>
	sequelize.define(
		'schedules',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			workspace_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'workspaces', key: 'id' } },
			title: { type: DataTypes.STRING(150), allowNull: false },
			description: { type: DataTypes.TEXT, allowNull: true },
			start_at: { type: DataTypes.DATE, allowNull: false },
			end_at: { type: DataTypes.DATE, allowNull: true },
			status: { type: DataTypes.ENUM('planned', 'active', 'completed', 'cancelled'), allowNull: false, defaultValue: 'planned' },
			target_team_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
			target_user_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
			created_by: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		},
		{ timestamps: false }
	);
