/* @ts-ignore */
const TYPES: {
  constructor: object, 
  transform: (value: any) => any
}[] = [
  {
    constructor: Date,
    transform: (value: Date) => {
      return JSON.stringify(value)
    }
  }
]

function recursiveMap(
  value: {[key: string]: any}, 
  callback: (value: any) => any,
) {
  if (typeof value === 'object' && value !== null) {
    Object.entries(value).forEach(([key, deepValue]) => {
      value[key] = recursiveMap(deepValue, callback)
    })
    return callback(value)
  } else {
    return callback(value)
  }
}

export default function toSerializable(object: {[key: string]: any}): {[key: string]: any} {
  const result = recursiveMap(object, (value) => {
    const type = TYPES.find((type: any) => value instanceof type.constructor)
    return type ?
      type.transform(value) :
      value
  })
  return result
}