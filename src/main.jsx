import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Download,
  Gauge,
  ListChecks,
  Rocket,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import './styles.css';

const sampleProject = {
  name: 'FollowUpFlow',
  user: 'remote product teams',
  problem:
    'Meeting decisions get scattered across notes, chat, and issue trackers, so follow-up work is easy to miss.',
  solution:
    'An AI meeting follow-up assistant that turns notes into owners, due dates, and crisp next actions.',
  url: 'https://example.com/demo',
};

const trackEvent = (eventName, metadata = {}) => {
  const payload = {
    app: 'LaunchProof',
    hackathon: 'Mind the Product World Product Day 2026',
    ...metadata,
  };

  if (window.pendo?.track) {
    window.pendo.track(eventName, payload);
  }

  if (window.novus?.track) {
    window.novus.track(eventName, payload);
  }

  window.dispatchEvent(new CustomEvent('launchproof:event', { detail: { eventName, payload } }));
};

const makePacket = (project) => {
  const name = project.name.trim() || 'Untitled Product';
  const user = project.user.trim() || 'busy builders';
  const problem = project.problem.trim() || 'a painful workflow takes too much manual effort';
  const solution = project.solution.trim() || 'a focused product that removes the repeated work';

  return {
    brief: [
      `${name} helps ${user} solve a concrete launch problem: ${problem}`,
      `The product creates value by offering ${solution.toLowerCase()}.`,
      `The first launch should prove one thing: a stranger can understand the product, complete the primary flow, and leave with a useful outcome.`,
    ],
    flows: [
      {
        title: 'First value in one session',
        check: `A new user can land on ${name}, understand the promise, and reach one useful output without setup help.`,
      },
      {
        title: 'Critical action completed',
        check: `The user can complete the core action that proves ${solution.toLowerCase()} works.`,
      },
      {
        title: 'Evidence captured',
        check: 'The product records a meaningful completion event so launch readiness can be measured, not guessed.',
      },
      {
        title: 'Next step is obvious',
        check: 'After the first useful result, the interface clearly points to the next action or export.',
      },
    ],
    risks: [
      {
        title: 'The promise is broader than the shipped workflow',
        mitigation: 'Keep the first release focused on one repeatable path and remove unsupported claims.',
      },
      {
        title: 'The app looks impressive but does not prove behavior',
        mitigation: 'Track project creation, generation, review, and export events through Novus.',
      },
      {
        title: 'Generated output is too long to act on',
        mitigation: 'Use short sections, action labels, and an export that a team can reuse immediately.',
      },
    ],
    pitch: `${name} is ready to pitch as a focused product for ${user}. The demo should show the painful before-state, one complete product flow, and the evidence that a real user can get value now.`,
  };
};

function App() {
  const [project, setProject] = useState(sampleProject);
  const [activeTab, setActiveTab] = useState('brief');
  const [events, setEvents] = useState([
    'sample_loaded',
    'project_created',
    'brief_generated',
    'flows_reviewed',
    'export_clicked',
  ]);

  const packet = useMemo(() => makePacket(project), [project]);

  const updateProject = (field, value) => {
    setProject((current) => ({ ...current, [field]: value }));
  };

  const record = (eventName) => {
    setEvents((current) => [eventName, ...current].slice(0, 8));
    trackEvent(eventName, {
      projectName: project.name || 'Untitled Product',
      activeTab,
    });
  };

  const copyPitch = async () => {
    const text = [
      `Project: ${project.name}`,
      '',
      'Launch brief:',
      ...packet.brief.map((line) => `- ${line}`),
      '',
      'Core flows:',
      ...packet.flows.map((flow) => `- ${flow.title}: ${flow.check}`),
      '',
      'Launch risks:',
      ...packet.risks.map((risk) => `- ${risk.title}: ${risk.mitigation}`),
      '',
      `Pitch: ${packet.pitch}`,
    ].join('\n');

    await navigator.clipboard.writeText(text);
    record('export_clicked');
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
            Demo URL
            <input
              value={project.url}
              onChange={(event) => updateProject('url', event.target.value)}
              onBlur={() => record('demo_url_edited')}
            />
          </label>

          <button className="primary-action" onClick={() => record('brief_generated')}>
            <Sparkles size={18} />
            Generate Launch Packet
          </button>
        </aside>

        <section className="output-panel" aria-label="Launch packet">
          <div className="topbar">
            <div>
              <p className="eyebrow">Launch readiness packet</p>
              <h2>{project.name || 'Untitled Product'}</h2>
            </div>
            <button className="icon-button" onClick={copyPitch} title="Copy pitch packet">
              <Download size={20} />
            </button>
          </div>

          <nav className="tabs" aria-label="Packet sections">
            {[
              ['brief', ClipboardCheck, 'Brief'],
              ['flows', ListChecks, 'Flows'],
              ['risks', ShieldAlert, 'Risks'],
              ['evidence', Gauge, 'Evidence'],
            ].map(([key, Icon, label]) => (
              <button
                key={key}
                className={activeTab === key ? 'active' : ''}
                onClick={() => {
                  setActiveTab(key);
                  record(`${key}_reviewed`);
                }}
              >
                <Icon size={17} />
                {label}
              </button>
            ))}
          </nav>

          {activeTab === 'brief' && (
            <div className="content-grid">
              {packet.brief.map((line) => (
                <article className="statement" key={line}>
                  <CheckCircle2 size={19} />
                  <p>{line}</p>
                </article>
              ))}
              <article className="pitch-block">
                <h3>Demo close</h3>
                <p>{packet.pitch}</p>
              </article>
            </div>
          )}

          {activeTab === 'flows' && (
            <div className="list-stack">
              {packet.flows.map((flow, index) => (
                <article className="flow-row" key={flow.title}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{flow.title}</h3>
                    <p>{flow.check}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'risks' && (
            <div className="list-stack">
              {packet.risks.map((risk) => (
                <article className="risk-row" key={risk.title}>
                  <h3>{risk.title}</h3>
                  <p>{risk.mitigation}</p>
                </article>
              ))}
            </div>
          )}

          {activeTab === 'evidence' && (
            <div className="evidence-layout">
              <article className="metric">
                <strong>{events.length}</strong>
                <span>tracked interactions</span>
              </article>
              <article className="metric">
                <strong>5</strong>
                <span>Novus-ready events</span>
              </article>
              <article className="metric">
                <strong>1</strong>
                <span>exportable pitch packet</span>
              </article>
              <div className="event-feed">
                {events.map((eventName) => (
                  <div key={`${eventName}-${Math.random()}`}>
                    <ArrowRight size={15} />
                    <span>{eventName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
