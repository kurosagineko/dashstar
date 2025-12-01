export default (sequelize, DataTypes) =>
	sequelize.define(
		'teams',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			workspace_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'workspaces', key: 'id' } },
			workspace_code: { type: DataTypes.STRING(64), allowNull: false },
			team_name: { type: DataTypes.STRING(150), allowNull: false },
			name: { type: DataTypes.STRING(150), allowNull: true },
			description: { type: DataTypes.TEXT, allowNull: true },
			manager_name: { type: DataTypes.STRING(150), allowNull: true },
			user_id_list: { type: DataTypes.TEXT, allowNull: true },
			admin_id: { type: DataTypes.INTEGER, allowNull: true },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			deleted_at: { type: DataTypes.DATE, allowNull: true },
		},
		{ timestamps: false }
	);
