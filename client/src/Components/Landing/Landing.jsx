import AssessmentIcon from '@mui/icons-material/Assessment';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import NewspaperIcon from '@mui/icons-material/Newspaper';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext';
import './landing.css';

const features = [
    {
        icon: <AssessmentIcon />,
        title: 'Company snapshots',
        description: 'Start with a concise overview of a publicly listed company.',
    },
    {
        icon: <ShowChartIcon />,
        title: 'Stock performance',
        description: 'Review current market data and price history at a glance.',
    },
    {
        icon: <AccountBalanceIcon />,
        title: 'Financial profile',
        description: 'Explore revenue, net income, and available financial statements.',
    },
    {
        icon: <NewspaperIcon />,
        title: 'News and ownership',
        description: 'See recent headlines and major holders alongside company data.',
    },
];

const steps = [
    ['01', 'Create your account', 'Sign up or log in to open your personal research workspace.'],
    ['02', 'Search for a company', 'Enter the name or ticker of a publicly listed company.'],
    ['03', 'Review its market insights', 'See its summary, price chart, financials, headlines, and ownership data.'],
];

function Brand() {
    return (
        <Link className="landing-brand" to="/" aria-label="Market Insights home">
            <span className="landing-brand-mark"><AssessmentIcon /></span>
            <span>Market Insights</span>
        </Link>
    );
}

