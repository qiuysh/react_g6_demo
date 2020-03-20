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
    // withCredentials: true,
    // timeout: 5000,
    ...options,
  })
    .then((res) => {
      const { status } = res;
      const successed = checkRspStatus(status);

      if (successed) {
        return {
          ...res.data,
        };
      }
      // 错误提示
      tipError(res);
      
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
    case 500:
        message.error("系统异常");
      break;
    default:
      if (status >= 600) {
        message.error("网络错误，请刷新重试");
      }
      break;
  }
  console.error(
    "http返回结果的 status 码错误，错误信息是:",
    res,
  );
}
