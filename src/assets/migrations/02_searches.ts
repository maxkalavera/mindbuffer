import Sequelize, { DataTypes } from "sequelize"

import type { QueryInterface } from "sequelize"

export async function up({ context: queryInterface }: { context: QueryInterface}) {
	await queryInterface.sequelize.query(`
		CREATE VIRTUAL TABLE searches USING fts5(noteID, noteContent);
	`)
	await queryInterface.sequelize.query(`
		CREATE TRIGGER notes_insert AFTER INSERT ON notes BEGIN
			INSERT INTO searches(noteID, noteContent) VALUES (new.id, new.content);
		END;
	`)
	await queryInterface.sequelize.query(`
		CREATE TRIGGER notes_delete AFTER DELETE ON notes BEGIN
			DELETE FROM searches WHERE noteID = old.id;
		END;
	`)
	await queryInterface.sequelize.query(`
		CREATE TRIGGER notes_update AFTER UPDATE ON notes BEGIN
			DELETE FROM searches WHERE noteID = old.id;
			INSERT INTO searches(noteID, noteContent) VALUES (new.id, new.content);
		END;
	`)
}

export async function down({ context: queryInterface }: { context: QueryInterface}) {
	await queryInterface.sequelize.query(`DROP TRIGGER notes_insert;`)
	await queryInterface.sequelize.query(`DROP TRIGGER notes_delete;`)
	await queryInterface.sequelize.query(`DROP TRIGGER notes_update;`)
	await queryInterface.sequelize.query(`DROP TABLE searches;`)
}