function ResearchPreview() {
    return (
        <div className="research-preview" aria-label="Illustration of the Market Insights research workspace">
            <div className="preview-window-bar">
                <div className="preview-brand"><span className="preview-brand-dot"><AssessmentIcon /></span> MARKET INSIGHTS</div>
                <div className="preview-window-dots" aria-hidden="true"><i /><i /><i /></div>
            </div>

            <div className="preview-content">
                <div className="preview-kicker"><AutoAwesomeIcon /> COMPANY MARKET INSIGHT</div>
                <div className="preview-company-card">
                    <span className="preview-company-mark">AC</span>
                    <div className="preview-company-details">
                        <small>COMPANY SNAPSHOT</small>
                        <strong>Acme Corporation</strong>
                    </div>
                    <span className="preview-ticker">ACME</span>
                </div>

                <div className="preview-report">
                    <span className="preview-report-icon"><AssessmentIcon /></span>
                    <div className="preview-report-content">
                        <div className="preview-report-heading">Company market overview</div>
                        <p>Price performance, financial health, recent headlines, and ownership in one clear report.</p>

                        <div className="preview-chart-card">
                            <div className="preview-chart-heading">
                                <span><ShowChartIcon /> Price history</span>
                                <small>Illustrative preview</small>
                            </div>
                            <div className="preview-chart">
                                <div className="preview-chart-grid" aria-hidden="true" />
                                <svg viewBox="0 0 440 130" role="img" aria-label="Illustrative rising line chart">
                                    <defs>
                                        <linearGradient id="preview-fill" x1="0" x2="0" y1="0" y2="1">
                                            <stop offset="0%" stopColor="#7468f5" stopOpacity="0.22" />
                                            <stop offset="100%" stopColor="#7468f5" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M0 104 C28 98 38 105 62 88 S105 95 129 74 S167 82 195 61 S231 76 257 54 S299 67 323 41 S363 49 389 29 S417 37 440 12 L440 130 L0 130 Z" fill="url(#preview-fill)" />
                                    <path d="M0 104 C28 98 38 105 62 88 S105 95 129 74 S167 82 195 61 S231 76 257 54 S299 67 323 41 S363 49 389 29 S417 37 440 12" fill="none" stroke="#6c63e8" strokeWidth="3" strokeLinecap="round" />
                                    <circle cx="389" cy="29" r="5" fill="#fff" stroke="#6c63e8" strokeWidth="3" />
                                </svg>
                            </div>
                            <div className="preview-chart-legend"><span>Market data</span><span>Financials</span><span>News</span></div>
                        </div>

                        <div className="preview-topic-row">
                            <span>Financials</span><span>Recent news</span><span>Major holders</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="preview-footnote"><span className="preview-status-dot" /> Company insights, clearly organized</div>
        </div>
    );
}

export default function Landing() {
    const { currentUser, authLoading } = useAuth();
    const primaryHref = currentUser ? '/search' : '/signup';
    const primaryLabel = currentUser ? 'Open your workspace' : 'Create your account';

    return (
        <main className="landing-page">
            <header className="landing-header">
                <div className="landing-header-inner">
                    <Brand />
                    <nav className="landing-nav" aria-label="Main navigation">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it works</a>
                    </nav>
                    <div className="landing-nav-actions">
                        {!authLoading && currentUser ? (
                            <Link className="landing-login-link" to="/search">Workspace</Link>
                        ) : (
                            <Link className="landing-login-link" to="/login">Log in</Link>
                        )}
                        <Link className="landing-nav-cta" to={primaryHref}>{primaryLabel}</Link>
                    </div>
                </div>
            </header>

            <section className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-hero-copy">
                        <div className="landing-eyebrow"><span className="eyebrow-spark"><AutoAwesomeIcon /></span> AI-powered company research</div>
                        <h1>Understand the market <span>behind every company.</span></h1>
                        <p className="landing-hero-description">
                            Search a publicly listed company to review its price history, financial performance, recent news, and major holders in one clear report.
                        </p>
                        <div className="landing-hero-actions">
                            <Link className="landing-primary-button" to={primaryHref}>
                                {primaryLabel}<ArrowForwardIcon />
                            </Link>
                            {!currentUser && <Link className="landing-secondary-button" to="/login">Log in</Link>}
                        </div>
                        <div className="landing-hero-note">
                            <span className="landing-note-check">✓</span>
                            {currentUser ? 'Your saved research is ready when you are.' : 'Create an account to save and revisit your research.'}
                        </div>
                    </div>
                    <div className="landing-hero-visual">
                        <div className="hero-orbit hero-orbit-one" />
                        <div className="hero-orbit hero-orbit-two" />
                        <ResearchPreview />
                        <div className="floating-insight-chip"><span><ShowChartIcon /></span> One company. Full market picture.</div>
                    </div>
                </div>
                <div className="landing-scroll-cue" aria-hidden="true"><span />Explore the workspace</div>
            </section>

            <section className="landing-features section-shell" id="features">
                <div className="section-heading">
                    <span className="section-eyebrow">Company research at a glance</span>
                    <h2>Key market insights<br /><span>in one clear view.</span></h2>
                    <p>Review a company’s market performance, financials, news, and ownership together.</p>
                </div>
                <div className="feature-grid">
                    {features.map((feature, index) => (
                        <article className="feature-card" key={feature.title}>
                            <div className={`feature-icon feature-icon-${index + 1}`}>{feature.icon}</div>
                            <span className="feature-index">0{index + 1}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="landing-how" id="how-it-works">
                <div className="section-shell how-inner">
                    <div className="how-intro">
                        <span className="section-eyebrow">Simple by design</span>
                        <h2>Company insights,<br />made simple.</h2>
                        <p>Search for a company and get a focused view of the market information that matters.</p>
                        <Link className="how-link" to={primaryHref}>{currentUser ? 'Go to your workspace' : 'Get started'}<ArrowForwardIcon /></Link>
                    </div>
                    <div className="steps-list">
                        {steps.map(([number, title, description]) => (
                            <article className="step-row" key={number}>
                                <span className="step-number">{number}</span>
                                <div><h3>{title}</h3><p>{description}</p></div>
                                <span className="step-line" aria-hidden="true" />
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-final-cta section-shell">
                <div className="final-cta-panel">
                    <div className="final-cta-glow" />
                    <div className="final-cta-icon"><AssessmentIcon /></div>
                    <div className="final-cta-copy">
                        <span>Research a company in one place.</span>
                        <h2>Get a clear view of its market.</h2>
                    </div>
                    <Link className="final-cta-button" to={primaryHref}>{primaryLabel}<ArrowForwardIcon /></Link>
                </div>
            </section>

            <footer className="landing-footer section-shell">
                <Brand />
                <span>Clear market insights, company by company.</span>
                <div><Link to="/login">Log in</Link><Link to="/signup">Create account</Link></div>
            </footer>
        </main>
    );
}
