import { Link } from 'react-router-dom'

function PostCard({ post }) {
  return (
    <Link
      to={`/post/${post.slug}`}
      className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition"
    >
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.titulo}
          className="w-full h-52 object-cover"
        />
      )}

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-2">
          {post.titulo}
        </h2>

        <p className="text-gray-600 line-clamp-3">
          {post.conteudo}
        </p>
      </div>
    </Link>
  )
}

export default PostCard