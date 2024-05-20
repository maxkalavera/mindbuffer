exports.up = function (knex) {
  return knex.schema
    .createTable('notepads', function (table) {
      table.increments('id')
      table.timestamps(true, true)
      table.string('name', 255).notNullable()
    })
    .createTable('pages', function (table) {
      table.increments('id')
      table.timestamps(true, true)
      table.string('name', 255).notNullable()
      table.integer('notepadID').unsigned()
      table.foreign('notepadID')
        .references('notepads.id')
        .deferrable()
    })
    .createTable('notes', function (table) {
      table.increments('id')
      table.timestamps(true, true)
      table.text('content').notNullable()
      table.integer('pageID').unsigned()
      table.foreign('pageID')
        .references('pages.id')
        .deferrable()
    })
    .raw(`CREATE VIRTUAL TABLE searches USING fts5(noteID, noteContent);`)
    .raw(`
      CREATE TRIGGER notes_insert AFTER INSERT ON notes BEGIN
        INSERT INTO searches(noteID, noteContent) VALUES (new.id, new.content);
      END;
    `)
    .raw(`
      CREATE TRIGGER notes_delete AFTER DELETE ON notes BEGIN
        DELETE FROM searches WHERE noteID = old.id;
      END;
    `)
    .raw(`
      CREATE TRIGGER notes_update AFTER UPDATE ON notes BEGIN
        DELETE FROM searches WHERE noteID = old.id;
        INSERT INTO searches(noteID, noteContent) VALUES (new.id, new.content);
      END;
    `)
}

exports.down = function (knex) {
  return knex.schema
    .dropTable('notes')
    .dropTable('notepads')
    .dropTable('pages')
    .raw(`DROP TRIGGER notes_insert;`)
    .raw(`DROP TRIGGER notes_delete;`)
    .raw(`DROP TRIGGER notes_update;`)
    .raw(`DROP TABLE searches;`)
}