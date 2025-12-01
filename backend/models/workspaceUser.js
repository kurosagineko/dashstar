export default (sequelize, DataTypes) =>
	sequelize.define(
		'workspace_users',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			workspace_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'workspaces', key: 'id' } },
			workspace_code: { type: DataTypes.STRING(64), allowNull: false },
			user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
			role: { type: DataTypes.ENUM('admin', 'user'), allowNull: false, defaultValue: 'user' },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		},
		{ timestamps: false }
	);
