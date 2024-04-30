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
    
    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
  }
}

export async function down({ context: queryInterface }: { context: QueryInterface}) {

}
