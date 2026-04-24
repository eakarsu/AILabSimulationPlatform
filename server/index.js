const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const sequelize = require('./config/database');
const authRoutes = require('./routes/auth');
const aiRoutes = require('./routes/ai');
const createCrudRouter = require('./routes/crud');

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Auth routes
app.use('/api/auth', authRoutes);

// AI routes
app.use('/api/ai', aiRoutes);

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
app.use('/api/assessments', createCrudRouter('Assessment'));
app.use('/api/collaborations', createCrudRouter('Collaboration'));
app.use('/api/lab-schedules', createCrudRouter('LabSchedule'));
app.use('/api/research-papers', createCrudRouter('ResearchPaper'));
app.use('/api/virtual-lab-sessions', createCrudRouter('VirtualLabSession'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    await sequelize.sync();
    console.log('✅ Models synced');
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
