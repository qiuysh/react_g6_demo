import axios from "axios";
import { message } from "antd";

export default function request(
  options,
) {
  // 使用由库提供的配置的默认值来创建实例
  return axios({
    url: '',
    method: "get", // 默认值
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    withCredentials: true,
    timeout: 5000,
    ...options,
  })
    .then((res) => {
      const { status } = res;
      const successed = checkRspStatus(status);

      if (successed) {
        return Promise.resolve({
          ...res.data,
        });
      }

      // 错误提示
      tipError(res);

      const error = {
        name: "http error",
        message: "http response status error",
        config: options,
        code: `${status}`,
      };
      return Promise.reject(error);
    })
    .catch(error => {
      const { response } = error;

      // 错误提示
      tipError(
        response || {
          ...error,
          status: 600,
        },
      );

      let msg;
      let statusCode;

      if (response && response instanceof Object) {
        const { statusText } = response;
        statusCode = response.status;
        msg = response.data.message || statusText;
      }

      return Promise.resolve({
        ...response,
        success: false,
        status: statusCode,
        message: msg,
      });
    });
}

function checkRspStatus(status) {
  if (status >= 200 && status < 300) {
    return true;
  }
  return false;
}

function tipError(res) {
  const status = res.status;

  switch (status) {
    case 400:
      message.error("请求错误，请刷新重试");
      break;

    default:
      if (status >= 500) {
        message.error("网络错误，请刷新重试");
      }
      // 注意：其他错误的错误提示需要在业务内自行处理
      break;
  }
  console.error(
    "http返回结果的 status 码错误，错误信息是:",
    res,
  );
}
