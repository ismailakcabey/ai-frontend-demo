import { APIS } from "..";
import { useCreate, useDelete, usePatch } from "../request";

export const useConverstationCreate = () => {
  return useCreate<any, any>(APIS.CONVERSTATION.CONVERSTATION);
};

export const useConverstationFind = () => {
  return useCreate<any, any>(APIS.CONVERSTATION.FIND);
};

export const useUpdateConverstations = <T>(id: string) => {
  return usePatch<T>(APIS.CONVERSTATION.CONVERSTATION + "/" + id);
};

export const useDeleteConverstations = () => {
  return useDelete<any>(APIS.CONVERSTATION.CONVERSTATION);
};
