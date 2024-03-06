import Sequelize from "sequelize"

export async function up({ context: queryInterface }) {
	await queryInterface.createTable('notes', {
		id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		content: {
			type: Sequelize.STRING,
			allowNull: false
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: false
		},
		updatedAt: {
			type: Sequelize.DATE,
			allowNull: false
		}
	})
}

export async function down({ context: queryInterface }) {
	await queryInterface.dropTable('notes')
}

//module.exports = { up, down }