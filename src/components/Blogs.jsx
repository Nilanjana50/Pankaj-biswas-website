import React, { useState, useEffect } from 'react';

const Blogs = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const postsPerPage = 12;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(false);

      try {
        const response = await fetch(
          `/wp-json/wp/v2/posts?per_page=${postsPerPage}&_embed=1&orderby=date&order=desc&page=${currentPage}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();

        const totalPageCount = response.headers.get('X-WP-TotalPages');

        setPosts(data);
        setTotalPages(Number(totalPageCount) || 1);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getReadTime = (post) => {
    const wordCount = (post.content?.rendered || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
    const mins = Math.max(1, Math.round(wordCount / 200));
    return `${mins} min read`;
  };

  const getCategoryLabel = (post) => {
    const cats = post._embedded?.['wp:term']?.[0];
    if (cats && cats.length > 0) return cats.map((c) => c.name).join(', ');
    return 'Business Help';
  };

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="page-hero-bar">
        <div className="container-fluid px-5">
          <h1 className="page-hero-bar__title">Blog</h1>
          <div className="page-hero-bar__line" />
        </div>
      </div>

      {/* ── MAIN SECTION ── */}
      <section className="blogs-page-section">
        <div className="container-fluid px-5">
          {/* Section heading */}
          <div className="stories-page-header">
            <h2 className="stories-page-heading">Blogs</h2>
            <p className="stories-page-subheading">
              Insights on technology, strategy, and digital transformation
            </p>
            <div className="stories-page-divider" />
          </div>

          {/* States */}
          {loading && <p className="stories-state-text">Loading blog posts...</p>}
          {!loading && error && (
            <p className="stories-state-text">No blog posts found.</p>
          )}

          {/* Cards grid */}
          {!loading && !error && (
            <div className="stories-cards-grid">
              {posts.map((post) => {
                const image =
                  post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                  'https://via.placeholder.com/500x300';

                return (
                  <div key={post.id} className="story-pcard">
                    {/* Image */}
                    <div className="story-pcard__img-wrap">
                      <img
                        src={image}
                        alt={post.title.rendered}
                        className="story-pcard__img"
                      />
                      <span className="story-pcard__cat">
                        {getCategoryLabel(post).toUpperCase()}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="story-pcard__body">
                      <div className="story-pcard__meta">
                        <span className="story-pcard__meta-item">
                          <span className="story-pcard__meta-icon">📅</span>
                          {formatDate(post.date)}
                        </span>
                        <span className="story-pcard__meta-sep">·</span>
                        <span className="story-pcard__meta-item">
                          <span className="story-pcard__meta-icon">🕐</span>
                          {getReadTime(post)}
                        </span>
                      </div>

                      <h3
                        className="story-pcard__title"
                        dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                      />

                      <div
                        className="story-pcard__excerpt"
                        dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                      />

                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="story-pcard__link"
                      >
                        Read Article →
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="pagination-nav">
              <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                ‹ Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                <button
                  key={pg}
                  onClick={() => goToPage(pg)}
                  className={currentPage === pg ? 'pagination-nav__active' : ''}
                >
                  {pg}
                </button>
              ))}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next ›
              </button>
            </nav>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="page-cta-section">
        <div className="container-fluid px-5">
          <div className="page-cta-inner">
            <h2 className="page-cta-title">Ready to Transform Your Digital Future?</h2>
            <p className="page-cta-desc">
              Let's discuss your vision and create a strategic roadmap for unprecedented growth.
            </p>
            <a href="/contact" className="btn btn-gold btn-lg">
              Schedule Free Strategy Call
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;