import React from 'react';

const scenarios = [
  { label: 'Guided lab review', name: 'Acid-base titration review', subject: 'General Chemistry', detail: 'Review an acid-base titration using three replicate trials and identify the safest next step.' },
  { label: 'Safety and quality check', name: 'Laboratory safety quality check', subject: 'Laboratory Safety', detail: 'Review a supervised teaching lab for safety, data quality, missing evidence, and corrective actions.' },
  { label: 'Instructor planning brief', name: 'Instructor lab planning brief', subject: 'Science Education', detail: 'Prepare an instructor-ready plan with learning objectives, constraints, checkpoints, and follow-up work.' },
];

function exampleForField(field, variant, featureName) {
  const scenario = scenarios[variant % scenarios.length];
  const key = field.key;
  if (field.type === 'select' && field.options?.length) return field.options[variant % field.options.length];
  if (field.type === 'date' || /(?:date|deadline)$/i.test(key)) {
    const date = new Date();
    date.setDate(date.getDate() + [7, 14, 21][variant % 3]);
    return date.toISOString().slice(0, 10);
  }
  if (field.type === 'number') {
    if (/score|percent|average/i.test(key)) return [85, 90, 95][variant % 3];
    if (/budget|cost|amount/i.test(key)) return [500, 900, 1500][variant % 3];
    if (/capacity|enrolled|student|count|total|completed/i.test(key)) return [18, 24, 30][variant % 3];
    if (/weight/i.test(key)) return [36.46, 58.44, 180.16][variant % 3];
    return [30, 45, 60][variant % 3];
  }
  if (/email/i.test(key)) return `student${variant + 1}@example.edu`;
  if (/^(?:name|title|projectName|labName)$/i.test(key)) return `${featureName || 'Lab'} — ${scenario.name}`;
  if (/studentName/i.test(key)) return ['Alex Rivera', 'Jordan Lee', 'Morgan Chen'][variant % 3];
  if (/instructor|authors|members/i.test(key)) return ['Dr. Avery Patel and Alex Rivera', 'Dr. Morgan Lee and the laboratory safety team', 'Dr. Jordan Chen and the course design team'][variant % 3];
  if (/subject|category|labType|dataType/i.test(key)) return scenario.subject;
  if (/description|abstract|notes|objectives/i.test(key)) return `${scenario.detail} Use only supplied observations, label assumptions, and identify missing evidence.`;
  if (/hypothesis/i.test(key)) return 'The measured endpoint will agree across three trials within the stated tolerance when glassware is conditioned and read consistently.';
  if (/method|procedure|instruction/i.test(key)) return 'Verify PPE and equipment calibration; record three labeled trials; compare observations with the expected range; pause for instructor review before corrective action.';
  if (/results|dataset/i.test(key)) return 'Trial 1: 24.8 mL; Trial 2: 25.0 mL; Trial 3: 25.1 mL. One temperature observation is missing and must be confirmed.';
  if (/conclusion/i.test(key)) return 'The replicate values are consistent for an instructional example, but the missing temperature observation should be resolved before final interpretation.';
  if (/reactants/i.test(key)) return '0.100 M sodium hydroxide; unknown hydrochloric acid; phenolphthalein indicator';
  if (/products/i.test(key)) return 'Sodium chloride solution and water';
  if (/organism/i.test(key)) return ['Allium cepa', 'Saccharomyces cerevisiae', 'Elodea canadensis'][variant % 3];
  if (/equipment/i.test(key)) return 'Safety goggles, nitrile gloves, burette, volumetric pipette, flask, spill kit, and labeled waste container';
  if (/parameters/i.test(key)) return 'Initial volume 25.0 mL; concentration 0.100 M; three trials; room temperature 22 °C';
  if (/formula/i.test(key)) return 'M₁V₁ = M₂V₂';
  if (/structure/i.test(key)) return 'Document the molecular or experimental structure, labels, units, and assumptions supplied by the reviewer.';
  if (/properties/i.test(key)) return 'Observable properties, measurement uncertainty, handling constraints, and evidence limitations';
  if (/strengths/i.test(key)) return 'Careful measurement, complete units, repeatable procedure, and clear lab notes';
  if (/improvements/i.test(key)) return 'Add uncertainty analysis, verify the missing observation, and explain the link between evidence and conclusion';
  if (/question/i.test(key)) return 'Include five mixed-format questions covering method, interpretation, uncertainty, and safety, with answer explanations.';
  if (/keyword/i.test(key)) return 'laboratory education, evidence review, measurement uncertainty, safety';
  if (/journal/i.test(key)) return 'Journal of Chemical Education';
  if (/grade/i.test(key)) return ['B+', 'A-', 'A'][variant % 3];
  if (/visualization/i.test(key)) return ['Line chart with uncertainty bars', 'Safety findings table', 'Milestone timeline'][variant % 3];
  if (/location|room/i.test(key)) return ['Teaching Lab 201', 'Safety Lab 105', 'Virtual Lab Room A'][variant % 3];
  if (/modelNumber/i.test(key)) return ['EDU-100', 'SAFE-220', 'VLAB-310'][variant % 3];
  if (/manufacturer/i.test(key)) return 'Example Lab Instruments';
  if (/formula/i.test(key)) return 'M₁V₁ = M₂V₂';
  if (/time|duration/i.test(key)) return ['45 minutes', '60 minutes', '90 minutes'][variant % 3];
  return `${scenario.detail} This is fictional example data for review; confirm it against the real laboratory record.`;
}

export function createFeaturePresets(feature) {
  return scenarios.map((scenario, variant) => ({
    label: scenario.label,
    values: Object.fromEntries(feature.fields.map((field) => [field.key, exampleForField(field, variant, feature.name)])),
  }));
}

export function fillEveryField(values, variant = 0, choices = {}) {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => {
    if (choices[key]?.length) return [key, choices[key][variant % choices[key].length]];
    const type = typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'select' : 'text';
    return [key, exampleForField({ key, type, options: typeof value === 'boolean' ? [true, false] : undefined }, variant, 'Lab review')];
  }));
}

export default function FullFieldPresets({ value, onChange, choices = {}, presets, disabled = false }) {
  const available = presets || scenarios.map((scenario, index) => ({ label: scenario.label, values: fillEveryField(value, index, choices) }));
  return <div className="ai-preset-bar"><div><strong>Fill every AI field</strong><p>Each example fills required and optional fields. Review and edit before generating.</p></div><div className="ai-actions">{available.map((preset) => <button type="button" className="btn btn-secondary" key={preset.label} disabled={disabled} onClick={() => onChange({ ...value, ...preset.values })}>{preset.label}</button>)}</div></div>;
}
