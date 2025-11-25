export default (sequelize, DataTypes) =>
	sequelize.define(
		'badges',
		{
			id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
			name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
			icon_url: { type: DataTypes.STRING(255), allowNull: true },
			created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
			updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
		},
		{ timestamps: false }
	);
