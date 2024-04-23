import Sequelize, { DataTypes } from "sequelize"

import type { QueryInterface } from "sequelize"

export async function up({ context: queryInterface }: { context: QueryInterface}) {
	await queryInterface.createTable('notepads', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
	})
	await queryInterface.bulkInsert('notepads', [
		{
			id: 1,
			name: 'Main',
			createdAt: new Date(),
			updatedAt: new Date(),
		}
	])
	await queryInterface.createTable('pages', {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
		notepadId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1,
			references: {
				model: 'notepads',
				key: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'NO ACTION'
		},
	})
	await queryInterface.bulkInsert('pages', [
		{
			id: 1,
			name: 'General',
			createdAt: new Date(),
			updatedAt: new Date(),
			notepadId: 1,
		}
	])
	await queryInterface.addColumn(
		'notes',
		'pageId',
		{
			type: DataTypes.INTEGER,
			defaultValue: 1,
			allowNull: true,
			references: {
				model: 'pages',
				key: 'id'
			},
			onDelete: 'CASCADE',
			onUpdate: 'NO ACTION'
		}
	)
}

export async function down({ context: queryInterface }: { context: QueryInterface}) {
  await queryInterface.dropTable('notepads')
  await queryInterface.dropTable('pages')
	await queryInterface.removeColumn('notes', 'pageId')
}
