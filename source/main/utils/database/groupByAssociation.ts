

export default function groupByAssociation(
  data: {[key: string]: any}[],
  associations: string[],
  {
    primaryKey='id',
  }:{
    primaryKey?: string,
  }={}
): {[key: string]: any}[] {
  
  const map = new Map<string, any>()

  for(let dataIndex = 0; dataIndex < data.length; dataIndex++) {
    const item = data[dataIndex]

    var destination = undefined
    if (!map.has(item[primaryKey])) {
      destination = Object.assign({}, item)
      for (let i = 0; i < associations.length; i++) {
        destination[associations[i]] = []
      }

      for (let i = 0; i < associations.length; i++) {
        if (Object.values(item[associations[i]]).some((item) => item !== null))
          destination[associations[i]].push(item[associations[i]])
      }
    } else {
      destination = map.get(item[primaryKey])
      for (let i = 0; i < associations.length; i++) {
        destination[associations[i]].push(item[associations[i]])
      }
    }

    map.set(item[primaryKey], destination)
  }

  return Array.from(map.values() as any)
}