import type { ModelCtor } from "sequelize";


export default function getSelectFields (
  model: ModelCtor<any>, 
  {
    as=({ fieldName }) => fieldName
  }: {
    as?: ({
      tableName, 
      fieldName
    }: {
      tableName: string, 
      fieldName: string
    }) => string
  } = {}
) {
  const tableName = typeof model.getTableName() === 'string' ? 
    model.getTableName() : 
    (model.getTableName() as any).tableName
  return Object.values(model.getAttributes())
  .map((item: any) => `"${tableName}"."${item.fieldName}" as "${as({tableName, fieldName: item.fieldName})}"`)
  .join(',\n')
}