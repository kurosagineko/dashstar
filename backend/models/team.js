export default (sequelize, DataTypes) =>
	sequelize.define(
		'teams',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			workspace_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'workspaces', key: 'id' } },
			name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
			description: { type: DataTypes.TEXT, allowNull: true },
			manager_name: { type: DataTypes.STRING(150), allowNull: true },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			deleted_at: { type: DataTypes.DATE, allowNull: true },
		},
		{ timestamps: false }
	);
