'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  Copy,
  Gauge,
  GitBranch,
  ListChecks,
  MonitorCheck,
  Rocket,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';

const sampleProject = {
  name: 'FollowUpFlow',
  user: 'remote product teams',
  problem:
    'Meeting decisions get scattered across notes, chat, and issue trackers, so follow-up work is easy to miss.',
  solution:
    'An AI meeting follow-up assistant that turns notes into owners, due dates, and crisp next actions.',
  url: 'https://example.com/demo',
  stage: 'Private beta',
  metric: 'A user exports a complete launch packet in one session.',
};

const tabs = [
  ['brief', ClipboardCheck, 'Brief'],
  ['flows', ListChecks, 'Flows'],
  ['risks', ShieldAlert, 'Risks'],
  ['evidence', Gauge, 'Evidence'],
  ['pitch', BookOpen, 'Pitch'],
];

const trackEvent = (eventName, metadata = {}) => {
  const payload = {
    app: 'LaunchProof',
    hackathon: 'Mind the Product World Product Day 2026',
    source: 'launchproof_app',
    ...metadata,
  };

  if (window.pendo?.track) {
    window.pendo.track(eventName, payload);
  } else if (window.novus?.track) {
    window.novus.track(eventName, payload);
  }

  window.dispatchEvent(new CustomEvent('launchproof:event', { detail: { eventName, payload } }));
};

const clean = (value, fallback) => value.trim() || fallback;

const calculateScore = (project) => {
  const fields = ['name', 'user', 'problem', 'solution', 'url', 'metric'];
  const filled = fields.filter((field) => project[field]?.trim()).length;
  const longEnough = [project.problem, project.solution, project.metric].filter(
    (field) => field.trim().length > 42,
  ).length;

  return Math.min(94, 36 + filled * 8 + longEnough * 3);
};

const makePacket = (project) => {
  const name = clean(project.name, 'Untitled Product');
  const user = clean(project.user, 'busy AI builders');
  const problem = clean(project.problem, 'a high-value workflow is still unclear before launch');
  const solution = clean(project.solution, 'a focused product experience that turns ambiguity into action');
  const url = clean(project.url, 'the product demo');
  const metric = clean(project.metric, 'a user completes the primary workflow and exports a usable result');
  const score = calculateScore(project);

  return {
    score,
    decision:
      score >= 82
        ? 'Ready for a public hackathon demo'
        : score >= 68
          ? 'Ready after one focused polish pass'
          : 'Needs sharper proof before launch',
    brief: [
      {
        label: 'User',
        value: `${name} is for ${user}.`,
      },
      {
        label: 'Pain',
        value: problem,
      },
      {
        label: 'Promise',
        value: solution,
      },
      {
        label: 'Launch hypothesis',
        value: `If ${user} can reach "${metric}" from ${url}, the first release is credible enough to ship.`,
      },
    ],
    flows: [
      {
        title: 'Understand the promise',
        event: 'brief_generated',
        owner: 'Product',
        check: `A new visitor can tell who ${name} is for, what pain it addresses, and what useful result it creates.`,
      },
      {
        title: 'Complete first value',
        event: 'flows_reviewed',
        owner: 'Experience',
        check: `The visitor can move from product context to a concrete launch packet without needing account setup or guidance.`,
      },
      {
        title: 'Inspect launch risk',
        event: 'risks_reviewed',
        owner: 'Quality',
        check: 'The visitor sees the highest launch risks, each paired with a practical mitigation and measurable signal.',
      },
      {
        title: 'Export a decision asset',
        event: 'export_clicked',
        owner: 'Go-to-market',
        check: 'The visitor can copy a pitch-ready artifact that a team could paste into a launch review or Devpost submission.',
      },
    ],
    risks: [
      {
        severity: 'High',
        title: 'The demo looks useful but proves no behavior',
        mitigation: 'Track the first-value, risk-review, and export events through Novus/Pendo.',
        signal: 'At least three event types appear after a fresh visitor session.',
      },
      {
        severity: 'Medium',
        title: 'The product promise is too broad for one launch',
        mitigation: `Keep ${name} focused on the one workflow that gets ${user} to "${metric}".`,
        signal: 'Demo script spends more time on workflow proof than feature inventory.',
      },
      {
        severity: 'Medium',
        title: 'Generated launch advice becomes generic',
        mitigation: 'Every output should mention the user, pain, evidence, and next action.',
        signal: 'The exported packet contains no standalone generic checklist items.',
      },
    ],
    evidence: [
      {
        label: 'Product thinking',
        metric: 'User, pain, promise, and launch hypothesis are explicit.',
      },
      {
        label: 'Craft',
        metric: 'A stranger can finish the workspace flow from one public URL.',
      },
      {
        label: 'Originality',
        metric: 'The product treats launch readiness as proof, not vibes.',
      },
      {
        label: 'Shippedness',
        metric: 'Novus/Pendo receives production behavior events.',
      },
    ],
    eventMap: [
      ['brief_generated', 'Launch packet generated'],
      ['flows_reviewed', 'Critical flow reviewed'],
      ['risks_reviewed', 'Launch risks reviewed'],
      ['evidence_reviewed', 'Evidence board opened'],
      ['export_clicked', 'Pitch packet exported'],
    ],
    pitch: `${name} helps ${user} decide whether an AI-built product is truly ready to ship. It turns a rough idea into a launch brief, critical flows, risk mitigations, evidence signals, and an exportable pitch packet. The result is a public demo that is not only working, but measurable through Novus/Pendo events.`,
    nextActions: [
      'Record a 90-second demo around one user and one launch decision.',
      'Capture the Novus/Pendo dashboard after events process.',
      'Use the exported packet as the Devpost project story draft.',
    ],
  };
};

