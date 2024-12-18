/**
 * Convert legacy values.
 * @param {object} data
 * @returns {*}
 */
export function convertLegacyValues(data) {
  if (!data) {
    return data
  }

  // we convert YYYY/MM/DD dates into ISO YYYY-MM-DD
  if (data.date) {
    data.date = data.date.replace(/\//g, '-')
  }

  // we array-ify legacy string keywords
  if (data.keywords) {
    data.keywords = data.keywords.map(block => {
      if (block && typeof block === 'object' && 'list_f' in block && typeof block.list_f === 'string') {
        block.list_f = block.list_f.split(',').map(word => word.trim())
      }
      return block
    })
  }

  return data
}
