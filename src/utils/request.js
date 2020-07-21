import instance from './axios'
import axios from 'axios'

const CancelToken = axios.CancelToken

let sources = []

export function AppPost(url, data) {
  return new Promise((resolve, reject) => {
    instance
      .get(url, data, {
        // 取消请求
        cancelToken: new CancelToken(function executor(c) {
          // An executor function receives a cancel function as a parameter
          sources.push(c)
        })
      })
      .then((res) => {
        // if (res.data.success) {
        resolve(res.data)
        // } else {
        //   reject(new Error(`${res.msg}`))
        // }
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export { sources }
