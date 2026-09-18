import { $axios } from "./axios.instance";

/**
 * @function getApiUrl: Set API request
 * @param {Object} data API request configuration
 */
function getApiUrl(data: { path: string }) {
  return `/${data?.path}`;
}

/**
 * @function getApiRequest: Set API request
 * @param {Object} data API request data
 */
function getApiRequest(data: object) {
  const req = Object.assign({}, data);
  return req;
}

/**
 * @function To call get API's
 * @param param0 get data
 * @returns api response on success or error on fail
 */
const getDataApi = ({ path = "no-path-provided", data = {}, headers = {} }) => {
  try {
    return new Promise((resolve, reject) => {
      $axios
        .get(getApiUrl({ path }), {
          params: getApiRequest(data),
          headers: headers,
        })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};

/**
 * @function To call post API's
 * @param param0 post data
 * @returns api response on success or error on fail
 */
const postDataApi = ({ path = "no-path-provided", data = {} }) => {
  try {
    return new Promise((resolve, reject) => {
      $axios
        .post(getApiUrl({ path }), getApiRequest(data))
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};

/**
 * @function To call put API's
 * @param param0 put data
 * @returns api response on success or error on fail
 */
const putDataApi = ({ path = "no-path-provided", data = {} }) => {
  try {
    return new Promise((resolve, reject) => {
      $axios
        .put(getApiUrl({ path }), getApiRequest(data))
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};

/**
 * @function To call put API's
 * @param param0 put data
 * @returns api response on success or error on fail
 */
const patchDataApi = ({
  path = "no-path-provided",
  params = {},
  data = {},
  headers = {},
}) => {
  try {
    return new Promise((resolve, reject) => {
      $axios
        .patch(getApiUrl({ path }), getApiRequest(data), { headers, params })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};

const postFormDataApi = ({
  path = "no-path-provided",
  data,
}: {
  path?: string;
  data: FormData;
}) => {
  try {
    return new Promise((resolve, reject) => {
      $axios
        .post(getApiUrl({ path }), data)
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};

const postDataWithHeadersApi = <T>({
  path = "no-path-provided",
  data = {},
  headers = {},
}) => {
  try {
    return new Promise<T>((resolve, reject) => {
      $axios
        .post(getApiUrl({ path }), getApiRequest(data), { headers })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};
/**
 * @function To call delete API's
 * @param param0 delete data
 * @returns api response on success or error on fail
 */
const deleteDataApi = ({ path = "no-path-provided", data = {} }) => {
  try {
    return new Promise((resolve, reject) => {
      $axios
        .delete(getApiUrl({ path }), getApiRequest(data))
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};

// delete data with body for that we can use this api
const deleteApi = ({ path = "no-path-provided", data = {} }) => {
  try {
    return new Promise((resolve, reject) => {
      $axios
        .delete(getApiUrl({ path }), { data: getApiRequest(data) })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  } catch (error) {
    return (error as Error).message;
  }
};

export {
  getDataApi,
  postDataApi,
  postFormDataApi,
  putDataApi,
  deleteDataApi,
  deleteApi,
  postDataWithHeadersApi,
  patchDataApi,
};
