import PropTypes from 'prop-types'
import { Loading } from '@geist-ui/core'
import React, { useCallback, useMemo } from 'react'
import useGraphQL from '../../hooks/graphql.js'
import { useActiveWorkspace } from '../../hooks/workspace.js'
import { getCorpus } from './Corpus.graphql'
import CorpusSelectItem from './CorpusSelectItem.jsx'

export default function CorpusSelectItems({ articleId }) {
  const activeWorkspace = useActiveWorkspace()
  const activeWorkspaceId = useMemo(
    () => activeWorkspace?._id,
    [activeWorkspace]
  )
  const variables = useMemo(
    () => ({
      includeArticles: true,
      ...(activeWorkspaceId && { filter: { workspaceId: activeWorkspaceId } }),
    }),
    [activeWorkspaceId]
  )

  const { data, isLoading, mutate } = useGraphQL(
    { query: getCorpus, variables },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  const handleCorpusUpdate = useCallback(() => {
    mutate()
  }, [mutate])

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      {data &&
        data.corpus
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((c) => (
            <CorpusSelectItem
              key={c._id}
              id={c._id}
              name={c.name}
              articleId={articleId}
              selected={c.articles
                .map((a) => a?.article?._id)
                .includes(articleId)}
              onChange={handleCorpusUpdate}
            />
          ))}
    </>
  )
}

CorpusSelectItems.propTypes = {
  articleId: PropTypes.string,
}
