import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import askGraphQL from '../helpers/graphQL'
import etv from '../helpers/eventTargetValue'

import Article from './Article'
import CreateArticle from './CreateArticle'

import styles from './Articles.module.scss'
import TagManagement from './TagManagement'
import Button from './Button'
import Field from './Field'
import { Search } from 'react-feather'

const mapStateToProps = ({ activeUser, sessionToken, applicationConfig }) => {
  return { activeUser, sessionToken, applicationConfig }
}

const ConnectedArticles = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState('')
  const [articles, setArticles] = useState([])
  const [tags, setTags] = useState([])
  const [displayName, setDisplayName] = useState(props.activeUser.displayName)
  const [creatingArticle, setCreatingArticle] = useState(false)
  const [needReload, setNeedReload] = useState(true)
  const [tagManagement, setTagManagement] = useState(false)

  const sortByUpdatedAt = (a, b) => {
    const da = new Date(a.updatedAt)
    const db = new Date(b.updatedAt)
    if (da > db) {
      return -1
    } else if (db > da) {
      return 1
    } else {
      return 0
    }
  }

  const filterByTagsSelected = (article) => {
    const listOfTagsSelected = [...tags].filter((t) => t.selected)
    if (listOfTagsSelected.length === 0) {
      return true
    }
    let pass = true
    for (let i = 0; i < listOfTagsSelected.length; i++) {
      if (!article.tags.map((t) => t._id).includes(listOfTagsSelected[i]._id)) {
        pass = false
      }
    }
    return pass
  }

  const query =
    'query($user:ID!){user(user:$user){ displayName tags{ _id description color name } articles{ _id title updatedAt owners{ displayName } versions{ _id version revision autosave message } tags{ name color _id }}}}'
  const user = { user: props.activeUser._id }

  useEffect(() => {
    if (needReload) {
      //Self invoking async function
      ;(async () => {
        try {
          setIsLoading(true)
          const data = await askGraphQL(
            { query, variables: user },
            'fetching articles',
            props.sessionToken,
            props.applicationConfig
          )
          //Need to sort by updatedAt desc
          setArticles(data.user.articles.reverse())
          setTags(
            data.user.tags.map((t) => ({
              ...t,
              selected: false,
              color: t.color || 'grey',
            }))
          )
          setDisplayName(data.user.displayName)
          setIsLoading(false)
          setNeedReload(false)
        } catch (err) {
          alert(err)
        }
      })()
    }
  }, [needReload])

  return (
    <section className={styles.section}>
      <h1>Articles for {displayName}</h1>
      <ul className={styles.horizontalMenu}>
        <li>
          <Button primary={true} onClick={() => setCreatingArticle(true)}>
            Create new Article
          </Button>
        </li>
        <li>
          <Button onClick={() => setTagManagement(!tagManagement)}>Manage tags</Button>
        </li>
      </ul>
      <TagManagement
        tags={tags}
        close={() => setTagManagement(false)}
        focus={tagManagement}
        articles={articles}
        setNeedReload={() => setNeedReload(true)}
        setTags={setTags}
      />
      {!isLoading && (
        <>
          {creatingArticle && (
            <CreateArticle
              tags={tags}
              cancel={() => setCreatingArticle(false)}
              triggerReload={() => {
                setCreatingArticle(false)
                setNeedReload(true)
              }}
            />
          )}
          <Field className={styles.searchField} type="text" icon={Search} value={filter} placeholder="Search" onChange={(e) => setFilter(etv(e))} />
          {articles
            .filter(filterByTagsSelected)
            .filter(
              (a) => a.title.toLowerCase().indexOf(filter.toLowerCase()) > -1
            )
            .sort(sortByUpdatedAt)
            .map((a) => (
              <Article
                key={`article-${a._id}`}
                masterTags={tags}
                {...a}
                setNeedReload={() => setNeedReload(true)}
              />
            ))}
        </>
      )}
    </section>
  )
}

const Articles = connect(mapStateToProps)(ConnectedArticles)
export default Articles