const buildExport = (project, packet) =>
  [
    `# ${clean(project.name, 'Untitled Product')} Launch Packet`,
    '',
    `Readiness score: ${packet.score}/100`,
    `Decision: ${packet.decision}`,
    '',
    '## Brief',
    ...packet.brief.map((item) => `- ${item.label}: ${item.value}`),
    '',
    '## Critical flows',
    ...packet.flows.map((flow) => `- ${flow.title} (${flow.event}): ${flow.check}`),
    '',
    '## Launch risks',
    ...packet.risks.map((risk) => `- ${risk.severity}: ${risk.title}. ${risk.mitigation}`),
    '',
    '## Evidence',
    ...packet.evidence.map((item) => `- ${item.label}: ${item.metric}`),
    '',
    '## Pitch',
    packet.pitch,
  ].join('\n');

export default function App() {
  const [project, setProject] = useState(sampleProject);
  const [activeTab, setActiveTab] = useState('brief');
  const [analyticsStatus, setAnalyticsStatus] = useState('Waiting for SDK');
  const [copied, setCopied] = useState(false);
  const [events, setEvents] = useState([
    { name: 'sample_loaded', time: 'Seed' },
    { name: 'project_created', time: 'Seed' },
  ]);

  const packet = useMemo(() => makePacket(project), [project]);

  useEffect(() => {
    const updateStatus = () => {
      setAnalyticsStatus(window.launchproofAnalyticsStatus || 'Waiting for SDK');
    };

    updateStatus();
    const statusTimer = window.setInterval(updateStatus, 1000);

    return () => window.clearInterval(statusTimer);
  }, []);

  const record = (eventName, metadata = {}) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setEvents((current) => [{ name: eventName, time: now }, ...current].slice(0, 7));
    trackEvent(eventName, {
      projectName: project.name || 'Untitled Product',
      activeTab,
      readinessScore: packet.score,
      ...metadata,
    });
  };

  const updateProject = (field, value) => {
    setProject((current) => ({ ...current, [field]: value }));
  };

  const generatePacket = () => {
    setActiveTab('brief');
    record('brief_generated', { section: 'brief' });
  };

  const switchTab = (key) => {
    setActiveTab(key);
    record(`${key}_reviewed`, { section: key });
  };

  const copyPacket = async () => {
    await navigator.clipboard.writeText(buildExport(project, packet));
    setCopied(true);
    record('export_clicked', { exportType: 'markdown_packet' });
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="intake-panel" aria-label="Project intake">
          <div className="brand-row">
            <div className="brand-mark" aria-hidden="true">
              <Rocket size={22} />
            </div>
            <div>
              <p className="eyebrow">World Product Day Hackathon</p>
              <h1>LaunchProof</h1>
            </div>
          </div>

          <div className="score-card compact-score">
            <div>
              <span className="score-label">Readiness</span>
              <strong>{packet.score}</strong>
            </div>
            <p>{packet.decision}</p>
          </div>

          <label>
            Product name
            <input
              value={project.name}
              onChange={(event) => updateProject('name', event.target.value)}
              onBlur={() => record('project_name_edited')}
            />
          </label>

          <label>
            Target user
            <input
              value={project.user}
              onChange={(event) => updateProject('user', event.target.value)}
              onBlur={() => record('target_user_edited')}
            />
          </label>

          <label>
            Problem
            <textarea
              value={project.problem}
              onChange={(event) => updateProject('problem', event.target.value)}
              onBlur={() => record('problem_edited')}
            />
          </label>

          <label>
            Solution
            <textarea
              value={project.solution}
              onChange={(event) => updateProject('solution', event.target.value)}
              onBlur={() => record('solution_edited')}
            />
          </label>

          <label>
            Success metric
            <textarea
              value={project.metric}
              onChange={(event) => updateProject('metric', event.target.value)}
              onBlur={() => record('metric_edited')}
            />
          </label>

          <label>
            Demo URL
            <input
              value={project.url}
              onChange={(event) => updateProject('url', event.target.value)}
              onBlur={() => record('demo_url_edited')}
            />
          </label>

          <button className="primary-action" onClick={generatePacket}>
            <Sparkles size={18} />
            Generate Launch Packet
          </button>
        </aside>

        <section className="output-panel" aria-label="Launch packet">
          <div className="topbar">
            <div>
              <p className="eyebrow">Launch readiness packet</p>
              <h2>{clean(project.name, 'Untitled Product')}</h2>
            </div>
            <button className="copy-button" onClick={copyPacket}>
              <Copy size={18} />
              {copied ? 'Copied' : 'Copy packet'}
            </button>
          </div>

          <div className="decision-strip">
            <article>
              <Target size={18} />
              <div>
                <span>Launch decision</span>
                <strong>{packet.decision}</strong>
              </div>
            </article>
            <article>
              <BarChart3 size={18} />
              <div>
                <span>Tracked proof</span>
                <strong>{analyticsStatus}</strong>
              </div>
            </article>
            <article>
              <MonitorCheck size={18} />
              <div>
                <span>Public demo</span>
                <strong>Ready to test</strong>
              </div>
            </article>
          </div>

          <nav className="tabs" aria-label="Packet sections">
            {tabs.map(([key, Icon, label]) => (
              <button
                key={key}
                className={activeTab === key ? 'active' : ''}
                onClick={() => switchTab(key)}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>

          {activeTab === 'brief' && (
            <div className="brief-grid">
              {packet.brief.map((item) => (
                <article className="brief-item" key={item.label}>
                  <span>{item.label}</span>
                  <p>{item.value}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'flows' && (
            <div className="list-stack">
              {packet.flows.map((flow, index) => (
                <article className="flow-row" key={flow.title}>
                  <span>{index + 1}</span>
                  <div>
                    <div className="row-title">
                      <h3>{flow.title}</h3>
                      <code>{flow.event}</code>
                    </div>
                    <p>{flow.check}</p>
                    <small>{flow.owner}</small>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="list-stack">
              {packet.risks.map((risk) => (
                <article className="risk-row" key={risk.title}>
                  <div className="row-title">
                    <h3>{risk.title}</h3>
                    <span className={`severity ${risk.severity.toLowerCase()}`}>{risk.severity}</span>
                  </div>
                  <p>{risk.mitigation}</p>
                  <small>{risk.signal}</small>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="evidence-layout">
              {packet.evidence.map((item) => (
                <article className="metric" key={item.label}>
                  <BadgeCheck size={20} />
                  <strong>{item.label}</strong>
                  <span>{item.metric}</span>
                </article>
              ))}
              <article className="event-board">
                <div className="row-title">
                  <h3>Novus event map</h3>
                  <GitBranch size={18} />
                </div>
                {packet.eventMap.map(([eventName, meaning]) => (
                  <div key={eventName}>
                    <code>{eventName}</code>
                    <span>{meaning}</span>
                  </div>
                ))}
              </article>
              <article className="event-feed">
                <div className="row-title">
                  <h3>Recent local events</h3>
                  <Gauge size={18} />
                </div>
                {events.map((event) => (
                  <div key={`${event.name}-${event.time}`}>
                    <ArrowRight size={15} />
                    <span>{event.name}</span>
                    <small>{event.time}</small>
                  </div>
                ))}
              </article>
            </div>
          )}

          {activeTab === 'pitch' && (
            <div className="pitch-layout">
              <article className="pitch-block">
                <div className="row-title">
                  <h3>Judge-facing story</h3>
                  <CheckCircle2 size={18} />
                </div>
                <p>{packet.pitch}</p>
              </article>
              <article className="next-actions">
                <div className="row-title">
                  <h3>Submission next steps</h3>
                  <AlertTriangle size={18} />
                </div>
                {packet.nextActions.map((action) => (
                  <div key={action}>
                    <CheckCircle2 size={16} />
                    <span>{action}</span>
                  </div>
                ))}
              </article>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}
