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
  RotateCcw,
  Rocket,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';

const STORAGE_KEY = 'launchproof_project_draft';
const PUBLIC_APP_URL = 'https://shanyuzhe.github.io/launchproof-mtp-2026/';
const LIVE_APP_URL = process.env.NEXT_PUBLIC_APP_URL || PUBLIC_APP_URL;

const sampleProject = {
  name: 'LaunchProof',
  user: 'AI builders and product teams shipping hackathon products',
  problem:
    'AI tools can produce a working demo quickly, but teams still struggle to prove it is valuable, coherent, measurable, and ready to ship.',
  solution:
    'A launch-readiness workspace that turns an idea into a product brief, critical flows, launch risks, Novus event evidence, and a pitch packet.',
  url: LIVE_APP_URL,
  stage: 'Public hackathon demo',
  metric: 'A builder exports a complete launch packet and can point to Novus/Pendo events as proof.',
};

const sampleProducts = [
  {
    id: 'launchproof',
    label: 'LaunchProof',
    description: 'Hackathon launch packet',
    project: sampleProject,
  },
  {
    id: 'meetingbridge',
    label: 'MeetingBridge',
    description: 'Remote team follow-up',
    project: {
      name: 'MeetingBridge',
      user: 'remote product teams that leave calls with scattered decisions and unclear owners',
      problem:
        'AI meeting summaries are easy to generate, but teams still lose launch-critical decisions, owners, and follow-up risks after each call.',
      solution:
        'A post-meeting command center that turns a transcript into decisions, owner-ready tasks, risk flags, and a shareable follow-up brief.',
      url: `${LIVE_APP_URL}?sample=meetingbridge`,
      stage: 'AI builder prototype',
      metric: 'A product lead exports a follow-up brief with decisions, owners, unresolved risks, and the next meeting agenda.',
    },
  },
  {
    id: 'issuepilot',
    label: 'IssuePilot',
    description: 'GitHub triage assistant',
    project: {
      name: 'IssuePilot',
      user: 'open-source maintainers who need to triage incoming GitHub issues quickly without losing context',
      problem:
        'Maintainers receive vague bug reports and feature requests faster than they can sort severity, duplicates, reproduction steps, and next actions.',
      solution:
        'An AI-assisted triage board that clusters issues, drafts clarifying questions, tags priority, and exports maintainer-ready action queues.',
      url: `${LIVE_APP_URL}?sample=issuepilot`,
      stage: 'Public alpha',
      metric: 'A maintainer reviews ten new issues and exports a prioritized triage queue with owners and next actions.',
    },
  },
];

const tabs = [
  ['brief', ClipboardCheck, 'Brief'],
  ['flows', ListChecks, 'Flows'],
  ['risks', ShieldAlert, 'Risks'],
  ['evidence', Gauge, 'Evidence'],
  ['pitch', BookOpen, 'Pitch'],
];

