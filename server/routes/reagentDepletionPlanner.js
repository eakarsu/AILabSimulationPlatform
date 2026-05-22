const express = require('express');
const router = express.Router();
function plan(input = {}) {
  const reagents = input.reagents || [
    { name: 'Buffer A', ml_available: 320, ml_per_lab: 45, scheduled_labs: 9 },
    { name: 'Indicator dye', ml_available: 90, ml_per_lab: 6, scheduled_labs: 8 },
  ];
  return { reagents: reagents.map(r => {
    const shortage = Math.max(0, Number(r.ml_per_lab) * Number(r.scheduled_labs) - Number(r.ml_available));
    return { ...r, shortage_ml: shortage, action: shortage > 0 ? 'order_before_lab' : 'sufficient' };
  }) };
}
router.get('/', (req, res) => res.json(plan()));
router.post('/plan', (req, res) => res.json(plan(req.body || {})));
module.exports = router;
