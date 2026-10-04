import { useState, useEffect } from 'react';
import { configService } from '../services/dataService';
import { HiOutlineExternalLink, HiOutlineSparkles, HiOutlineCheckCircle, HiOutlineDownload } from 'react-icons/hi';
import { ResumeIllustration } from '../components/CampusIllustrations';

const ResumeBuilderPage = () => {
  const [url, setUrl] = useState('#');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data } = await configService.getConfig();
        if (data.success && data.resumeBuilderUrl) {
          setUrl(data.resumeBuilderUrl);
        }
      } catch {
        // Use fallback
      }
    };
    fetchConfig();
  }, []);

  return (
    <div className="page-animate">
      <div className="page-header">
        <div>
          <h1>Resume Builder</h1>
          <p>Create a professional resume to kickstart your career</p>
        </div>
      </div>

      <div className="card visual-content-card" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center', padding: 'var(--space-2xl) var(--space-xl)', overflow: 'hidden' }}>
        <div style={{ marginBottom: 'var(--space-xl)', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <ResumeIllustration />
        </div>

        <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 'var(--font-bold)', color: 'var(--navy-900)', marginBottom: 'var(--space-sm)' }}>
          Build Your Professional Resume
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-base)', maxWidth: 480, margin: '0 auto var(--space-xl)', lineHeight: 1.6 }}>
          Craft a standout, ATS-compliant resume highlighting your technical skills, campus projects, and achievements.
        </p>

        {/* Feature Highlights Grid */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 'var(--space-md)', marginBottom: 'var(--space-2xl)', textAlign: 'left'
        }}>
          <div style={{
            background: 'var(--navy-50)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--navy-100)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'
          }}>
            <HiOutlineSparkles style={{ color: 'var(--navy-700)', fontSize: '1.25rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--navy-900)' }}>ATS Compliant</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Industry standard structure</div>
            </div>
          </div>

          <div style={{
            background: 'var(--sage-50)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--sage-100)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'
          }}>
            <HiOutlineCheckCircle style={{ color: 'var(--sage-700)', fontSize: '1.25rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--sage-900)' }}>Campus Ready</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Tailored for college placements</div>
            </div>
          </div>

          <div style={{
            background: 'var(--gold-50)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--gold-100)', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'
          }}>
            <HiOutlineDownload style={{ color: 'var(--gold-700)', fontSize: '1.25rem', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 'var(--font-bold)', color: 'var(--gold-900)' }}>Quick Export</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Download high-res PDF</div>
            </div>
          </div>
        </div>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-lg"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-sm)', padding: '14px 32px', fontSize: 'var(--text-base)' }}
        >
          <HiOutlineExternalLink /> Open Resume Builder
        </a>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-lg)' }}>
          You will be redirected to the official external career builder tool.
        </p>
      </div>
    </div>
  );
};

export default ResumeBuilderPage;
