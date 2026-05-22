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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connected');
    await sequelize.sync();
    console.log('Models synced');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();

// === BATCH 05 AUTO-MOUNT (custom feature suggestions) ===
app.use('/api/vision-procedure-verify', require('./routes/vision-procedure-verify'));
app.use('/api/lab-assistant-agent', require('./routes/lab-assistant-agent'));
app.use('/api/safety-anomaly-stream', require('./routes/safety-anomaly-stream'));
app.use('/api/peer-feedback-synthesis', require('./routes/peer-feedback-synthesis'));
app.use('/api/vr-lab-integration', require('./routes/vr-lab-integration'));

// === Batch 05 Gaps & Frontend Mounts ===
try { const _gap_student_misconception_detector = require('./routes/gap-student-misconception-detector'); app.use('/api/gap-student-misconception-detector', _gap_student_misconception_detector); } catch(e) { console.error('gap mount fail student-misconception-detector:', e.message); }
try { const _gap_real_time_safety_monitor = require('./routes/gap-real-time-safety-monitor'); app.use('/api/gap-real-time-safety-monitor', _gap_real_time_safety_monitor); } catch(e) { console.error('gap mount fail real-time-safety-monitor:', e.message); }
try { const _gap_peer_review_summarizer = require('./routes/gap-peer-review-summarizer'); app.use('/api/gap-peer-review-summarizer', _gap_peer_review_summarizer); } catch(e) { console.error('gap mount fail peer-review-summarizer:', e.message); }
try { const _gap_research_paper_recommender = require('./routes/gap-research-paper-recommender'); app.use('/api/gap-research-paper-recommender', _gap_research_paper_recommender); } catch(e) { console.error('gap mount fail research-paper-recommender:', e.message); }
try { const _gap_live = require('./routes/gap-live'); app.use('/api/gap-live', _gap_live); } catch(e) { console.error('gap mount fail live:', e.message); }
try { const _gap_plagiarism = require('./routes/gap-plagiarism'); app.use('/api/gap-plagiarism', _gap_plagiarism); } catch(e) { console.error('gap mount fail plagiarism:', e.message); }
try { const _gap_parent_guardian = require('./routes/gap-parent-guardian'); app.use('/api/gap-parent-guardian', _gap_parent_guardian); } catch(e) { console.error('gap mount fail parent-guardian:', e.message); }
try { const _gap_lms = require('./routes/gap-lms'); app.use('/api/gap-lms', _gap_lms); } catch(e) { console.error('gap mount fail lms:', e.message); }
try { const _gap_limited = require('./routes/gap-limited'); app.use('/api/gap-limited', _gap_limited); } catch(e) { console.error('gap mount fail limited:', e.message); }
try { const _gap_mobile_tablet = require('./routes/gap-mobile-tablet'); app.use('/api/gap-mobile-tablet', _gap_mobile_tablet); } catch(e) { console.error('gap mount fail mobile-tablet:', e.message); }
// === End Batch 05 Mounts ===
