import { notionApi } from "./client"

export const getRecordMap = async (pageId: string) => {
  const recordMap = await notionApi.getPage(pageId)
  return recordMap
}
