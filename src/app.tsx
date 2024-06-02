import { a, useSpring } from '@react-spring/web'
import { Provider, atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Suspense } from 'react'
import Parser from 'html-react-parser'

type PostData = {
  by: string
  descendants?: number
  id: number
  kids?: number[]
  parent: number
  score?: number
  text?: string
  time: number
  title?: string
  type: 'comment' | 'story'
  url?: string
}

const postId = atom(9001)
const postData = atom(async (get) => {
  const id = get(postId)
  const res = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
  const data: PostData = await res.json()
  return data
})

function Id() {
  const id = useAtomValue(postId)
  const props = useSpring({ from: { id }, id, reset: true })
  return <a.h1>{props.id.to(Math.round)}</a.h1>
}

function Next() {
  const setPostId = useSetAtom(postId)
  return (
    <button onClick={() => setPostId((id) => id + 1)}>
      <div>→</div>
    </button>
  )
}

function Post() {
  const [{ by, text, time, title, url }] = useAtom(postData)
  return (
    <>
      <h2>{by}</h2>
      <h6>{new Date(time * 1000).toLocaleDateString('en-US')}</h6>
      {title && <h4>{title}</h4>}
      {url && <a href={url}>{url}</a>}
      {text && <div>{Parser(text)}</div>}
    </>
  )
}

export default function App() {
  return (
    <Provider>
      <Id />
      <div>
        <Suspense fallback={<h2>Loading...</h2>}>
          <Post />
        </Suspense>
      </div>
      <Next />
    </Provider>
  )
}
