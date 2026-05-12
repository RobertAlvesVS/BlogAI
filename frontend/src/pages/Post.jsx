import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

import 'highlight.js/styles/github-dark.css'

function Post() {
  const { slug } = useParams()

  const [post, setPost] = useState(null)

  useEffect(() => {
    fetchPost()
  }, [slug])

  async function fetchPost() {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      console.error(error)
      return
    }

    setPost(data)
  }

  if (!post) {
    return (
      <div className="p-6">
        Carregando...
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.titulo}
          className="w-full rounded-2xl mb-8"
        />
      )}

      <h1 className="text-5xl font-bold mb-10">
        {post.titulo}
      </h1>

      <article className="prose prose-lg max-w-none prose-pre:p-0">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeHighlight]}
        >
          {post.conteudo}
        </ReactMarkdown>
      </article>
    </div>
  )
}

export default Post