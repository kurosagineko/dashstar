export default (sequelize, DataTypes) =>
	sequelize.define(
		'messages',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			workspace_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'workspaces', key: 'id' } },
			workspace_code: { type: DataTypes.STRING(64), allowNull: false },
			team_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
			sender_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
			recipient_user_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
			recipient_team_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'teams', key: 'id' } },
			subject: { type: DataTypes.STRING(150), allowNull: true },
			body: { type: DataTypes.TEXT, allowNull: true },
			content: { type: DataTypes.TEXT, allowNull: true },
			date_created: { type: DataTypes.STRING(50), allowNull: true },
			status: { type: DataTypes.ENUM('draft', 'sent'), allowNull: false, defaultValue: 'sent' },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		},
		{ timestamps: false }
	);
