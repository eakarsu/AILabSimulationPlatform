const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const assessmentsRoutes = require('./routes/assessments');
const createCrudRouter = require('./routes/crud');
const { AiResult } = require('./models');
const auth = require('./middleware/auth');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));

// Auth routes
app.use('/api/auth', authRoutes);

// AI routes
app.use('/api/ai', aiRoutes);

// AI Results history endpoint
app.get('/api/ai-results', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const userId = req.user?.id || req.user?.userId;
    const { count, rows } = await AiResult.findAndCountAll({
      where: { userId },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    res.json({ data: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assessments routes (dedicated with submit endpoint)
app.use('/api/assessments', assessmentsRoutes);

// CRUD routes for all features
app.use('/api/chemistry-experiments', createCrudRouter('ChemistryExperiment'));
app.use('/api/physics-simulations', createCrudRouter('PhysicsSimulation'));
app.use('/api/biology-labs', createCrudRouter('BiologyLab'));
app.use('/api/lab-equipment', createCrudRouter('LabEquipment'));
app.use('/api/lab-reports', createCrudRouter('LabReport'));
app.use('/api/safety-training', createCrudRouter('SafetyTraining'));
app.use('/api/student-progress', createCrudRouter('StudentProgress'));
app.use('/api/data-analysis', createCrudRouter('DataAnalysis'));
app.use('/api/molecular-structures', createCrudRouter('MolecularStructure'));
app.use('/api/collaborations', createCrudRouter('Collaboration'));
app.use('/api/lab-schedules', createCrudRouter('LabSchedule'));
app.use('/api/research-papers', createCrudRouter('ResearchPaper'));
app.use('/api/virtual-lab-sessions', createCrudRouter('VirtualLabSession'));
app.use('/api/reagent-depletion-planner', require('./routes/reagentDepletionPlanner'));
app.use('/api/governed-lab-simulations', require('./governance'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    if (process.env.AUTO_INIT_SCHEMA === 'true') {
      await sequelize.sync();
      console.log('Models synced');
    }
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

// Generated prototype routes are opt-in for isolated, non-production evaluation.
if (process.env.ENABLE_GENERATED_ROUTES === 'true' && process.env.NODE_ENV !== 'production') {
app.use('/api/vision-procedure-verify', require('./routes/vision-procedure-verify'));
app.use('/api/lab-assistant-agent', require('./routes/lab-assistant-agent'));
app.use('/api/safety-anomaly-stream', require('./routes/safety-anomaly-stream'));
app.use('/api/peer-feedback-synthesis', require('./routes/peer-feedback-synthesis'));
app.use('/api/vr-lab-integration', require('./routes/vr-lab-integration'));

}
// Generated gap routes remain deliberately unmounted.
