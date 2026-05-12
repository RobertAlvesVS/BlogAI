import { useState } from 'react'
import { supabase } from '../lib/supabase'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function Admin() {
  const [titulo, setTitulo] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [thumbnail, setThumbnail] = useState('')

  async function criarPost(e) {
    e.preventDefault()

    const slug = titulo
      .toLowerCase()
      .replaceAll(' ', '-')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')

    const { error } = await supabase
      .from('posts')
      .insert({
        titulo,
        conteudo,
        thumbnail,
        slug,
      })

    if (error) {
      alert(error.message)
      return
    }

    alert('Post criado!')
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      <form
        onSubmit={criarPost}
        className="space-y-4"
      >
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <input
          type="text"
          placeholder="Thumbnail"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full border p-3 rounded"
        />

        <textarea
          rows={20}
          placeholder="Markdown..."
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          className="w-full border p-3 rounded font-mono"
        />

        <button className="bg-black text-white px-6 py-3 rounded">
          Publicar
        </button>
      </form>

      <div className="border rounded p-6 overflow-auto">
        <article className="prose max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {conteudo}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  )
}

export default Admin