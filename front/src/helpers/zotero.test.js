import { describe, test, expect } from 'vitest'
import { fetchBibliographyFromCollectionHref } from './zotero'

describe('fetchBibliographyFromCollection', () => {
  test('fetches a paginated collection of more than 25 elements', () => {
    const zoteroId = '2478772/collections/UGF4W4PZ'

    return fetchBibliographyFromCollectionHref({
      collectionHref: `https://api.zotero.org/groups/${zoteroId}`,
    }).then((bib) => {
      expect(bib[0]).toMatch('@misc{grossetie_hello_nodate')
      expect(bib[0]).not.toMatch('@book{grossetie_hello_nodate')
      expect(bib[1]).toMatch('@book{noauthor_test10_nodate')
    })
  })
})
