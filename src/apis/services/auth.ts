import { APIS } from "..";
import { useCreate } from "../request";

export const useLogin = () => {
  return useCreate<any, any>(APIS.AUTH.LOGIN);
};
