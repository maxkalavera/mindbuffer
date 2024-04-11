import { BaseModel } from "@ts/models/BaseModel.types"

export interface BasePayloadFilter {}

export type QueryHandler<PayloadFilter extends BasePayloadFilter, Model extends BaseModel> = (
  event: Electron.IpcMainInvokeEvent,
  payload: PayloadFilter,
) => Promise<{
  values: Model[]
}>

export type CreateHandler<ModelPayload, Model extends BaseModel> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    data: ModelPayload[]
  },
) => Promise<{
  values: Model[]
}>

export type UpdateHandler<Model extends BaseModel> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>

export type DestroyHandler<Model extends BaseModel> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>