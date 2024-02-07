import { APIS } from "..";
import { useGet } from "../request";

/**
 * use delete user
 * @returns
 */
export const useMeGet = () => {
  return useGet<any>("userGetMe", APIS.ME.ME, true);
};
