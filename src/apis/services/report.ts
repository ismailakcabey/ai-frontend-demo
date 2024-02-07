import { APIS } from "..";
import { useCreate } from "../request";

export const useReportGet = () => {
  return useCreate<any, any>(APIS.REPORT.REPORT);
};
