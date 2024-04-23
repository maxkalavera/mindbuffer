import Sequelize, { DataTypes } from "sequelize"

import type { QueryInterface } from "sequelize"

export async function up(
  { 
    context: queryInterface 
  }: 
  { 
    context: QueryInterface
  }
) {
  const transaction = await queryInterface.sequelize.transaction();
  try {
    for (let notepadID = 1; notepadID <= 100; notepadID++) {
      await queryInterface.bulkInsert('notepads', [{
        name: `${notepadID}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      }])
      for (let pageID = 1; pageID <= 100; pageID++) {
        await queryInterface.bulkInsert('pages', [{
          name: `${pageID}`,
          createdAt: new Date(),
          updatedAt: new Date(),
          notepadId: notepadID
        }])
        await queryInterface.bulkInsert(
          'notes', 
          new Array(100)
            .fill(undefined)
            .map((item: any, index: number) => ({
              content: `Notepad: ${notepadID}, Page: ${pageID}, Content: ${index + 1}`,
              createdAt: new Date(),
              updatedAt: new Date(),
              pageId: pageID
        })))
      }
    }
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
  }
}

export async function down({ context: queryInterface }: { context: QueryInterface}) {

}
