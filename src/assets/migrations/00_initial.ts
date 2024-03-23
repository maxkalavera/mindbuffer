import Sequelize, { DataTypes } from "sequelize"

import type { QueryInterface } from "sequelize"

export async function up({ context: queryInterface }: { context: QueryInterface}) {
	await queryInterface.createTable('notes', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false
		},
	})
}

export async function down({ context: queryInterface }: { context: QueryInterface}) {
	await queryInterface.dropTable('notes')
}
