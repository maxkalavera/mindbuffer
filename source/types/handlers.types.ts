
import type Electron from 'electron'
import { BaseID, BaseModel } from "@commons/ts/models/BaseModel.types"

export interface BasePayloadFilter {}

export type QueryHandler<
  PayloadFilter extends BasePayloadFilter, 
  Result
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: PayloadFilter,
) => Promise<Result>

export type ModelQueryHandler<
  PayloadFilter extends BasePayloadFilter, 
  Model extends BaseModel
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: PayloadFilter,
) => Promise<{
  values: Model[]
}>

export type ModelCreateHandler<
  ModelPayload, 
  Model extends BaseModel
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    data: ModelPayload[]
  },
) => Promise<{
  values: Model[]
}>

export type ModelUpdateHandler<
  Model extends BaseModel
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>

export type ModelDestroyHandler<
  Model extends BaseModel | BaseID
> = (
  event: Electron.IpcMainInvokeEvent,
  payload: {
    value: Model
  },
) => Promise<{
  value: Model
}>