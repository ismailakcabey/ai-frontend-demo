import { TablePaginationConfig, notification } from "antd";
import Axios from "axios";
import { useMutation, useQuery } from "react-query";
import { API_URL } from "../utils/app.config";

interface listParams {
  limit?: number;
  offset?: number;
  where?: any;
  order?: string;
  include?: { relation: string }[];
}

export const axios = Axios.create({
  baseURL: `${API_URL}`,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

axios.interceptors.request.use((config) => {
  let token = localStorage.getItem("AUTH");
  const jsonToken = JSON.parse(token || "");
  token = jsonToken?.state?.accessToken;

  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// response interceptor
axios.interceptors.response.use(
  (response) => {
    const data = response?.data;

    if (response.status === 200) {
      return data;
    }

    notification.error({
      message: `${response?.statusText}: ${response}`,
      description: data || response?.statusText || "Error",
    });

    if (response.status === 401) {
      window.location.href = "/";
    }

    return Promise.reject(new Error(response?.statusText || "Error"));
  },
  async (error) => {
    const message =
      error?.response?.data?.message || error?.message || "Error!";
    notification.error({
      message: error?.response?.data?.error?.name,
      description: message,
    });

    if (error?.response && error?.response?.status) {
      if ([401, 403].includes(error?.response?.status)) {
        return;
      }
    }

    // throw new Error(error);
    return await Promise.reject(error);
  }
);

const transformPagination = (pagination: TablePaginationConfig) => {
  const {
    current = pagination?.defaultCurrent || 1,
    pageSize = pagination?.defaultPageSize || 10,
  } = pagination || {};
  const skip = (current - 1) * pageSize;

  const params: {
    limit?: number;
    offset?: number;
    skip?: number;
  } = {
    skip,
    offset: 0,
  };

  if (pagination) {
    params["limit"] = pagination?.pageSize;
  }

  return params;
};

const transformFilters = (filters: any, typeWithFilters: string[]) => {
  if (!filters) return;
  const result: { [key: string]: any } = {};
  for (const key in filters) {
    const value = filters[key];
    if (!value || value === null) continue;

    if (typeWithFilters && typeWithFilters.includes(key)) {
      result[key] = typeWithFilters.reduce(
        (acc: Record<string, { inq: string[] }>, item: string) => {
          acc[item] = { inq: value };
          return acc;
        },
        {}
      );
    } else {
      result[key] = { like: value[0], options: "i" };
    }
  }

  return result;
};

const transformSorter = (sorter: any) => {
  const { field, order } = sorter || {};
  if (!field || !order) return "createdAt DESC";
  return `${field} ${order === "ascend" ? "ASC" : "DESC"}`;
};

const transformInclude = (includes: string[]) => {
  if (!includes) return;
  return includes.map((item) => ({ relation: item }));
};

const useGetList = <T>(key: string, url: string, tableParams?: any) => {
  const service = async () => {
    let params: listParams = {};
    params = { ...transformPagination(tableParams?.pagination!) };
    params.where = transformFilters(
      tableParams?.filters,
      tableParams?.typeWithFilters!
    );
    params.order = transformSorter(tableParams?.sorter);
    params.include = transformInclude(tableParams?.include!);

    const data: T = await axios.get(url, {
      params: { filter: JSON.stringify(params) },
    });

    return data;
  };
  return useQuery(key, async () => await service());
};

const useGet = <T>(key: string, url: string, noneQuery?: boolean) => {
  let params: listParams = {};
  params = {
    ...transformPagination({
      current: 1,
      pageSize: 100,
    }),
  };
  if (noneQuery) {
    const service = async () => {
      const data: T = await axios.get(url);
      return data;
    };
    return useQuery(key, service);
  } else {
    const service = async () => {
      const data: T = await axios.get(url, {
        params: { filter: JSON.stringify(params) },
      });
      return data;
    };
    return useQuery(key, service);
  }
};

const useGetOne = <T>(key: string, url: string, params?: any) => {
  const service = async () => {
    const data: T = await axios.get(`${url}`, params);
    return data;
  };
  return useQuery(key, service);
};

const useGetOneId = <T>(key: string, url: string, id?: string) => {
  const service = async () => {
    const data: T = await axios.get(`${url}/${id}`);
    return data;
  };
  return useQuery(key, service);
};

const useCreate = <T, U>(url: string) => {
  return useMutation(async (params: T) => {
    const data: U = await axios.post(`${url}`, params);
    return data;
  });
};

const useMuteGet = <U>(url: string) => {
  return useMutation(async () => {
    const data: U = await axios.get(`${url}`);
    return data;
  });
};

const useUpdate = <T>(url: string) => {
  return useMutation(async (item: T) => {
    const data: T = await axios.patch(`${url}`, item);
    return data;
  });
};

const usePut = <T>(url: string) => {
  return useMutation(async (item: T) => {
    const data: T = await axios.put(`${url}`, item);
    return data;
  });
};

const usePutWorkingDays = <T>(url: string) => {
  return useMutation(async (item: any) => {
    const providerType = item.providerType;
    const branchId = item.branchId;
    delete item.branchId;
    delete item.providerType;
    const data: T = await axios.put(`${url}/${branchId}/${providerType}`, item);
    return data;
  });
};

const useDelete = <T>(url: string) => {
  return useMutation(async (id: string) => {
    const data: T = await axios.delete(`${url}/${id}`);
    return data;
  });
};

const usePatch = <T>(url: string) => {
  return useMutation(async (param: T) => {
    const data: T = await axios.patch(`${url}`, param);
    return data;
  });
};

export {
  useGetOne,
  useGetOneId,
  useGet,
  useGetList,
  useUpdate,
  usePut,
  useCreate,
  useDelete,
  usePatch,
  usePutWorkingDays,
  useMuteGet,
};

export default axios;
