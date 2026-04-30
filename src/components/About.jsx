import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { wpApi } from '../utils/api';

const FALLBACK_ABOUT = {
  title: 'About Me',
  subtitle: '12+ Years of Digital Excellence & Strategic Innovation',
  updated: null,
};

const About = () => {
  const [pageData, setPageData] = useState(FALLBACK_ABOUT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAboutPage = async () => {
      setLoading(true);

      try {
        const res = await fetch(wpApi('/wp/v2/pages?slug=about'), {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`WordPress API failed: ${res.status}`);
        }

        const data = await res.json();



        if (Array.isArray(data) && data.length > 0) {
          setPageData({
            title: data[0]?.title?.rendered || FALLBACK_ABOUT.title,
            subtitle: FALLBACK_ABOUT.subtitle,
            updated: data[0]?.modified || null,
          });
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn('About API failed. Showing fallback content:', error.message);
          setPageData(FALLBACK_ABOUT);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAboutPage();

    return () => controller.abort();
  }, []);

  const lastUpdated = pageData.updated
    ? new Date(pageData.updated).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    : null;

  const whyChooseItems = [
    {
      icon: '🎯',
      title: 'Laser-Focused Results',
      desc: 'Every strategy, every line of code, every marketing campaign is laser-focused on your specific goals— not just measurable impact on your business.',
    },
    {
      icon: '🤝',
      title: 'True Partnership',
      desc: "I don't just hand off deliverables. I become an extension of your team, invested in your long-term success and growth trajectory.",
    },
    {
      icon: '💡',
      title: 'Innovation + Strategy',
      desc: 'I combine cutting-edge technology with proven business strategy to create solutions that give you a real competitive advantage.',
    },
    {
      icon: '📈',
      title: 'Proven Track Record',
      desc: '500+ successful projects across diverse industries. Clients trust me with their most critical digital initiatives.',
    },
    {
      icon: '🔗',
      title: 'End-to-End Solutions',
      desc: 'From strategy and design to development and marketing, I provide comprehensive solutions without the need for multiple vendors.',
    },
    {
      icon: '🎧',
      title: 'Dedicated Support',
      desc: 'You get direct access and personalized attention. Your success is my priority, not an afterthought.',
    },
  ];

  const servicesItems = [
    {
      icon: '🧭',
      title: 'Digital Strategy & Consulting',
      points: [
        'Business analysis & roadmapping',
        'Digital transformation planning',
        'Market positioning strategy',
        'Growth acceleration planning',
      ],
      link: 'Discuss Your Strategy →',
    },
    {
      icon: '</>',
      title: 'Software & Web Development',
      points: [
        'Custom web applications',
        'Mobile app development',
        'CRM & automation systems',
        'Cloud infrastructure setup',
      ],
      link: 'Start Building →',
    },
    {
      icon: '📣',
      title: 'Digital Marketing & Growth',
      points: [
        'Performance marketing campaigns',
        'Social media strategy & management',
        'SEO & content strategy',
        'Conversion rate optimization',
      ],
      link: 'Grow Your Reach →',
    },
  ];

  return (
    <>
      {/* ── ABOUT HERO ── */}
      <div className="about-hero-section">
        <div className="container-fluid px-5">
          {loading && (
            <p className="about-loading">Loading page data...</p>
          )}
          <h1
            className="about-hero-title"
            dangerouslySetInnerHTML={{ __html: pageData.title }}
          />
          <p className="about-hero-subtitle">{pageData.subtitle}</p>
          {lastUpdated && (
            <p className="about-hero-updated">Updated: {lastUpdated}</p>
          )}
        </div>
      </div>

      {/* ── VISION SECTION ── */}
      <section className="about-vision-section">
        <div className="container-fluid px-5">
          <div className="about-vision-grid">
            {/* Left: text */}
            <div className="about-vision-text">
              <span className="about-badge">✦ DIGITAL TRANSFORMATION EXPERT</span>

              <h2 className="about-vision-heading">
                Turn Your Business Vision Into{' '}
                <span className="about-vision-gold">Digital Reality</span>
              </h2>

              <p className="about-vision-desc">
                I help ambitious companies accelerate growth, improve operations,
                and dominate their market through strategic digital innovation and execution.
              </p>

              <ul className="about-vision-checklist">
                <li>Proven 3.5x average ROI across all engagements</li>
                <li>End-to-end solutions: strategy, development, marketing</li>
                <li>Direct access and personalized attention to your business</li>
              </ul>

              <div className="about-vision-ctas">
                <Link to="/contact" className="btn btn-gold btn-lg">
                  🗓 Schedule Strategy Call
                </Link>
                <Link to="/expertise" className="btn about-btn-outline btn-lg">
                  + Explore Services
                </Link>
              </div>

              <p className="about-vision-trust">
                🔒 Trusted by Fortune 500 companies to creative startups, and everything in between
              </p>
            </div>

            {/* Right: image */}
            <div className="about-vision-image-wrap">
              <div className="about-image-frame">
                <img
                  src="/images/pankaj-about-image.jpg"
                  alt="Pankaj Biswas"
                  className="about-profile-img"
                  onError={(e) => {
                    e.currentTarget.src = '/images/pankaj-biswas-hero-image.jpg';
                  }}
                />
                <span className="about-img-badge about-img-badge--tl">📷 Focused</span>
                <span className="about-img-badge about-img-badge--br">⭐ Expert</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY CLIENTS CHOOSE ME ── */}
      <section className="about-why-section">
        <div className="container-fluid px-5">
          <div className="about-section-header">
            <h2 className="about-section-title">Why Clients Choose Me</h2>
          </div>

          <div className="about-why-grid">
            {whyChooseItems.map((item) => (
              <div key={item.title} className="about-why-card">
                <div className="about-why-icon">{item.icon}</div>
                <h4 className="about-why-card-title">{item.title}</h4>
                <p className="about-why-card-desc">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW I HELP BUSINESSES GROW ── */}
      <section className="about-services-section">
        <div className="container-fluid px-5">
          <div className="about-section-header">
            <h2 className="about-section-title">How I Help Businesses Grow</h2>
          </div>

          <div className="about-services-grid">
            {servicesItems.map((svc) => (
              <div key={svc.title} className="about-service-card">
                <div className="about-service-icon-wrap">
                  <span className="about-service-icon">{svc.icon}</span>
                </div>
                <h4 className="about-service-title">{svc.title}</h4>
                <ul className="about-service-list">
                  {svc.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
                <Link to="/contact" className="about-service-link">
                  {svc.link}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-cta-section">
        <div className="container-fluid px-5">
          <div className="about-cta-inner">
            <h2 className="about-cta-title">Ready to Work Together?</h2>
            <p className="about-cta-desc">
              Let's discuss your goals and create a strategy to achieve them.
            </p>
            <Link to="/contact" className="btn btn-gold btn-lg">
              Schedule Consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;