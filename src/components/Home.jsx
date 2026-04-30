import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { wpApi } from '../utils/api';

/* ── tiny HTML-strip helper ── */
const stripHtml = (html = '') =>
  html.replace(/<[^>]+>/g, '').replace(/&[a-z]+;/gi, ' ').trim();

/* ── format date ── */
const fmtDate = (iso = '') => {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  } catch { return ''; }
};

/* ── read-time estimate ── */
const readTime = (content = '') => {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
};

const Home = () => {
  const cardRefs = useRef([]);

  /* API data states */
  const [blogs, setBlogs]       = useState([]);
  const [stories, setStories]   = useState([]);
  const [projects, setProjects] = useState([]);

  /* intersection observer for fade-in */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('fade-in-up');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    cardRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [blogs, stories, projects]);

  /* fetch blogs (posts) */
  useEffect(() => {
    fetch(wpApi('/wp/v2/posts?per_page=3&_embed'))
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setBlogs(data); })
      .catch(() => {});
  }, []);

  /* fetch stories (custom post type or category) */
  useEffect(() => {
    fetch(wpApi('/stories?per_page=2&_embed'))
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setStories(data); })
      .catch(() => {
        /* fallback: try category named 'stories' */
        fetch(wpApi('/wp/v2/categories?slug=stories'))
          .then((r) => r.json())
          .then((cats) => {
            if (Array.isArray(cats) && cats.length) {
              fetch(wpApi(`/wp/v2/posts?categories=${cats[0].id}&per_page=2&_embed`))
                .then((r) => r.json())
                .then((data) => { if (Array.isArray(data)) setStories(data); })
                .catch(() => {});
            }
          })
          .catch(() => {});
      });
  }, []);

  /* fetch projects / case-studies */
  useEffect(() => {
    fetch(wpApi('/wp/v2/case_study?per_page=5&_embed'))
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProjects(data); })
      .catch(() => {
        fetch(wpApi('/wp/v2/posts?categories=case-study&per_page=5&_embed'))
          .then((r) => r.json())
          .then((data) => { if (Array.isArray(data)) setProjects(data); })
          .catch(() => {});
      });
  }, []);

  const addRef = (el) => {
    if (el && !cardRefs.current.includes(el)) cardRefs.current.push(el);
  };

  /* ── featured image helper ── */
  const featImg = (post, fallback = '') => {
    try {
      return post?._embedded?.['wp:featuredmedia']?.[0]?.source_url || fallback;
    } catch { return fallback; }
  };

  const FALLBACK_BLOG_IMGS = [
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=380&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-adf4e565db8d?w=600&h=380&fit=crop',
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=380&fit=crop',
  ];

  const FALLBACK_STORY_IMGS = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&h=400&fit=crop',
  ];

  const FALLBACK_PROJECT_IMGS = [
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1460925895917-adf4e565db8d?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section id="home" className="hero-luxury">
        <div className="container">
          <div className="hero-wrapper">
            <div className="hero-text-section">
              <div className="hero-content">
                <div className="hero-label">
                  <span className="gold-accent">▸</span> Digital Strategy &amp; Transformation
                </div>
                <h1 className="hero-title">
                  Elevate Your<br />
                  <span className="text-gold">Digital Presence</span>
                </h1>
                <p className="hero-subtitle">
                  Strategic consulting for visionary entrepreneurs who refuse to settle for ordinary
                </p>
                <div className="hero-stats">
                  <div className="stat">
                    <div className="stat-number">12+</div>
                    <div className="stat-label">Years Experience</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">500+</div>
                    <div className="stat-label">Successful Projects</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Global Clients</div>
                  </div>
                </div>
                <div className="hero-cta mt-5">
                  <Link to="/contact" className="btn btn-gold btn-lg">Schedule Strategy Session</Link>
                  <a href="#expertise" className="cta-link">
                    Explore My Work <i className="fas fa-arrow-right ms-2"></i>
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-image-section">
              <div className="hero-frame-wrapper">
                <div className="hero-frame-circle">
                  <img src="/images/pankaj-biswas-hero-image.jpg" alt="Pankaj Biswas" className="hero-image" />
                </div>
                <div className="hero-frame-accent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="luxury-divider">
        <svg viewBox="0 0 1200 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,30 Q300,10 600,30 T1200,30 L1200,60 L0,60 Z" fill="#1a1a1a" />
        </svg>
      </div>

      {/* ── EXPERTISE ── */}
      <section id="expertise" className="expertise-section">
        <div className="container-fluid px-5">
          <div className="section-header">
            <h2 className="section-title">Core Expertise</h2>
            <div className="gold-line mx-auto"></div>
          </div>
          <div className="row g-5 mt-5">
            {[
              { icon: 'fa-code',       title: 'Strategic Digital Development', desc: 'WordPress mastery combined with cutting-edge web technologies to build powerful digital foundations', features: ['Custom Solutions', 'Performance Optimization', 'Scalable Architecture'] },
              { icon: 'fa-chart-line', title: 'Growth Acceleration',           desc: 'Data-driven strategies that transform your business metrics and drive exponential growth',           features: ['Market Analysis', 'Growth Hacking', 'Revenue Scaling'] },
              { icon: 'fa-lightbulb', title: 'Strategic Consulting',           desc: 'Executive-level guidance for entrepreneurs navigating complex digital transformation journeys',      features: ['Business Strategy', 'Market Positioning', 'Leadership Coaching'] },
            ].map((item, i) => (
              <div className="col-md-6 col-lg-4" key={i}>
                <div className="expertise-card" ref={addRef}>
                  <div className="card-icon"><i className={`fas ${item.icon}`}></i></div>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                  <div className="card-features">
                    {item.features.map((f) => <span className="feature" key={f}>{f}</span>)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLIENTS ── */}
      <section className="clients-section">
        <div className="container-fluid px-5">
          <div className="section-header">
            <h2 className="section-title">Trusted by Leading Brands</h2>
            <div className="gold-line mx-auto"></div>
          </div>
          <div className="clients-carousel">
            <div className="clients-track">
              {['emami','dnr','bec','nalanda','emami','dnr','bec','nalanda','emami','dnr','emami','dnr','bec','nalanda','emami','dnr','bec','nalanda','emami','dnr'].map((name, i) => (
                <div className="client-logo" key={i}>
                  <img src={`/images/${name}.png`} alt={name} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO (from API) ── */}
      <section id="portfolio" className="portfolio-section">
        <div className="container-fluid px-5">
          <div className="section-header">
            <h2 className="section-title">Featured Work</h2>
            <div className="gold-line mx-auto"></div>
          </div>

          {projects.length === 0 ? (
            /* Static fallback while loading or if API returns empty */
            <div className="row g-4 mt-5">
              {[
                { img: FALLBACK_PROJECT_IMGS[0], title: 'Enterprise Digital Transformation', sub: '500% Growth in 18 Months', slug: '1' },
                { img: FALLBACK_PROJECT_IMGS[1], title: 'Tech Startup Scaling',               sub: 'From 0 to $10M ARR',        slug: '2' },
                { img: FALLBACK_PROJECT_IMGS[2], title: 'SaaS Platform',                      sub: '10K+ Active Users',          slug: '3' },
                { img: FALLBACK_PROJECT_IMGS[3], title: 'E-Commerce Platform',                sub: '$5M+ Revenue Generated',     slug: '4' },
                { img: FALLBACK_PROJECT_IMGS[4], title: 'Digital Agency',                     sub: 'Rebranding &amp; Growth',    slug: '5' },
              ].map((item, i) => (
                <div className={`col-lg-${i < 2 ? 6 : 4}`} key={i}>
                  <div className="portfolio-card large" ref={addRef}>
                    <div className="portfolio-image">
                      <img src={item.img} alt={item.title} />
                      <div className="portfolio-overlay">
                        <div className="portfolio-content">
                          <h4>{item.title}</h4>
                          <p>{item.sub}</p>
                          <Link to={`/projects/${item.slug}`} className="portfolio-link">
                            View Case Study <i className="fas fa-arrow-right ms-2"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-4 mt-5">
              {projects.map((p, i) => {
                const img   = featImg(p, FALLBACK_PROJECT_IMGS[i % FALLBACK_PROJECT_IMGS.length]);
                const title = stripHtml(p?.title?.rendered || 'Project');
                const slug  = p?.slug || p?.id;
                const excerpt = stripHtml(p?.excerpt?.rendered || '');
                return (
                  <div className={`col-lg-${i < 2 ? 6 : 4}`} key={p.id}>
                    <div className="portfolio-card large" ref={addRef}>
                      <div className="portfolio-image">
                        <img src={img} alt={title} />
                        <div className="portfolio-overlay">
                          <div className="portfolio-content">
                            <h4>{title}</h4>
                            {excerpt && <p>{excerpt.slice(0, 80)}…</p>}
                            <Link to={`/projects/${slug}`} className="portfolio-link">
                              View Case Study <i className="fas fa-arrow-right ms-2"></i>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── BLOGS (from API) ── */}
      <section className="blogs-section">
        <div className="container-fluid px-5">
          <div className="section-header">
            <h2 className="section-title">Digital World News</h2>
            <p className="section-subtitle">Insights on technology, strategy, and digital transformation</p>
            <div className="gold-line mx-auto"></div>
          </div>
          <div className="row g-5 mt-5">
            {(blogs.length > 0 ? blogs : [
              { id: 'f1', _fallback: true, img: FALLBACK_BLOG_IMGS[0], cat: 'Technology',  title: 'The Future of AI in Digital Strategy',        desc: 'Exploring how artificial intelligence is revolutionizing business strategies and creating unprecedented opportunities.' },
              { id: 'f2', _fallback: true, img: FALLBACK_BLOG_IMGS[1], cat: 'Development', title: 'Building Scalable Web Applications',           desc: 'Best practices and architectural patterns for developing web apps that scale with your business.' },
              { id: 'f3', _fallback: true, img: FALLBACK_BLOG_IMGS[2], cat: 'Marketing',   title: 'Data-Driven Marketing in 2024',               desc: 'How to leverage data analytics to create targeted marketing campaigns that deliver measurable ROI.' },
            ]).map((blog, i) => {
              if (blog._fallback) {
                return (
                  <div className="col-lg-4" key={blog.id}>
                    <div className="blog-card" ref={addRef}>
                      <div className="blog-image">
                        <img src={blog.img} alt={blog.title} />
                        <div className="blog-category">{blog.cat}</div>
                      </div>
                      <div className="blog-content">
                        <h3>{blog.title}</h3>
                        <p>{blog.desc}</p>
                        <Link to="/blogs" className="blog-link">Read Article <i className="fas fa-arrow-right ms-2"></i></Link>
                      </div>
                    </div>
                  </div>
                );
              }
              const img   = featImg(blog, FALLBACK_BLOG_IMGS[i % FALLBACK_BLOG_IMGS.length]);
              const title = stripHtml(blog?.title?.rendered || '');
              const desc  = stripHtml(blog?.excerpt?.rendered || '').slice(0, 120) + '…';
              const cat   = blog?._embedded?.['wp:term']?.[0]?.[0]?.name || 'Article';
              const slug  = blog?.slug || blog?.id;
              const date  = fmtDate(blog?.date);
              const rt    = readTime(blog?.content?.rendered || '');
              return (
                <div className="col-lg-4" key={blog.id}>
                  <div className="blog-card" ref={addRef}>
                    <div className="blog-image">
                      <img src={img} alt={title} />
                      <div className="blog-category">{cat}</div>
                    </div>
                    <div className="blog-content">
                      <div className="blog-meta">
                        <span className="blog-date"><i className="far fa-calendar me-1"></i>{date}</span>
                        <span className="blog-read-time"><i className="far fa-clock me-1"></i>{rt}</span>
                      </div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                      <Link to={`/blogs/${slug}`} className="blog-link">
                        Read Article <i className="fas fa-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="blogs-cta">
            <Link to="/blogs" className="btn btn-gold">View All Articles</Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT PREVIEW ── */}
      <section className="about-premium">
        <div className="container-fluid px-5">
          <div className="row align-items-start g-5">
            <div className="col-lg-5">
              <div className="about-frame-wrapper">
                <div className="about-image-frame">
                  <img src="/images/pankaj-about-image.jpg" alt="Pankaj Biswas" />
                  <div className="frame-overlay"></div>
                  <div className="frame-accent-border"></div>
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <h2 className="section-title">About Pankaj</h2>
              <div className="gold-line"></div>
              <p className="about-text">
                I work as a digital consultant helping businesses streamline their operations. I start by deeply
                understanding your business, then develop custom business management software algorithms and
                strategies tailored to your unique needs. My approach combines software development, digital
                marketing consultancy, and social media management.
              </p>
              <p className="about-text">
                Beyond software development, I provide digital marketing consultancy to help your business
                grow. I specialise in driving growth through strategic advertising and social media management.
              </p>
              <h3 className="tech-stack-title">Technologies &amp; Platforms</h3>
              <div className="tech-stack">
                <div className="tech-group"><h4>Web Development</h4><p>Laravel • Node.js • React.js • WordPress</p></div>
                <div className="tech-group"><h4>Digital Marketing</h4><p>Meta Ads • Google Ads • Social Media • YouTube</p></div>
              </div>
              <div className="about-highlights">
                <div className="highlight"><span className="highlight-number">12+</span><span className="highlight-text">Years of Expertise</span></div>
                <div className="highlight"><span className="highlight-number">500+</span><span className="highlight-text">Projects Delivered</span></div>
                <div className="highlight"><span className="highlight-number">50+</span><span className="highlight-text">Global Clients</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STORIES (from API) ── */}
      <section id="stories" className="stories-section">
        <div className="container-fluid px-5">
          <div className="section-header">
            <h2 className="section-title">Mountain Wisdom</h2>
            <p className="section-subtitle">Lessons from the Himalayas that shape my philosophy</p>
            <div className="gold-line mx-auto"></div>
          </div>
          <div className="row g-5 mt-5">
            {(stories.length > 0 ? stories : [
              { id: 'sf1', _fallback: true, img: FALLBACK_STORY_IMGS[0], title: 'The Summit Mindset',        desc: 'Every challenging trek teaches me that sustained effort, strategic planning, and unwavering focus are the only paths to greatness.' },
              { id: 'sf2', _fallback: true, img: FALLBACK_STORY_IMGS[1], title: 'Finding Clarity in Silence', desc: 'In the silence of mountain valleys, I discovered that true innovation happens when we step away from noise and reconnect with purpose.' },
            ]).map((story, i) => {
              if (story._fallback) {
                return (
                  <div className="col-lg-6" key={story.id}>
                    <div className="story-card" ref={addRef}>
                      <div className="story-image"><img src={story.img} alt={story.title} /></div>
                      <div className="story-content">
                        <h3>{story.title}</h3>
                        <p>{story.desc}</p>
                        <Link to="/stories" className="story-link">Read Full Story <i className="fas fa-arrow-right ms-2"></i></Link>
                      </div>
                    </div>
                  </div>
                );
              }
              const img   = featImg(story, FALLBACK_STORY_IMGS[i % FALLBACK_STORY_IMGS.length]);
              const title = stripHtml(story?.title?.rendered || '');
              const desc  = stripHtml(story?.excerpt?.rendered || '').slice(0, 160) + '…';
              const slug  = story?.slug || story?.id;
              return (
                <div className="col-lg-6" key={story.id}>
                  <div className="story-card" ref={addRef}>
                    <div className="story-image"><img src={img} alt={title} /></div>
                    <div className="story-content">
                      <h3>{title}</h3>
                      <p>{desc}</p>
                      <Link to={`/stories/${slug}`} className="story-link">
                        Read Full Story <i className="fas fa-arrow-right ms-2"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="testimonials-luxury">
        <div className="container-fluid px-5">
          <h2 className="section-title text-center">Trusted by Industry Leaders</h2>
          <div className="gold-line mx-auto"></div>
          <div className="row g-5 mt-5">
            {[
              { text: '"Pankaj doesn\'t just deliver projects—he transforms businesses. His strategic insights have become invaluable to our team."', name: 'Rajesh Kumar',  role: 'CEO, TechStart Innovations' },
              { text: '"A rare combination of strategic vision and technical excellence. Working with Pankaj elevated our entire digital infrastructure."', name: 'Sarah Mitchell', role: 'Founder, Digital Growth Co.' },
              { text: '"Exceptional strategic mind paired with genuine care for client success. Highly recommended for any serious entrepreneur."',          name: 'Amit Patel',    role: 'Managing Director, Global Ventures' },
            ].map((t, i) => (
              <div className="col-lg-4" key={i}>
                <div className="testimonial-card" ref={addRef}>
                  <div className="stars">{'★★★★★'}</div>
                  <p className="testimonial-text">{t.text}</p>
                  <div className="testimonial-author"><h4>{t.name}</h4><p>{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="contact" className="cta-luxury">
        <div className="container-fluid px-5">
          <div className="cta-content">
            <h2>Ready to Transform Your Digital Future?</h2>
            <p>Let's discuss your vision and create a strategic roadmap for unprecedented growth</p>
            <Link to="/contact" className="btn btn-gold btn-lg">Schedule Free Strategy Call</Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;