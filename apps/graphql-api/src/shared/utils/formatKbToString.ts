const sizes = ['Bytes', 'KB', 'MB', 'GB']

/**
 * Formats bytes to a nice string
 *
 * @param bytes
 * @param perSecond
 */
export default (bytes: number, perSecond = true): string => {
  const postFix = perSecond ? '/s' : ''
  if (!bytes || bytes === 0) {
    return `0 Byte${postFix}`
  }

  const i = parseInt(
    `${Math.floor(
      Math.log(bytes) / Math.log(1024)
    )}`,
    10
  )

  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}${postFix}`
}
