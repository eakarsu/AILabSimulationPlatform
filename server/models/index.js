const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// User Model
const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false },
  lastName: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('student', 'instructor', 'admin'), defaultValue: 'student' }
});

// Chemistry Experiment
const ChemistryExperiment = sequelize.define('ChemistryExperiment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  reactants: { type: DataTypes.TEXT },
  products: { type: DataTypes.TEXT },
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  category: { type: DataTypes.STRING },
  safetyLevel: { type: DataTypes.STRING },
  estimatedTime: { type: DataTypes.STRING },
  aiAnalysis: { type: DataTypes.TEXT }
});

// Physics Simulation
const PhysicsSimulation = sequelize.define('PhysicsSimulation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  parameters: { type: DataTypes.TEXT },
  formula: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  estimatedTime: { type: DataTypes.STRING },
  aiAnalysis: { type: DataTypes.TEXT }
});

// Biology Lab
const BiologyLab = sequelize.define('BiologyLab', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  organism: { type: DataTypes.STRING },
  labType: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  equipment: { type: DataTypes.TEXT },
  procedures: { type: DataTypes.TEXT },
  aiAnalysis: { type: DataTypes.TEXT }
});

// Lab Equipment
const LabEquipment = sequelize.define('LabEquipment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  manufacturer: { type: DataTypes.STRING },
  modelNumber: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('available', 'in-use', 'maintenance', 'retired'), defaultValue: 'available' },
  location: { type: DataTypes.STRING },
  virtualAvailable: { type: DataTypes.BOOLEAN, defaultValue: true }
});

// Lab Report
const LabReport = sequelize.define('LabReport', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  studentName: { type: DataTypes.STRING },
  subject: { type: DataTypes.STRING },
  hypothesis: { type: DataTypes.TEXT },
  methodology: { type: DataTypes.TEXT },
  results: { type: DataTypes.TEXT },
  conclusion: { type: DataTypes.TEXT },
  grade: { type: DataTypes.STRING },
  aiReview: { type: DataTypes.TEXT },
  gradingResult: { type: DataTypes.JSONB }
});

// Safety Training
const SafetyTraining = sequelize.define('SafetyTraining', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  hazardType: { type: DataTypes.STRING },
  procedures: { type: DataTypes.TEXT },
  quizQuestions: { type: DataTypes.TEXT },
  passingScore: { type: DataTypes.INTEGER, defaultValue: 80 },
  aiScenario: { type: DataTypes.TEXT }
});

// Student Progress
const StudentProgress = sequelize.define('StudentProgress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentName: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  course: { type: DataTypes.STRING },
  completedLabs: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalLabs: { type: DataTypes.INTEGER, defaultValue: 0 },
  averageScore: { type: DataTypes.FLOAT, defaultValue: 0 },
  lastActive: { type: DataTypes.DATE },
  strengths: { type: DataTypes.TEXT },
  improvements: { type: DataTypes.TEXT }
});

// Data Analysis
const DataAnalysis = sequelize.define('DataAnalysis', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  dataType: { type: DataTypes.STRING },
  dataset: { type: DataTypes.TEXT },
  method: { type: DataTypes.STRING },
  results: { type: DataTypes.TEXT },
  visualization: { type: DataTypes.STRING },
  aiInsights: { type: DataTypes.TEXT }
});

// Molecular Viewer
const MolecularStructure = sequelize.define('MolecularStructure', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  formula: { type: DataTypes.STRING },
  molecularWeight: { type: DataTypes.FLOAT },
  structure: { type: DataTypes.TEXT },
  category: { type: DataTypes.STRING },
  bondType: { type: DataTypes.STRING },
  properties: { type: DataTypes.TEXT },
  aiDescription: { type: DataTypes.TEXT }
});

// Assessment/Grading
const Assessment = sequelize.define('Assessment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  questions: { type: DataTypes.JSONB },
  totalPoints: { type: DataTypes.INTEGER, defaultValue: 100 },
  estimatedMinutes: { type: DataTypes.INTEGER },
  maxScore: { type: DataTypes.INTEGER, defaultValue: 100 },
  duration: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'intermediate' },
  aiGenerated: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Assessment Attempt
const AssessmentAttempt = sequelize.define('AssessmentAttempt', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  assessmentId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER },
  answers: { type: DataTypes.JSONB },
  score: { type: DataTypes.INTEGER, defaultValue: 0 },
  totalPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
  percentage: { type: DataTypes.FLOAT, defaultValue: 0 },
  completedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

// AI Result persistence
const AiResult = sequelize.define('AiResult', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER },
  endpoint: { type: DataTypes.STRING, allowNull: false },
  inputData: { type: DataTypes.JSONB },
  result: { type: DataTypes.TEXT },
  parsedResult: { type: DataTypes.JSONB }
});

// Peer Collaboration
const Collaboration = sequelize.define('Collaboration', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  projectName: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  members: { type: DataTypes.TEXT },
  subject: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('planning', 'in-progress', 'review', 'completed'), defaultValue: 'planning' },
  deadline: { type: DataTypes.DATE },
  notes: { type: DataTypes.TEXT }
});

// Lab Schedule
const LabSchedule = sequelize.define('LabSchedule', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  labName: { type: DataTypes.STRING, allowNull: false },
  instructor: { type: DataTypes.STRING },
  date: { type: DataTypes.DATEONLY },
  startTime: { type: DataTypes.STRING },
  endTime: { type: DataTypes.STRING },
  room: { type: DataTypes.STRING },
  capacity: { type: DataTypes.INTEGER, defaultValue: 30 },
  enrolled: { type: DataTypes.INTEGER, defaultValue: 0 },
  status: { type: DataTypes.ENUM('scheduled', 'in-progress', 'completed', 'cancelled'), defaultValue: 'scheduled' }
});

// Research Papers
const ResearchPaper = sequelize.define('ResearchPaper', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  authors: { type: DataTypes.STRING },
  abstract: { type: DataTypes.TEXT },
  subject: { type: DataTypes.STRING },
  keywords: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('draft', 'in-progress', 'review', 'published'), defaultValue: 'draft' },
  journal: { type: DataTypes.STRING },
  aiSummary: { type: DataTypes.TEXT }
});

// Virtual Lab Session
const VirtualLabSession = sequelize.define('VirtualLabSession', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  subject: { type: DataTypes.STRING },
  labType: { type: DataTypes.STRING },
  objectives: { type: DataTypes.TEXT },
  instructions: { type: DataTypes.TEXT },
  duration: { type: DataTypes.STRING },
  difficulty: { type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'), defaultValue: 'beginner' },
  aiGuidance: { type: DataTypes.TEXT }
});

module.exports = {
  sequelize,
  User,
  ChemistryExperiment,
  PhysicsSimulation,
  BiologyLab,
  LabEquipment,
  LabReport,
  SafetyTraining,
  StudentProgress,
  DataAnalysis,
  MolecularStructure,
  Assessment,
  AssessmentAttempt,
  AiResult,
  Collaboration,
  LabSchedule,
  ResearchPaper,
  VirtualLabSession
};
