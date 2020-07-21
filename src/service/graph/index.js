import { AppPost } from '@/utils/request'
import appConfig from '@/config'

const centerWord = appConfig.centerWordMap

// 根据关键词搜索图谱信息
export function QueryGraphDetailByKeyword(id) {
  const jsonUrl = `/mock-data/${centerWord[id]}.json`
  return AppPost(jsonUrl, {
    id
  })
}

// 小知识图谱
export function QueryGraphInfoByKeyword(id) {
  return AppPost('/mock-data/graph.json', {
    id
  })
}
