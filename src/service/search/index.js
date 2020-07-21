import { AppPost } from '@/utils/request'
import appConfig from '@/config'

const centerWord = appConfig.centerWordMap
// console.log(appConfig)
// 根据关键字获取介绍
export function QueryDataByKeyword(keyword) {
  const jsonUrl = `/mock-data/${centerWord[keyword]}.json`
  // console.log(jsonUrl)
  return AppPost(jsonUrl, {
    keyword
  })
}

// 根据关键词获取论文信息
export function QueryPaperByKeyword(keyword, type) {
  return AppPost('/mock-data/paper-list.json', {
    keyword,
    type
  })
}
