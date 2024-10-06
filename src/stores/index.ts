import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persistedstate'

// 创建pinia实例
const pinia = createPinia()
// 持久化存储插件
pinia.use(persist)

// 默认导出
export default pinia

// 导出模块
export * from './modules/member'
