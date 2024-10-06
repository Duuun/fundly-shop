/**
 * 添加拦截器
 *  拦截request请求
 *  拦截upload文件上传
 *
 * TODO
 *  1. 非http开头要拼接
 *  2. 请求超时
 *  3. 添加小程序请求标识
 *  4. 添加token请求标识
 */

import { useMemberStore } from '@/stores'

const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net'

const httpAddInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    // request 触发前拼接 url

    // *  1. 非http开头要拼接
    if (!options.url.startsWith('http')) {
      options.url = baseURL + options.url
    }
    // *  2. 请求超时
    options.timeout = 10000
    // *  3. 添加小程序请求标识

    options.header = {
      ...options.header,
      'source-client': 'miniapp',
    }
    // *  4. 添加token请求标识
    const memberStore = useMemberStore()
    const token = memberStore.profile?.token
    console.log('memberStore.profile.token', token)

    if (token) {
      options.header.Authorization = token
    }

    console.log(options)
  },
}

uni.addInterceptor('request', httpAddInterceptor)

uni.addInterceptor('uploadFile', httpAddInterceptor)

interface Data<T> {
  code: string
  msg: string
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise<Data<T>>((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        // 对uni.request 有响应都会成功，包括token失败所以要添加状态码
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({ url: '/pages/login/login' })
          reject(res)
        } else {
          uni.showToast({ title: (res.data as Data<T>).msg || '请求错误', icon: 'none' })
          reject(res)
        }
      },

      fail(err) {
        // 网络失败等没有响应的错误
        uni.showToast({ title: '网络错误，换个网络试试', icon: 'none' })

        reject(err)
      },
    })
  })
}
