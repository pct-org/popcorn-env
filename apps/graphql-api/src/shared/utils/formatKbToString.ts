const sizes = ['Bytes/s', 'KB/s', 'MB/s']

/**
 * Formats bytes to a nice string
 *
 * @param bytes
 */
export default (bytes: number): string => {
  if (!bytes || bytes === 0) {
    return '0 Byte'
  }

  const i = parseInt(
    `${Math.floor(
      Math.log(bytes) / Math.log(1024)
    )}`,
    10
  )

  return `${(bytes / (1024 ** i)).toFixed(2)} ${sizes[i]}`
}
