import { Chain } from "connectors"
import fetcher from "utils/fetcher"

const OPENSEA_API_OPTIONS = {
  headers: {
    "X-API-KEY": process.env.OPENSEA_API_KEY,
  },
}

export const openseaChains: Partial<Record<Chain, string>> = {
  POLYGON: "matic",
}

export type OpenseaAssetData = {
  image?: string
  name?: string
  slug?: string
}

export default async function handler(req, res) {
  const { chain, address, tokenId } = req.query
  if (!address) return res.status(404).json(null)

  let data: OpenseaAssetData

  if (!openseaChains[chain]) return res.json(data)

  await fetcher(
    `https://api.opensea.io/api/v2/metadata/${openseaChains[chain]}/${address}/${tokenId}`,
    OPENSEA_API_OPTIONS
  )
    .then((metadata) => {
      if (!metadata.name) return
      data = {
        image: metadata.image,
        name: metadata.name,
      }
    })
    .catch((_) => {})

  res.json(data)
}