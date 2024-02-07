import { APIS } from "..";
import { useCreate, useDelete, useGetOneId, usePatch } from "../request";

export const useWordsCreate = () => {
  return useCreate<any, any>(APIS.WORDS.WORDS);
};

export const useWordsFind = () => {
  return useCreate<any, any>(APIS.WORDS.FIND);
};

export const useUpdateWords = <T>(id: string) => {
  return usePatch<T>(APIS.WORDS.WORDS + "/" + id);
};

export const useWordsFindById = (id: string) => {
  console.log(id, "burada");
  return useGetOneId("GETWORD", APIS.WORDS.WORDS, id);
};
