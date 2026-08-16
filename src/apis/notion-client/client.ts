import { NotionAPI } from "notion-client"

const defaultGotOptions = {
  headers: {
    // Notion/Cloudflare rejects got's default User-Agent with 403.
    "user-agent":
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
}

function unwrapRecordMap(recordMap?: any) {
  if (!recordMap) return recordMap

  for (const table of Object.keys(recordMap)) {
    const map = recordMap[table]
    if (!map || typeof map !== "object") continue

    for (const key of Object.keys(map)) {
      const entry = map[key]
      const nested = entry?.value?.value
      if (nested && typeof nested === "object" && nested.id) {
        map[key] = {
          role: entry.value.role ?? entry.role,
          value: nested,
        }
      }
    }
  }

  return recordMap
}

function withDefaultGotOptions(gotOptions?: any): any {
  return {
    ...defaultGotOptions,
    ...gotOptions,
    headers: {
      ...defaultGotOptions.headers,
      ...gotOptions?.headers,
    },
  }
}

class CompatibleNotionAPI extends NotionAPI {
  async fetch<T>({
    endpoint,
    body,
    gotOptions,
    headers,
  }: {
    endpoint: string
    body: object
    gotOptions?: any
    headers?: any
  }): Promise<T> {
    return super.fetch<T>({
      endpoint,
      body,
      gotOptions: withDefaultGotOptions(gotOptions),
      headers: {
        ...defaultGotOptions.headers,
        ...headers,
      },
    })
  }

  async getPageRaw(pageId: string, options: any = {}) {
    const response = await super.getPageRaw(pageId, {
      ...options,
      gotOptions: withDefaultGotOptions(options.gotOptions),
    })
    unwrapRecordMap(response?.recordMap)
    return response
  }

  async getBlocks(blockIds: string[], gotOptions?: any) {
    const response = await super.getBlocks(
      blockIds,
      withDefaultGotOptions(gotOptions)
    )
    unwrapRecordMap(response?.recordMap)
    return response
  }

  async getCollectionData(
    collectionId: string,
    collectionViewId: string,
    collectionView: any,
    options: any = {}
  ) {
    const response = await super.getCollectionData(
      collectionId,
      collectionViewId,
      collectionView,
      {
        ...options,
        gotOptions: withDefaultGotOptions(options.gotOptions),
      }
    )
    unwrapRecordMap(response?.recordMap)
    return response
  }
}

export const notionApi = new CompatibleNotionAPI()
