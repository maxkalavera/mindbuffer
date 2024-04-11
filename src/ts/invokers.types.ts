import { BaseModel } from "@ts/models/BaseModel.types"

export interface BasePayloadFilter {}

export type QueryInvoker<PayloadFilter extends BasePayloadFilter, Model extends BaseModel> = (
  payload: PayloadFilter,
) => Promise<{
  values: Model[]
}>

export type CreateInvoker<ModelPayload, Model extends BaseModel> = (
  payload: {
    data: ModelPayload[]
  },
) => Promise<{
  values: Model[]
}>

export type UpdateInvoker<Model extends BaseModel> = (
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>

export type DestroyInvoker<Model extends BaseModel> = (
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>