import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Configuração do Supabase - SUBSTITUA com suas credenciais
const SUPABASE_URL = 'https://belsfnrhdrkzlgqdmora.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_A6CvO73jLqp4eiul_nR9BA_9jpdoFmA';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Componente principal do Blog
export default function AIBlog() {
  const [currentView, setCurrentView] = useState('home');
  const [posts, setPosts] = useState([]);
  const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPostBySlug = async (slug) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar post:', error);
      return null;
    }
  };

  const handlePostClick = async (post) => {
    setCurrentPost(post);
    setCurrentView('post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setCurrentPost(null);
  };

  const filteredPosts = posts.filter(post =>
    post.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.conteudo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="blog-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;500;600&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        :root {
          --primary: #0f172a;
          --secondary: #64748b;
          --accent: #f59e0b;
          --background: #ffffff;
          --surface: #f8fafc;
          --border: #e2e8f0;
          --text: #1e293b;
          --text-light: #64748b;
        }

        body {
          font-family: 'Inter', -apple-system, sans-serif;
          background: var(--background);
          color: var(--text);
          line-height: 1.7;
          overflow-x: hidden;
        }

        .blog-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* Header & Navigation */
        .header {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--border);
          position: sticky;
          top: 0;
          z-index: 1000;
          animation: slideDown 0.4s ease-out;
        }

        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 2rem;
        }

        .logo {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 900;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          cursor: pointer;
          transition: transform 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .logo:hover {
          transform: scale(1.05);
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--accent) 0%, #ef4444 100%);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 900;
          font-size: 1.2rem;
        }

        .search-container {
          flex: 1;
          max-width: 500px;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1.25rem 0.875rem 3rem;
          border: 2px solid var(--border);
          border-radius: 50px;
          font-size: 0.95rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.3s ease;
          background: var(--surface);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--accent);
          background: white;
          box-shadow: 0 8px 20px rgba(245, 158, 11, 0.1);
          transform: translateY(-1px);
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
          font-size: 1.1rem;
        }

        /* Hero Section */
        .hero {
          background: linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%);
          color: white;
          padding: 5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%);
          animation: pulse 8s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3.5rem;
          font-weight: 900;
          margin-bottom: 1rem;
          line-height: 1.2;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        }

        .hero p {
          font-size: 1.25rem;
          opacity: 0.9;
          font-weight: 300;
          letter-spacing: 0.5px;
        }

        .ai-badge {
          display: inline-block;
          padding: 0.5rem 1.25rem;
          background: rgba(245, 158, 11, 0.2);
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: 50px;
          margin-top: 1.5rem;
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          animation: glow 2s ease-in-out infinite;
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(245, 158, 11, 0.5);
          }
        }

        /* Main Content */
        .content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }

        /* Posts Grid */
        .posts-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2.5rem;
          margin-top: 2rem;
        }

        .post-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          position: relative;
          animation: fadeInUp 0.6s ease-out backwards;
        }

        .post-card:nth-child(1) { animation-delay: 0.1s; }
        .post-card:nth-child(2) { animation-delay: 0.2s; }
        .post-card:nth-child(3) { animation-delay: 0.3s; }
        .post-card:nth-child(4) { animation-delay: 0.4s; }
        .post-card:nth-child(5) { animation-delay: 0.5s; }
        .post-card:nth-child(6) { animation-delay: 0.6s; }

        .post-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
        }

        .post-thumbnail {
          width: 100%;
          height: 220px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .post-thumbnail.has-image {
          background: none;
        }

        .post-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .post-card:hover .post-thumbnail img {
          transform: scale(1.1);
        }

        .post-thumbnail::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 100px;
          background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
        }

        .post-content {
          padding: 1.75rem;
        }

        .post-date {
          color: var(--accent);
          font-size: 0.813rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 0.75rem;
        }

        .post-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: var(--primary);
          line-height: 1.3;
        }

        .post-excerpt {
          color: var(--text-light);
          font-size: 0.938rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .read-more {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.25rem;
          color: var(--accent);
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: gap 0.3s ease;
        }

        .post-card:hover .read-more {
          gap: 0.75rem;
        }

        /* Single Post View */
        .single-post {
          max-width: 800px;
          margin: 0 auto;
          animation: fadeIn 0.6s ease-out;
        }

        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          background: white;
          border: 2px solid var(--border);
          border-radius: 50px;
          color: var(--text);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
          font-size: 0.938rem;
        }

        .back-button:hover {
          border-color: var(--accent);
          color: var(--accent);
          transform: translateX(-4px);
        }

        .post-header {
          margin-bottom: 2.5rem;
        }

        .post-header .post-date {
          font-size: 0.938rem;
          margin-bottom: 1rem;
        }

        .post-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 900;
          color: var(--primary);
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .post-featured-image {
          width: 100%;
          height: 450px;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 2.5rem;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .post-featured-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .post-body {
          background: white;
          padding: 3rem;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          font-size: 1.125rem;
          line-height: 1.8;
          color: var(--text);
        }

        .post-body p {
          margin-bottom: 1.5rem;
        }

        .post-body h2 {
          font-family: 'Playfair Display', serif;
          font-size: 2rem;
          font-weight: 700;
          margin: 2.5rem 0 1.25rem;
          color: var(--primary);
        }

        .post-body h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 2rem 0 1rem;
          color: var(--primary);
        }

        .post-body ul, .post-body ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }

        .post-body li {
          margin-bottom: 0.75rem;
        }

        .post-body a {
          color: var(--accent);
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s ease;
        }

        .post-body a:hover {
          border-color: var(--accent);
        }

        .post-body blockquote {
          border-left: 4px solid var(--accent);
          padding: 1.5rem 2rem;
          margin: 2rem 0;
          background: var(--surface);
          border-radius: 0 8px 8px 0;
          font-style: italic;
        }

        .post-body code {
          background: var(--surface);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .post-body pre {
          background: var(--primary);
          color: white;
          padding: 1.5rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5rem 0;
        }

        .post-body pre code {
          background: none;
          padding: 0;
          color: white;
        }

        /* Loading State */
        .loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1.5rem;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-text {
          color: var(--text-light);
          font-size: 1.125rem;
          font-weight: 500;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: var(--text-light);
        }

        .empty-state-icon {
          font-size: 4rem;
          margin-bottom: 1.5rem;
          opacity: 0.5;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          color: var(--text);
        }

        .empty-state p {
          font-size: 1.125rem;
        }

        /* Footer */
        .footer {
          background: var(--primary);
          color: white;
          padding: 3rem 2rem;
          margin-top: 5rem;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
        }

        .footer p {
          opacity: 0.8;
          font-size: 0.938rem;
        }

        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }

        .footer-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .footer-link:hover {
          color: var(--accent);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }

          .search-container {
            max-width: 100%;
          }

          .hero {
            padding: 3rem 1.5rem;
          }

          .hero h1 {
            font-size: 2.25rem;
          }

          .hero p {
            font-size: 1rem;
          }

          .posts-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .post-header h1 {
            font-size: 2rem;
          }

          .post-body {
            padding: 2rem 1.5rem;
            font-size: 1rem;
          }

          .post-featured-image {
            height: 300px;
          }
        }

        @media (max-width: 480px) {
          .logo {
            font-size: 1.5rem;
          }

          .logo-icon {
            width: 32px;
            height: 32px;
            font-size: 1rem;
          }

          .hero h1 {
            font-size: 1.875rem;
          }

          .post-thumbnail {
            height: 180px;
          }
        }
      `}</style>

      {/* Header */}
      <header className="header">
        <nav className="nav-container">
          <div className="logo" onClick={handleBackToHome}>
            <div className="logo-icon">AI</div>
            <span>Blog IA</span>
          </div>
          {currentView === 'home' && (
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Pesquisar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section - apenas na home */}
      {currentView === 'home' && (
        <section className="hero">
          <div className="hero-content">
            <h1>Inteligência Artificial em Ação</h1>
            <p>Conteúdo criado e atualizado automaticamente por IA todos os dias</p>
            <div className="ai-badge">✨ Powered by AI</div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="content">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="loading-text">Carregando conteúdo...</p>
          </div>
        ) : currentView === 'home' ? (
          <>
            {filteredPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <h3>Nenhum post encontrado</h3>
                <p>
                  {searchQuery
                    ? 'Tente ajustar sua busca'
                    : 'Aguarde novos posts serem criados pela IA'}
                </p>
              </div>
            ) : (
              <div className="posts-grid">
                {filteredPosts.map((post, index) => (
                  <article
                    key={post.id}
                    className="post-card"
                    onClick={() => handlePostClick(post)}
                  >
                    <div className={`post-thumbnail ${post.thumbnail ? 'has-image' : ''}`}>
                      {post.thumbnail && <img src={post.thumbnail} alt={post.titulo} />}
                    </div>
                    <div className="post-content">
                      <div className="post-date">{formatDate(post.created_at)}</div>
                      <h2 className="post-title">{post.titulo}</h2>
                      <p className="post-excerpt">
                        {post.conteudo.substring(0, 150)}...
                      </p>
                      <div className="read-more">
                        Ler artigo completo →
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="single-post">
            <button className="back-button" onClick={handleBackToHome}>
              ← Voltar
            </button>
            {currentPost && (
              <>
                <div className="post-header">
                  <div className="post-date">{formatDate(currentPost.created_at)}</div>
                  <h1>{currentPost.titulo}</h1>
                </div>
                {currentPost.thumbnail && (
                  <div className="post-featured-image">
                    <img src={currentPost.thumbnail} alt={currentPost.titulo} />
                  </div>
                )}
                <div className="post-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {currentPost.conteudo}
                  </ReactMarkdown>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <p>© 2026 Blog IA - Conteúdo gerado e atualizado automaticamente</p>
          <div className="footer-links">
            <a href="#" className="footer-link">Sobre</a>
            <a href="#" className="footer-link">Contato</a>
            <a href="#" className="footer-link">Termos</a>
            <a href="#" className="footer-link">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}