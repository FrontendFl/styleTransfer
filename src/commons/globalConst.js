/* eslint-disable */
import { Loading } from 'element-ui'

export default {
  install() {
    window.awaitWrap = (promise) => {
      if (!(promise instanceof Promise)) return [null, promise]
      return promise.then((data) => [null, data]).catch((err) => [err, null])
    }

    window.awaitLoading = async (promise, option = '生成效果图中，请稍后...') => {
      typeof option === 'string' && (option = {  lock: true, text: option })
      option.customClass = (option.customClass || '') + 'zIndexMax'
      const loading = Loading.service(option)
      await awaitWrap(promise)
      loading.close()
      return promise
    }
  }
}