import React, { useState, useEffect } from 'react';

const FALLBACK_PROJECTS = [
  {
    id: 1,
    cat: 'National Online Admission Portal',
    title: 'Building a National Online Admission Portal for One of India\'s Most Prestigious Universities',
    desc: 'CHALLENGE: The Problem We Solved Nalanda University is not your average university. It is a Government of India initiative under...',
    img: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop',
    result: '500% Growth',
    duration: '18 Months',
    tags: ['Web Development'],
  },
  {
    id: 2,
    cat: 'Electronics Maintenance',
    title: 'Taking a Legacy Business Management System Online — Without Replacing What Already Works',
    desc: 'CHALLENGE: The Problem We Solved SEC Incorporated — Building Electronics Incorporated — is an established company based in Glendora, California...',
    img: 'https://images.unsplash.com/photo-1460925895917-adf4e565db8d?w=600&h=400&fit=crop',
    result: '$10M ARR',
    duration: '12 Months',
    tags: ['Web Development'],
  },
  {
    id: 3,
    cat: 'Medicine Delivery Startup',
    title: 'Building an Uber-Like Medicine Delivery Platform — Powered by 100+ Drivers Daily',
    desc: 'CHALLENGE: The Problem We Solved Our Client Andrew Iyoha needed a medicine delivery operated under Harsha\'s Transportation Incorporated, based out of...',
    img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    result: '10K+ Users',
    duration: '6 Months',
    tags: ['Web Development'],
  },
];

const STATS = [
  { value: '500+', label: 'Projects Completed' },
  { value: '$100M+', label: 'Revenue Generated' },
  { value: '12+', label: 'Years of Experience' },
  { value: '50+', label: 'Global Clients' },
];

const Projects = () => {
  const [projectList, setProjectList] = useState(FALLBACK_PROJECTS);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Projects');
  const [categories, setCategories] = useState(['All Projects']);

  useEffect(() => {
    const fetchCaseStudies = async () => {
      setLoading(true);

      try {
        const endpoints = [
          '/wp-json/wp/v2/case_study?per_page=12&_embed=1',
          '/wp-json/wp/v2/case-study?per_page=12&_embed=1',
          '/wp-json/wp/v2/posts?per_page=12&_embed=1',
        ];

        let finalData = null;

        for (const endpoint of endpoints) {
          try {
            const res = await fetch(endpoint);

            if (!res.ok) {
              console.warn(`API failed: ${endpoint}. Status: ${res.status}`);
              continue;
            }

            const data = await res.json();

            if (Array.isArray(data) && data.length > 0) {
              finalData = data;
              break;
            }
          } catch (apiError) {
            console.warn(`Fetch failed for endpoint: ${endpoint}`, apiError);
          }
        }

        if (finalData) {
          setProjectList(finalData);

          // Build category list from data
          const cats = ['All Projects'];
          finalData.forEach((p) => {
            const cat = getCategory(p);
            if (cat && !cats.includes(cat)) cats.push(cat);
          });
          setCategories(cats);
        } else {
          setProjectList(FALLBACK_PROJECTS);
          setCategories(['All Projects', 'Web Development']);
        }
      } catch (err) {
        console.warn('Falling back to static case studies:', err);
        setProjectList(FALLBACK_PROJECTS);
        setCategories(['All Projects', 'Web Development']);
      } finally {
        setLoading(false);
      }
    };

    fetchCaseStudies();
  }, []);

  const getTitle = (project) => project.title?.rendered || project.title || 'Untitled Project';
  const getDescription = (project) => project.excerpt?.rendered || project.desc || '';
  const getImage = (project) =>
    project._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
    project._image ||
    project.img ||
    'https://via.placeholder.com/600x400';
  const getCategory = (project) => {
    const tags = project._embedded?.['wp:term']?.[1];
    if (tags && tags.length > 0) return tags[0].name;
    return project._cat || project.cat || '';
  };
  const getCatBadge = (project) =>
    project._cat || project.cat || getCategory(project) || 'Project';

  const filteredProjects =
    activeFilter === 'All Projects'
      ? projectList
      : projectList.filter((p) => {
          const cat = getCategory(p);
          return (
            cat === activeFilter ||
            (project._tags || project.tags || []).includes(activeFilter)
          );
        });

  return (
    <>
      {/* ── HERO HEADER ── */}
      <div className="projects-hero">
        <div className="container-fluid px-5">
          <div className="projects-hero__inner">
            <h1 className="projects-hero__title">Case Studies &amp; Projects</h1>
            <p className="projects-hero__subtitle">
              Discover how we've transformed businesses through strategic digital solutions.
            </p>
          </div>
        </div>

        {/* Stats bar */}
        <div className="projects-stats-bar">
          <div className="container-fluid px-5">
            <div className="projects-stats-row">
              <div className="projects-stat">
                <span className="projects-stat__value">500+</span>
                <span className="projects-stat__label">PROJECTS COMPLETED</span>
              </div>
              <div className="projects-stat-divider" />
              <div className="projects-stat">
                <span className="projects-stat__value">$100M+</span>
                <span className="projects-stat__label">REVENUE GENERATED</span>
              </div>
              <div className="projects-stat-divider" />
              <div className="projects-stat">
                <span className="projects-stat__value">50+</span>
                <span className="projects-stat__label">GLOBAL CLIENTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FILTER SECTION ── */}
      <div className="projects-filter-section">
        <div className="container-fluid px-5">
          <div className="projects-filter-row">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`projects-filter-btn${activeFilter === cat ? ' projects-filter-btn--active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── CARDS GRID ── */}
      <section className="projects-grid-section">
        <div className="container-fluid px-5">
          {loading ? (
            <p className="projects-state-text">Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="projects-state-text">No projects found.</p>
          ) : (
            <div className="projects-cards-grid">
              {filteredProjects.map((project) => (
                <div key={project.id} className="project-pcard">
                  {/* Image */}
                  <div className="project-pcard__img-wrap">
                    <img
                      src={getImage(project)}
                      alt={getTitle(project)}
                      className="project-pcard__img"
                    />
                    {getCategory(project) && (
                      <span className="project-pcard__img-badge">
                        {getCategory(project).toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="project-pcard__body">
                    <span className="project-pcard__cat">
                      {getCatBadge(project).toUpperCase()}
                    </span>

                    <h3
                      className="project-pcard__title"
                      dangerouslySetInnerHTML={{ __html: getTitle(project) }}
                    />

                    {project.excerpt?.rendered ? (
                      <div
                        className="project-pcard__desc"
                        dangerouslySetInnerHTML={{ __html: getDescription(project) }}
                      />
                    ) : (
                      <p className="project-pcard__desc">{getDescription(project)}</p>
                    )}

                    <div className="project-pcard__footer">
                      <a
                        href={project.link || '#'}
                        className="project-pcard__btn"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Case Study →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM STATS GRID ── */}
      <section className="projects-bottom-stats">
        <div className="container-fluid px-5">
          <div className="projects-bottom-stats__grid">
            {STATS.map((s) => (
              <div key={s.label} className="projects-bottom-stat">
                <span className="projects-bottom-stat__value">{s.value}</span>
                <span className="projects-bottom-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="page-cta-section page-cta-section--green">
        <div className="container-fluid px-5">
          <div className="page-cta-inner">
            <h2 className="page-cta-title">Ready to Become Our Next Success Story?</h2>
            <p className="page-cta-desc">
              Let's collaborate on a project that transforms your business and creates lasting impact.
            </p>
            <a href="/contact" className="btn btn-gold btn-lg">
              Start Your Project Today
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Projects;