import React, { useState, useEffect } from 'react';

const FALLBACK_STORIES = [
  {
    id: 1,
    title: { rendered: 'The Summit Mindset' },
    excerpt: {
      rendered:
        '<p>Every challenging trek teaches me that sustained effort, strategic planning, and unwavering focus are the only paths to greatness.</p>',
    },
    date: '2024-02-01',
    link: 'https://pankajbiswas.com',
    _image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    _category: 'Travel, Trekking Tales',
    _readTime: '5 min read',
  },
];

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const postsPerPage = 12;
  const category = 'travel';

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(false);

      try {
        let categoryId = '';

        if (category) {
          const catRes = await fetch(`/wp-json/wp/v2/categories?slug=${category}`);

          if (catRes.ok) {
            const catData = await catRes.json();

            if (catData.length > 0) {
              categoryId = catData[0].id;
            }
          }
        }

        const categoryQuery = categoryId ? `&categories=${categoryId}` : '';

        const response = await fetch(
          `/wp-json/wp/v2/posts?per_page=${postsPerPage}&_embed=1${categoryQuery}&orderby=date&order=desc&page=${currentPage}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch stories. Status: ${response.status}`);
        }

        const data = await response.json();
        const totalPageCount = response.headers.get('X-WP-TotalPages');

        setStories(data);
        setTotalPages(Number(totalPageCount) || 1);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setStories(FALLBACK_STORIES);
        setTotalPages(1);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
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

  const getReadTime = (story) => {
    if (story._readTime) return story._readTime;
    const wordCount = (story.content?.rendered || '').replace(/<[^>]+>/g, '').split(/\s+/).length;
    const mins = Math.max(1, Math.round(wordCount / 200));
    return `${mins} min read`;
  };

  const getCategoryLabel = (story) => {
    if (story._category) return story._category;
    const cats = story._embedded?.['wp:term']?.[0];
    if (cats && cats.length > 0) return cats.map((c) => c.name).join(', ');
    return 'Travel, Trekking Tales';
  };

  return (
    <>
      {/* ── PAGE HEADER ── */}
      <div className="page-hero-bar">
        <div className="container-fluid px-5">
          <h1 className="page-hero-bar__title">Stories</h1>
          <div className="page-hero-bar__line" />
        </div>
      </div>

      {/* ── MAIN SECTION ── */}
      <section className="stories-page-section">
        <div className="container-fluid px-5">
          {/* Section heading */}
          <div className="stories-page-header">
            <h2 className="stories-page-heading">Stories</h2>
            <p className="stories-page-subheading">
              Insights on technology, strategy, and digital transformation
            </p>
            <div className="stories-page-divider" />
          </div>

          {/* States */}
          {loading && <p className="stories-state-text">Loading stories...</p>}
          {!loading && error && (
            <p className="stories-state-text">Displaying sample content.</p>
          )}

          {/* Cards grid */}
          {!loading && (
            <div className="stories-cards-grid">
              {stories.map((story) => {
                const image =
                  story._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                  story._image ||
                  'https://via.placeholder.com/600x400';

                return (
                  <div key={story.id} className="story-pcard">
                    {/* Image */}
                    <div className="story-pcard__img-wrap">
                      <img
                        src={image}
                        alt={story.title?.rendered || 'Story image'}
                        className="story-pcard__img"
                      />
                      <span className="story-pcard__cat">
                        {getCategoryLabel(story).toUpperCase()}
                      </span>
                    </div>

                    {/* Body */}
                    <div className="story-pcard__body">
                      <div className="story-pcard__meta">
                        <span className="story-pcard__meta-item">
                          <span className="story-pcard__meta-icon">📅</span>
                          {formatDate(story.date)}
                        </span>
                        <span className="story-pcard__meta-sep">·</span>
                        <span className="story-pcard__meta-item">
                          <span className="story-pcard__meta-icon">🕐</span>
                          {getReadTime(story)}
                        </span>
                      </div>

                      <h3
                        className="story-pcard__title"
                        dangerouslySetInnerHTML={{ __html: story.title?.rendered || '' }}
                      />

                      <div
                        className="story-pcard__excerpt"
                        dangerouslySetInnerHTML={{ __html: story.excerpt?.rendered || '' }}
                      />

                      <a
                        href={story.link}
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

export default Stories;