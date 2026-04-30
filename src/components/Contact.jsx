import React, { useState, useEffect } from 'react';

const Contact = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', company: '', message: '', budget: '', consent: false
  });
  const [submitted, setSubmitted] = useState(false);

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    color: '#e8e8e8',
    padding: '0.85rem 1.25rem',
    outline: 'none',
    fontFamily: 'Montserrat, sans-serif',
    fontSize: '0.95rem',
    borderRadius: '4px'
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };
  const handleSubmit = async (e) => {  
    e.preventDefault(); 
    try {
      // Bypasses 401 Unauthorized: Gravity Forms submissions endpoint is publicly accessible via POST
      const res = await fetch('/wp-json/gf/v2/forms/1/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Correctly mapped Gravity Forms Field IDs extracted from actual schema
          input_1_3: form.name, // Name field typically splits to First(1.3)
          input_3: form.email,
          input_4: form.phone,
          input_6: form.subject,
          input_7: form.company,
          input_8: form.message,
          input_9: form.budget,
          input_10_1: form.consent ? 'I consent to be contacted about my inquiry' : ''
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        const errorData = await res.json();
        console.warn('Form submission failed:', errorData);
        if (errorData.validation_messages) {
          const messages = Object.entries(errorData.validation_messages)
             .map(([id, msg]) => `Field ${id}: ${msg}`)
             .join('\n');
          alert(`Gravity Forms Validation Failed (400 Bad Request).\nYour Gravity Form expects different Field IDs than input_1, input_2, etc.\n\nServer expects:\n${messages}\n\nPlease check your Wordpress Form and update Contact.jsx line 20-23 accordingly.`);
        } else {
          alert('Submission Failed: ' + (errorData.message || JSON.stringify(errorData)));
        }
      }
    } catch (err) {
      console.warn('Submission API Error:', err);
      alert('Submission Error: ' + err.message);
    }
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchContactPage = async () => {
      try {
        const res = await fetch(
          '/wp-json/wp/v2/pages/8',
          { signal: controller.signal }
        );

        if (!res.ok) {
          throw new Error(`WordPress API failed: ${res.status}`);
        }

        const data = await res.json();
        setPageData(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.warn('Contact API failed:', err.message);
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContactPage();

    return () => controller.abort();
  }, []);

  return (
    <>
      <div style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #1a472a 100%)', padding: '6rem 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '1px', background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}></div>
        <div className="container-fluid px-5" style={{ textAlign: 'center' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '1rem' }}>Get In Touch</h1>
          <p style={{ fontSize: '1.2rem', color: '#b8b8b8', maxWidth: '700px', margin: '0 auto' }}>Ready to transform your business? Let's start a conversation.</p>
        </div>
      </div>

      <section style={{ background: '#1a1a1a', padding: '6rem 0' }}>
        <div className="container-fluid px-5">
          <div className="row g-5">
            <div className="col-lg-5">
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#fff', marginBottom: '1rem' }}>Let's Create Something Extraordinary</h2>
              <div className="gold-line"></div>
              <p style={{ color: '#b8b8b8', marginBottom: '2.5rem' }}>Whether you're looking to transform your digital presence, scale your business, or develop a winning strategy, I'm here to help you achieve your goals.</p>

              {[
                { icon: 'fa-envelope', label: 'Email', val: 'hello@pankajbiswas.com', href: 'mailto:hello@pankajbiswas.com' },
                { icon: 'fa-phone', label: 'India', val: '+91-8444833444', href: 'tel:+918444833444' },
                { icon: 'fa-phone', label: 'USA', val: '+1-(909)-908-5262', href: 'tel:+19099085262' },
                { icon: 'fa-map-marker-alt', label: 'Location', val: '24/38 Jessore Road, 3rd Floor, Kolkata 700028, INDIA', href: null },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', alignItems: 'flex-start' }}>
                  <div style={{ width: '44px', height: '44px', border: '1px solid rgba(212,175,55,0.4)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fas ${item.icon}`}></i>
                  </div>
                  <div>
                    <p style={{ color: '#d4af37', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{item.label}</p>
                    {item.href ? (
                      <a href={item.href} style={{ color: '#e8e8e8', textDecoration: 'none', fontSize: '0.95rem' }}>{item.val}</a>
                    ) : (
                      <p style={{ color: '#e8e8e8', margin: 0, fontSize: '0.95rem' }}>{item.val}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="col-lg-7">
              {loading ? (
                <div style={{ background: 'rgba(42,65,20,0.2)', border: '1px solid rgba(212,175,55,0.2)', padding: '3rem', textAlign: 'center' }}>
                  <p style={{ color: '#d4af37', marginBottom: 0 }}>Loading form...</p>
                </div>
              ) : pageData?.content?.rendered && !error ? (
                <div
                  className="wp-contact-form-container"
                  style={{ background: 'rgba(42,65,20,0.2)', border: '1px solid rgba(212,175,55,0.2)', padding: '3rem', color: '#fff' }}
                  dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
                />
              ) : submitted ? (
                <div style={{ background: 'rgba(42,65,20,0.3)', border: '1px solid rgba(212,175,55,0.3)', padding: '3rem', textAlign: 'center' }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#d4af37', marginBottom: '1.5rem' }}></i>
                  <h3 style={{ color: '#fff', marginBottom: '1rem' }}>Message Sent!</h3>
                  <p style={{ color: '#b8b8b8' }}>Thank you for reaching out. I'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ background: 'rgba(42,65,20,0.2)', border: '1px solid rgba(212,175,55,0.2)', padding: '3rem', borderRadius: '6px' }}>
                  <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#d4af37', fontSize: '2rem', marginBottom: '2rem', fontWeight: 800 }}>Send Me a Message</h3>
                  
                  <div className="row g-4">
                    {/* Name */}
                    <div className="col-md-6">
                      <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                        Name <span style={{color: '#d9534f'}}>(Required)</span>
                      </label>
                      <input type="text" name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required style={inputStyle} />
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                        Email Address <span style={{color: '#d9534f'}}>(Required)</span>
                      </label>
                      <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required style={inputStyle} />
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6">
                      <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                        Phone Number <span style={{color: '#d9534f'}}>(Required)</span>
                      </label>
                      <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required style={inputStyle} />
                    </div>

                    {/* Subject */}
                    <div className="col-md-6">
                      <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                        Subject <span style={{color: '#d9534f'}}>(Required)</span>
                      </label>
                      <input type="text" name="subject" placeholder="Project Inquiry" value={form.subject} onChange={handleChange} required style={inputStyle} />
                    </div>

                    {/* Company/Business */}
                    <div className="col-12">
                      <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>
                        Company/Business <span style={{color: '#d9534f'}}>(Required)</span>
                      </label>
                      <input type="text" name="company" placeholder="Your Company Name" value={form.company} onChange={handleChange} required style={inputStyle} />
                    </div>

                    {/* Message */}
                    <div className="col-12">
                      <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Message</label>
                      <textarea name="message" rows="4" placeholder="Tell me about your project or inquiry..." value={form.message} onChange={handleChange} style={{...inputStyle, resize: 'vertical'}}></textarea>
                    </div>

                    {/* Budget Range */}
                    <div className="col-12">
                      <label style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Budget Range</label>
                      <select name="budget" value={form.budget} onChange={handleChange} style={inputStyle}>
                        <option value="">Select budget range</option>
                        <option value="$5,000 - $10,000">$5,000 - $10,000</option>
                        <option value="$10,000 - $25,000">$10,000 - $25,000</option>
                        <option value="$25,000 - $50,000">$25,000 - $50,000</option>
                        <option value="$50,000+">$50,000+</option>
                      </select>
                    </div>

                    {/* Consent */}
                    <div className="col-12" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <input type="checkbox" name="consent" id="consentCheck" checked={form.consent} onChange={handleChange} required style={{ width: '16px', height: '16px', accentColor: '#d4af37', flexShrink: 0 }} />
                      <label htmlFor="consentCheck" style={{ color: '#b8b8b8', fontSize: '0.9rem', margin: 0, cursor: 'pointer' }}>
                        I consent to be contacted about my inquiry
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="col-12 mt-4">
                      <button type="submit" style={{ width: '100%', background: '#d4af37', color: '#1a1a1a', fontWeight: 'bold', border: 'none', padding: '1.2rem', fontSize: '1rem', borderRadius: '4px', cursor: 'pointer', transition: 'background 0.3s' }} onMouseOver={e=>e.target.style.background='#c5a028'} onMouseOut={e=>e.target.style.background='#d4af37'}>
                        Send Message
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