const judgeDemoPath = [
  {
    key: 'brief',
    label: '1. Frame the user',
    proof: 'Show the user, pain, promise, and launch hypothesis in one screen.',
    eventName: 'judge_demo_brief_viewed',
  },
  {
    key: 'flows',
    label: '2. Prove the workflow',
    proof: 'Show the critical path a stranger can complete without setup.',
    eventName: 'judge_demo_flows_viewed',
  },
  {
    key: 'risks',
    label: '3. Name launch risk',
    proof: 'Show that each risk has a mitigation and measurable signal.',
    eventName: 'judge_demo_risks_viewed',
  },
  {
    key: 'evidence',
    label: '4. Surface evidence',
    proof: 'Show hackathon criteria, Novus/Pendo events, and the live local feed.',
    eventName: 'judge_demo_evidence_viewed',
  },
  {
    key: 'pitch',
    label: '5. Export the story',
    proof: 'Show the judge-facing story and copy-ready launch packet.',
    eventName: 'judge_demo_pitch_viewed',
  },
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

const makeReadinessFactors = (project) => {
  const demoUrl = project.url.trim();

  return [
    {
      label: 'Specific user',
      ready: project.user.trim().length >= 28,
      proof: 'Names who gets value instead of describing a generic audience.',
      weight: 12,
    },
    {
      label: 'Pain worth solving',
      ready: project.problem.trim().length >= 60,
      proof: 'Explains the launch risk or workflow pain clearly enough to judge.',
      weight: 12,
    },
    {
      label: 'First-value promise',
      ready: project.solution.trim().length >= 60,
      proof: 'Turns the solution into a concrete outcome, not only a feature list.',
      weight: 10,
    },
    {
      label: 'Measurable shipped behavior',
      ready: project.metric.trim().length >= 55,
      proof: 'Defines what behavior would prove the product is ready.',
      weight: 10,
    },
    {
      label: 'Public demo URL',
      ready: /^https:\/\/\S+\.\S+/.test(demoUrl),
      proof: 'Gives judges a live URL they can test without setup.',
      weight: 8,
    },
  ];
};

const calculateScore = (project) => {
  const fields = ['name', 'user', 'problem', 'solution', 'url', 'metric'];
  const filled = fields.filter((field) => project[field]?.trim()).length;
  const longEnough = [project.problem, project.solution, project.metric].filter(
    (field) => field.trim().length > 42,
  ).length;
  const factorScore = makeReadinessFactors(project).reduce(
    (total, factor) => total + (factor.ready ? factor.weight : Math.floor(factor.weight * 0.3)),
    0,
  );

  return Math.min(96, 24 + filled * 4 + longEnough * 2 + factorScore);
};

const projectMentions = (values, keywords) => {
  const text = values.join(' ').toLowerCase();
  return keywords.some((keyword) => text.includes(keyword));
};

const makePacket = (project) => {
  const name = clean(project.name, 'Untitled Product');
  const user = clean(project.user, 'busy AI builders');
  const problem = clean(project.problem, 'a high-value workflow is still unclear before launch');
  const solution = clean(project.solution, 'a focused product experience that turns ambiguity into action');
  const url = clean(project.url, 'the product demo');
  const metric = clean(project.metric, 'a user completes the primary workflow and exports a usable result');
  const score = calculateScore(project);
  const readinessFactors = makeReadinessFactors(project);
  const projectSignals = [name, user, problem, solution, metric];
  const mentionsTeam = projectMentions(projectSignals, ['team', 'teams', 'collaboration', 'remote', 'stakeholder']);
  const mentionsExport = projectMentions(projectSignals, ['export', 'copy', 'packet', 'report', 'summary', 'submission']);
  const mentionsAi = projectMentions(projectSignals, ['ai', 'agent', 'llm', 'builder', 'vibe']);
  const hasPublicUrl = /^https:\/\/\S+\.\S+/.test(url);
  const contextualFlow = mentionsTeam
    ? {
        title: 'Align the team on launch evidence',
        event: 'evidence_reviewed',
        owner: 'Product lead',
        check: `Everyone reviewing ${name} can point to the same launch metric, risk list, and proof events before shipping.`,
      }
    : mentionsExport
      ? {
          title: 'Turn output into a reusable asset',
          event: 'export_clicked',
          owner: 'Builder',
          check: `The visitor can export a ${name} packet that is specific enough to reuse in a launch review or Devpost submission.`,
        }
      : {
          title: hasPublicUrl ? 'Validate the public demo promise' : 'Define the public demo promise',
          event: 'evidence_reviewed',
          owner: 'Launch',
          check: hasPublicUrl
            ? `The claims in the ${name} packet match what a judge can actually try at ${url}.`
            : `The team can name the public proof path before asking users or judges to evaluate ${name}.`,
        };
  const contextualRisk = mentionsTeam
    ? {
        severity: 'Medium',
        title: 'Launch ownership is spread across too many people',
        mitigation: 'Use the packet as the shared launch review artifact before recording the demo.',
        signal: 'Every critical flow has an owner and an acceptance check.',
      }
    : mentionsAi
      ? {
          severity: 'Medium',
          title: 'AI-generated confidence hides weak product proof',
          mitigation: 'Make the demo earn trust through user, flow, risk, metric, and tracked behavior evidence.',
          signal: 'The exported packet contains a measurable launch hypothesis and at least one Novus/Pendo event.',
        }
      : {
          severity: 'Medium',
          title: 'The product story drifts away from the working demo',
          mitigation: 'Keep the public URL, launch hypothesis, and pitch packet synchronized.',
          signal: 'A fresh judge can follow the testing instructions without asking for context.',
        };

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
      contextualFlow,
    ],
    risks: [
      {
        severity: 'High',
        title: 'The demo looks useful but proves no behavior',
        mitigation: 'Track the first-value, risk-review, and export events through Novus/Pendo.',
        signal: 'At least three event types appear after a fresh visitor session.',
      },
      contextualRisk,
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
    readinessFactors,
    criteria: [
      {
        label: 'Product Thinking',
        weight: '25%',
        proof: `${name} forces the builder to name a user, pain, promise, and success metric before calling the product ready.`,
      },
      {
        label: 'Craft and Execution',
        weight: '25%',
        proof: 'The workflow is a single public URL with editable inputs, structured outputs, copy export, and no account setup.',
      },
      {
        label: 'Originality and Ambition',
        weight: '25%',
        proof: 'Instead of generating more ideas, LaunchProof makes AI builders prove one launch decision with risks and evidence.',
      },
      {
        label: 'Shippedness',
        weight: '25%',
        proof: 'The app is deployed, testable by a stranger, and emits Novus/Pendo behavior events from real interactions.',
      },
    ],
    testing: [
      'Open the public LaunchProof URL.',
      'Edit the product brief fields or use the default LaunchProof example.',
      'Click Generate Launch Packet, then review Flows, Risks, Evidence, and Pitch.',
      'Copy the packet and confirm the interaction appears in the local event feed and Novus/Pendo.',
    ],
    eventMap: [
      ['brief_generated', 'Launch packet generated'],
      ['flows_reviewed', 'Critical flow reviewed'],
      ['risks_reviewed', 'Launch risks reviewed'],
      ['evidence_reviewed', 'Evidence board opened'],
      ['export_clicked', 'Pitch packet exported'],
    ],
    proofLoop: [
      {
        action: 'Frame the launch',
        event: 'brief_generated',
        evidence: 'User, pain, promise, and metric become one brief.',
        decision: 'Is the problem understandable in 30 seconds?',
      },
      {
        action: 'Review the critical path',
        event: 'flows_reviewed',
        evidence: 'Core flows include acceptance checks and owners.',
        decision: 'Can a stranger reach first value from the public URL?',
      },
      {
        action: 'Inspect launch risk',
        event: 'risks_reviewed',
        evidence: 'Risks are paired with mitigations and measurable signals.',
        decision: 'What would make this launch unsafe or unconvincing?',
      },
      {
        action: 'Export the packet',
        event: 'export_clicked',
        evidence: 'The pitch, testing plan, and scorecard are copy-ready.',
        decision: 'Is the product ready to submit, demo, or polish?',
      },
    ],
    pitch: `${name} helps ${user} decide whether an AI-built product is truly ready to ship. It turns a rough idea into a launch brief, critical flows, risk mitigations, evidence signals, and an exportable pitch packet. The result is a public demo that is not only working, but measurable through Novus/Pendo events.`,
    nextActions: [
      'Record a 90-second demo around one user and one launch decision.',
      'Capture the Novus/Pendo dashboard after events process.',
      'Use the exported packet as the Devpost project story draft.',
    ],
    demoScript: judgeDemoPath.map((step, index) => ({
      timebox: `${index * 18}-${(index + 1) * 18}s`,
      beat: step.label.replace(/^\d+\.\s*/, ''),
      proof: step.proof,
    })),
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
    '## Readiness score rationale',
    ...packet.readinessFactors.map((item) => `- ${item.ready ? 'Ready' : 'Needs work'}: ${item.label}. ${item.proof}`),
    '',
    '## Launch proof loop',
    ...packet.proofLoop.map((item) => `- ${item.action} -> ${item.event}: ${item.evidence} Decision: ${item.decision}`),
    '',
    '## Hackathon scorecard',
    ...packet.criteria.map((item) => `- ${item.label} (${item.weight}): ${item.proof}`),
    '',
    '## 90-second judge demo script',
    ...packet.demoScript.map((item) => `- ${item.timebox} ${item.beat}: ${item.proof}`),
    '',
    '## Testing instructions',
    ...packet.testing.map((item) => `- ${item}`),
    '',
    '## Pitch',
    packet.pitch,
  ].join('\n');

export default function App() {
  const [project, setProject] = useState(sampleProject);
  const [activeTab, setActiveTab] = useState('brief');
  const [analyticsStatus, setAnalyticsStatus] = useState('Waiting for SDK');
  const [copied, setCopied] = useState(false);
  const [draftReady, setDraftReady] = useState(false);
  const [judgeDemoActive, setJudgeDemoActive] = useState(false);
  const [judgeStepIndex, setJudgeStepIndex] = useState(0);
  const [events, setEvents] = useState([
    { id: 'seed-sample-loaded', name: 'sample_loaded', time: 'Seed' },
    { id: 'seed-project-created', name: 'project_created', time: 'Seed' },
  ]);

  const packet = useMemo(() => makePacket(project), [project]);

  useEffect(() => {
    try {
      const savedProject = window.localStorage.getItem(STORAGE_KEY);
      const requestedSampleId = new URLSearchParams(window.location.search).get('sample')?.toLowerCase();
      const requestedSample = sampleProducts.find((sample) => sample.id === requestedSampleId);

      if (requestedSample) {
        setProject(requestedSample.project);
        return;
      }

      if (savedProject) {
        setProject({ ...sampleProject, ...JSON.parse(savedProject) });
      }
    } catch (error) {
      console.error('[fail] Could not load saved LaunchProof draft', error);
    } finally {
      setDraftReady(true);
    }
  }, []);

  useEffect(() => {
    if (!draftReady) {
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
    } catch (error) {
      console.error('[fail] Could not save LaunchProof draft', error);
    }
  }, [draftReady, project]);

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
    const id = `${eventName}-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setEvents((current) => [{ id, name: eventName, time: now }, ...current].slice(0, 7));
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
    setJudgeDemoActive(false);
    setActiveTab('brief');
    record('brief_generated', { section: 'brief' });
  };

  const loadSampleProduct = (sample) => {
    setProject(sample.project);
    setJudgeDemoActive(false);
    setJudgeStepIndex(0);
    setActiveTab('brief');
    record('sample_project_loaded', {
      projectName: sample.project.name,
      sampleId: sample.id,
      section: 'brief',
    });
  };

  const switchTab = (key) => {
    const judgeIndex = judgeDemoPath.findIndex((step) => step.key === key);

    if (judgeIndex >= 0) {
      setJudgeStepIndex(judgeIndex);
    }

    setActiveTab(key);
    record(`${key}_reviewed`, { section: key });
  };

  const jumpToJudgeStep = (index) => {
    const step = judgeDemoPath[index];

    if (!step) {
      throw new Error(`[fail] Missing judge demo step at index ${index}`);
    }

    setJudgeDemoActive(true);
    setJudgeStepIndex(index);
    setActiveTab(step.key);
    record(step.eventName, {
      section: step.key,
      demoStep: step.label,
    });
  };

  const startJudgeDemo = () => {
    record('judge_demo_started', { section: judgeDemoPath[0].key });
    jumpToJudgeStep(0);
  };

  const advanceJudgeDemo = () => {
    const nextIndex = Math.min(judgeStepIndex + 1, judgeDemoPath.length - 1);

    if (nextIndex === judgeStepIndex) {
      record('judge_demo_completed', { section: judgeDemoPath[judgeStepIndex].key });
      return;
    }

    jumpToJudgeStep(nextIndex);
  };

  const copyPacket = async () => {
    try {
      await navigator.clipboard.writeText(buildExport(project, packet));
      setCopied(true);
      record('export_clicked', { exportType: 'markdown_packet' });
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      console.error('[fail] Could not copy LaunchProof packet', error);
      setCopied(false);
      record('export_failed', { exportType: 'markdown_packet' });
    }
  };

  const resetDemo = () => {
    setProject(sampleProject);
    setJudgeDemoActive(false);
    setJudgeStepIndex(0);
    setActiveTab('brief');
    record('demo_reset', { section: 'brief' });
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

          <div className="judge-demo-card">
            <div className="row-title">
              <h2>90-second judge path</h2>
              <span>{judgeStepIndex + 1}/{judgeDemoPath.length}</span>
            </div>
            <p>{judgeDemoPath[judgeStepIndex].proof}</p>
            <div className="demo-progress" aria-label="Judge demo progress">
              {judgeDemoPath.map((step, index) => (
                <button
                  key={step.key}
                  className={index === judgeStepIndex && judgeDemoActive ? 'active' : ''}
                  onClick={() => jumpToJudgeStep(index)}
                  aria-label={step.label}
                  title={step.label}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <button className="judge-action" onClick={judgeDemoActive ? advanceJudgeDemo : startJudgeDemo}>
              <ArrowRight size={18} />
              {judgeDemoActive
                ? judgeStepIndex === judgeDemoPath.length - 1
                  ? 'Mark Demo Complete'
                  : 'Next Proof Point'
                : 'Run Judge Demo'}
            </button>
          </div>

          <div className="sample-switcher">
            <div className="row-title">
              <h2>Sample products</h2>
              <Sparkles size={17} />
            </div>
            <p>Load a realistic AI-built product to prove the workflow generalizes beyond this submission.</p>
            <div>
              {sampleProducts.map((sample) => (
                <button
                  key={sample.id}
                  className={project.name === sample.project.name ? 'active' : ''}
                  onClick={() => loadSampleProduct(sample)}
                  title={sample.description}
                >
                  <strong>{sample.label}</strong>
                  <span>{sample.description}</span>
                </button>
              ))}
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

          <button className="secondary-action" onClick={resetDemo}>
            <RotateCcw size={17} />
            Reset Demo
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

          <div className="positioning-strip">
            <Sparkles size={18} />
            <strong>For AI builders with a working prototype but not enough proof to ship.</strong>
            <span>Brief - Flows - Risks - Evidence - Pitch</span>
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
            <article className={judgeDemoActive ? 'demo-live' : ''}>
              <Rocket size={18} />
              <div>
                <span>Judge path</span>
                <strong>{judgeDemoActive ? judgeDemoPath[judgeStepIndex].label : 'Ready in one click'}</strong>
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
              <article className="criteria-card">
                <div className="row-title">
                  <h3>Hackathon scorecard</h3>
                  <BadgeCheck size={18} />
                </div>
                <div className="criteria-grid">
                  {packet.criteria.map((item) => (
                    <section key={item.label}>
                      <div>
                        <strong>{item.label}</strong>
                        <span>{item.weight}</span>
                      </div>
                      <p>{item.proof}</p>
                    </section>
                  ))}
                </div>
              </article>
              <article className="readiness-card">
                <div className="row-title">
                  <h3>Readiness rationale</h3>
                  <Gauge size={18} />
                </div>
                {packet.readinessFactors.map((item) => (
                  <div key={item.label} className={item.ready ? 'ready' : 'needs-work'}>
                    <span>{item.ready ? 'Ready' : 'Needs work'}</span>
                    <strong>{item.label}</strong>
                    <p>{item.proof}</p>
                  </div>
                ))}
              </article>
              <article className="proof-loop-card">
                <div className="row-title">
                  <h3>Launch proof loop</h3>
                  <GitBranch size={18} />
                </div>
                {packet.proofLoop.map((item) => (
                  <div className="proof-loop-row" key={item.event}>
                    <strong>{item.action}</strong>
                    <code>{item.event}</code>
                    <p>{item.evidence}</p>
                    <small>{item.decision}</small>
                  </div>
                ))}
              </article>
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
                  <div key={event.id}>
                    <ArrowRight size={15} />
                    <span>{event.name}</span>
                    <small>{event.time}</small>
                  </div>
                ))}
              </article>
              <article className="proof-status-card">
                <div className="row-title">
                  <h3>Proof status</h3>
                  <MonitorCheck size={18} />
                </div>
                <div>
                  <span className={analyticsStatus.includes('connected') ? 'ready' : 'pending'}>
                    {analyticsStatus.includes('connected') ? 'Live' : 'Pending'}
                  </span>
                  <strong>SDK loaded</strong>
                  <p>{analyticsStatus}</p>
                </div>
                <div>
                  <span className={events.length > 2 ? 'ready' : 'pending'}>
                    {events.length > 2 ? 'Live' : 'Seeded'}
                  </span>
                  <strong>Events emitted</strong>
                  <p>{events.length} recent local events are visible in this session.</p>
                </div>
                <div>
                  <span className={events.some((event) => event.name === 'export_clicked') ? 'ready' : 'pending'}>
                    {events.some((event) => event.name === 'export_clicked') ? 'Done' : 'Try it'}
                  </span>
                  <strong>Packet copied</strong>
                  <p>Click Copy packet to produce the judge-ready Markdown export.</p>
                </div>
                <div>
                  <span className="pending">Required</span>
                  <strong>Dashboard screenshot</strong>
                  <p>Upload the matching Novus/Pendo dashboard image in Devpost.</p>
                </div>
              </article>
              <article className="testing-card">
                <div className="row-title">
                  <h3>Testing instructions</h3>
                  <MonitorCheck size={18} />
                </div>
                {packet.testing.map((item) => (
                  <div key={item}>
                    <CheckCircle2 size={16} />
                    <span>{item}</span>
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
              <article className="demo-script">
                <div className="row-title">
                  <h3>90-second demo script</h3>
                  <MonitorCheck size={18} />
                </div>
                {packet.demoScript.map((item) => (
                  <div key={item.timebox}>
                    <code>{item.timebox}</code>
                    <span>{item.beat}</span>
                    <p>{item.proof}</p>
                  </div>
                ))}
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
