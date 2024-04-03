import _ from 'lodash'

export function groupByWidthAssociations (
  data: {[key: string | number]: any}[],
  by: any,
  associations: string[]
): {[key: string | number]: any}[] {
  const clone = _.cloneDeep(data)
  const map = new Map<typeof by, any>()
  for (let itemIndex = 0; itemIndex < clone.length; itemIndex++) {
    const item = clone[itemIndex]
    if (map.has(item[by])) {
      for (
        let associationIndex = 0; 
        associationIndex < associations.length; 
        associationIndex++
      ) {
        map.get(item[by])[associations[associationIndex]].push(
          item[associations[associationIndex]]
        )
      }
    } else {
      for (
        let associationIndex = 0; 
        associationIndex < associations.length; 
        associationIndex++
      ) {
        item[associations[associationIndex]] = [item[associations[associationIndex]]]
      }
      map.set(item[by], item)
    }
  }

  return Array.from(map.values())
}