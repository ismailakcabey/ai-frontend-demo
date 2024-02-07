const API_PREFIX = "";
export const APIS = {
  ME: {
    ME: API_PREFIX + "/user/me",
  },
  AUTH: {
    LOGIN: API_PREFIX + "/auth/login",
  },
  CONVERSTATION: {
    CONVERSTATION: API_PREFIX + "/converstation",
    FIND: API_PREFIX + "/converstation/find",
  },
  WORDS: {
    WORDS: API_PREFIX + "/word",
    FIND: API_PREFIX + "/word/find",
  },
  PREDICT: {
    PREDICT: API_PREFIX + "/predict",
    FIND: API_PREFIX + "/predict/find",
  },
  REPORT: {
    REPORT: API_PREFIX + "/report",
  },
};
