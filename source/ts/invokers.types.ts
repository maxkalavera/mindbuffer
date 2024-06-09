import { BaseModel, BaseID } from "@commons/ts/models/BaseModel.types"

export interface BasePayloadFilter {}

export type QueryInvoker<
  PayloadFilter extends BasePayloadFilter, 
  Result
> = (
  payload: PayloadFilter,
) => Promise<Result>

export type ModelQueryInvoker<
  PayloadFilter extends BasePayloadFilter, 
  Model extends BaseModel
> = (
  payload: PayloadFilter,
) => Promise<{
  values: Model[]
}>

export type ModelCreateInvoker<
  ModelPayload, 
  Model extends BaseModel
> = (
  payload: {
    data: ModelPayload[]
  },
) => Promise<{
  values: Model[]
}>

export type ModelUpdateInvoker<
  Model extends BaseModel
> = (
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>

export type ModelDestroyInvoker<
  Model extends BaseModel | BaseID
> = (
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>