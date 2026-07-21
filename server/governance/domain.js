'use strict';
function evaluate(input = {}) {
  const errors = [], exp = input.experiment || {}, runs = Array.isArray(input.runs) ? input.runs : [];
  if (!exp.id || !exp.version || !exp.modelVersion || !/^[a-f0-9]{64}$/i.test(exp.modelSha256 || '')) errors.push('versioned experiment and model digest required');
  if (!Array.isArray(exp.parameters) || !exp.parameters.length) errors.push('typed parameters required');
  if (!runs.length) errors.push('at least one versioned run required');
  for (const p of exp.parameters || []) {
    if (!p.name || !p.unit || !Number.isFinite(Number(p.value)) || (p.min != null && p.value < p.min) || (p.max != null && p.value > p.max)) {
      errors.push(`parameter ${p.name || '?'} has invalid value, unit, or range`);
    }
  }
  if (!input.dataset?.version || !/^[a-f0-9]{64}$/i.test(input.dataset?.sha256 || '')) errors.push('versioned dataset digest required');
  const signatures = new Map(), artifacts = new Set();
  for (const run of runs) {
    if (!run.id || !Number.isInteger(run.seed) || !run.engineVersion || run.simulated !== true) errors.push(`run ${run.id || '?'} lacks deterministic seed/version/simulated label`);
    if (!run.resources || !(run.resources.cpuSeconds > 0) || !(run.resources.memoryMb > 0) || run.resources.cpuSeconds > exp.resourceCaps?.cpuSeconds || run.resources.memoryMb > exp.resourceCaps?.memoryMb) errors.push(`run ${run.id || '?'} violates resource caps`);
    if (run.userCode && (!run.sandboxAttestation || run.networkAccess !== false)) errors.push(`run ${run.id || '?'} user code is not isolated`);
    if (!/^[a-f0-9]{64}$/i.test(run.artifactSha256 || '')) errors.push(`run ${run.id || '?'} artifact digest required`);
    const key = `${run.seed}|${run.inputSha256}`;
    if (signatures.has(key) && signatures.get(key) !== run.artifactSha256) errors.push(`run ${run.id || '?'} is nondeterministic`);
    signatures.set(key, run.artifactSha256); artifacts.add(run.artifactSha256);
    if (run.claimType === 'clinical' || run.claimType === 'safety-certified') errors.push(`run ${run.id} makes unsupported consequential claim`);
  }
  const references = input.referenceCases || [];
  const failures = references.filter((r) => !Number.isFinite(Number(r.actual)) || Math.abs(r.actual - r.expected) > r.tolerance).map((r) => r.id);
  if (failures.length) errors.push('reference cases outside tolerance');
  const validation = input.validation || {};
  const sensitivityCases = Array.isArray(validation.sensitivityCases) ? validation.sensitivityCases : [];
  const errorCases = Array.isArray(validation.errorCases) ? validation.errorCases : [];
  if (!validation.unitSystemVersion || !validation.numericalMethodVersion || !sensitivityCases.length ||
      sensitivityCases.some((item) => !item.parameter || !Number.isFinite(Number(item.delta)) || !Number.isFinite(Number(item.response))) ||
      !errorCases.length || errorCases.some((item) => item.expectedError !== item.actualError)) {
    errors.push('versioned units, sensitivity, numerical method, and error-case validation required');
  }
  const reportReproducible = Boolean(input.report?.version && input.report?.sha256 &&
    (input.report.runIds || []).length && (input.report.runIds || []).every((id) => runs.some((r) => r.id === id)));
  if (!reportReproducible) errors.push('reproducible versioned report required');
  return { errors, result: {
    runCount: runs.length, artifactCount: artifacts.size, deterministic: !errors.some((e) => e.includes('nondeterministic')),
    referenceFailures: failures, comparisonCount: (input.comparisons || []).length,
    reportReproducible,
    decision: errors.length ? 'revise' : 'reviewable'
  }, assumptions: ['unit conversion tables and reference expectations require scientific-owner approval'],
  uncertainty: { numericalMethodValidationRequired: true, schedulerNotConnected: true, simulatedOutputsNotEmpirical: true } };
}
module.exports = { evaluate };
