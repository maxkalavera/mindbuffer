import { app, ipcMain } from 'electron'
import { QueryTypes } from 'sequelize'

import toSerializable from '@utils/database/toSerializable'
import { ThrowError } from '@utils/errors'
import { groupByWidthAssociations } from '@utils/database/groupBy'
import getSelectFields from '@utils/database/getSelectFields'
import database from "@utils/database"

import type { 
  QueryHandler,
  ModelQueryHandler,
  ModelCreateHandler,
  ModelUpdateHandler,
  ModelDestroyHandler,
} from '@ts/handlers.types'
import type { 
  PagePayload, 
  Page, 
  PageID,
  PageFiltersPayload 
} from '@ts/models/Pages.types'
import { Notepad } from '@ts/models/Notepads.types'

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:getAll',
    async function getAll (_, payload) {
      const options = Object.assign({
        search: '',
        paginationOffset: 50,
      }, payload)    
      options.notepads.map((item) => item.page < 1 ?
        {
          ...item,
          page: 1
        } :
        item
      )
      if (options.notepads.length === 0)
        return

      try {
        const data = await database.sequelize.query(`
          ${
            options.notepads.map((notepad) => 
              `
              SELECT *
              FROM (
                SELECT
                  ROW_NUMBER () OVER (
                    ORDER BY "pages"."createdAt"
                  ) as rowNumber,
                  ${getSelectFields(database.models.Page, {
                    as: ({ tableName, fieldName }) => fieldName === 'notepadId' ?
                      `${fieldName}` :
                      `${tableName}.${fieldName}`
                  })}
                FROM "pages" 
                WHERE "pages"."notepadId"=${notepad.id}
              )
              WHERE
                rowNumber > ${options.paginationOffset * (notepad.page - 1)} AND
                rowNumber <= ${options.paginationOffset * (notepad.page)}
              `
            ).join(' UNION ')
          }
        `, {
          type: QueryTypes.SELECT,
          replacements: [],
          raw: true,
          nest: true,
        })

        return toSerializable({
          values: groupByWidthAssociations(data, 'notepadId', ['pages'])
        })
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
        return {
          values: []
        }
      }
    } as ModelQueryHandler<PageFiltersPayload, Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:get',
    async function get (_, payload) {
      const data = await database.models.Page.findOne({
        where: {
          id: payload.pageID
        },
        include: [
          { model: database.models.Notepad, as: 'notepad'}
        ],
      })
      return toSerializable({
        value: data ? 
          {
            ...data.dataValues,
            notepad: {
              ...data.dataValues.notepad.dataValues
            }
          } as Page & { notepad: Notepad }
          : undefined
      })
    }  as QueryHandler<{ pageID: PageID}, { value: Page & { notepad: Notepad } }>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:create',
    async function create (_, payload) {
      try {
        const data = await database.models.Page.bulkCreate(payload.data as any)
        return toSerializable({
          values: data.map((item) => ({
            ...item.dataValues,
            notes: []
          }))
        })
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelCreateHandler<PagePayload, Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:update',
    async function update (_, payload) {
      try {
        const data = await database.models.Page.update(
          payload.value as Page,
          { where: { id: payload.value.id } }
        )
        if (data[0] === 1) {
          return toSerializable({ value: payload.value })
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelUpdateHandler<Page>
  )
})

app.on('ready', () => {
  ipcMain.handle(
    'database.pages:destroy',
    async function destroy (_, payload) {
      try {
        const data =  await database.models.Page.destroy({ 
          where: { id: payload.value.id } 
        })
        if (data === 1) {
          return toSerializable({ value: payload.value })
        }
      } catch (error) {
        ThrowError({ 
          content: 'Error retrieving data from database',
          error: error,
        })
      }
    } as ModelDestroyHandler<Page>
  )
})
