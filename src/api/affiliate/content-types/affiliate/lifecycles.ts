import { errors } from '@strapi/utils'

const IMMUTABLE_FIELDS = new Set(['code', 'walletAddress'])
const CODE_REGEX = /^[A-Z0-9-]{3,32}$/

const normalizeLower = (value: string | null | undefined) => {
  if (!value) return value
  return value.trim().toLowerCase()
}

const normalizeCode = (value: string | null | undefined) => {
  if (!value) return value
  return value.trim().toUpperCase()
}

export default {
  beforeCreate(event) {
    const data = event.params.data || {}

    if (data.code) {
      const normalized = normalizeCode(String(data.code))
      if (!normalized || !CODE_REGEX.test(normalized)) {
        throw new errors.ValidationError(
          'affiliate code must be 3-32 chars of letters, numbers, or dashes'
        )
      }
      data.code = normalized
    }

    if (data.walletAddress) {
      data.walletAddress = normalizeLower(String(data.walletAddress))
    }
  },
  beforeUpdate(event) {
    const data = event.params.data || {}

    for (const field of IMMUTABLE_FIELDS) {
      if (Object.prototype.hasOwnProperty.call(data, field)) {
        throw new errors.ValidationError('affiliate code and walletAddress are immutable')
      }
    }
  }
}
