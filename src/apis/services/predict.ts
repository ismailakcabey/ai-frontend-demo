import { APIS } from "..";
import { useCreate } from "../request";

export const usePredictCreate = () => {
  return useCreate<any, any>(APIS.PREDICT.PREDICT);
};

export const usePredictFind = () => {
  return useCreate<any, any>(APIS.PREDICT.FIND);
};
