import {
  BaseRecord,
  DeleteOneParams,
  GetListParams,
  GetOneParams,
  UpdateParams
} from "@refinedev/core";
import dataProvider from "@refinedev/simple-rest";
import { appConfig } from "../config";
import { axiosInstance } from "../axios";
import * as utils from "../utils";

const defaultDataProvider = dataProvider(appConfig.userService.endpoint, axiosInstance);

export const usersDataProvider = {
  ...defaultDataProvider,
  getList: async <TData extends BaseRecord = BaseRecord>({ resource }: GetListParams) => {
    const apiUrl = defaultDataProvider.getApiUrl();
    const customResponse = await defaultDataProvider.custom({
      url: `${apiUrl}/${resource}/all`,
      method: "get",
    })
    const data = customResponse.data[resource] as TData;
    return { data, total: data.length };
  },
  update: async<TData extends BaseRecord = BaseRecord, TVariables = object>({ resource, variables }: UpdateParams<TVariables>) => {
    const apiUrl = defaultDataProvider.getApiUrl();
    (variables as Record<string, string>).id = (variables as Record<string, string>)._id;
    delete (variables as Record<string, string>)._id;
    const customResponse = await defaultDataProvider.custom({
      url: `${apiUrl}/${resource}`,
      method: "patch",
      payload: variables,
    })
    const data = customResponse.data[resource] as TData;

    return {
      data,
    };
  },
  getOne: async <TData extends BaseRecord = BaseRecord>({ resource, id }: GetOneParams) => {
    const apiUrl = defaultDataProvider.getApiUrl();
    const customResponse = await defaultDataProvider.custom({
      url: `${apiUrl}/${resource}`,
      method: "get",
      query: {
        email: utils.base64UrlDecode(id as string),
      }
    })
    const data = customResponse.data[`${resource.slice(0, -1)}Details`] as TData;
    return { data };
  },
  deleteOne: async<TData extends BaseRecord = BaseRecord, TVariables = object>({ resource, id }: DeleteOneParams<TVariables>) => {
    const apiUrl = defaultDataProvider.getApiUrl();
    const customResponse = await defaultDataProvider.custom({
      url: `${apiUrl}/${resource}`,
      method: "delete",
      payload: {
        email: utils.base64UrlDecode(id as string),
      }
    });
    const data = customResponse.data as TData;

    return { data };
  },
};
