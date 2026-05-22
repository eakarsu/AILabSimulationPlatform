import React, { useEffect, useState } from 'react';
export default function ReagentDepletionPlanner() {
  const [data, setData] = useState(null);
  useEffect(() => { fetch('/api/reagent-depletion-planner').then(r => r.json()).then(setData).catch(() => {}); }, []);
  return <div><h1>Reagent Depletion Planner</h1><p>Checks whether scheduled simulations will exhaust lab reagents.</p>{data?.reagents?.map(r => <section className="card" key={r.name}><h2>{r.name}</h2><p>{r.action} - shortage {r.shortage_ml} ml</p></section>)}</div>;
}
