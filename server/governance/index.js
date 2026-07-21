'use strict';
const { createRouter } = require('./router');
const { sequelize } = require('./store');
const database = require('../config/database');
const auth = require('../middleware/auth');
const { evaluate } = require('./domain');
module.exports = createRouter({ db: sequelize(database), auth, evaluate,
  workflow: 'versioned-lab-simulation',
  providers: ['compute-scheduler','notebook','dataset-registry','model-registry','object-storage','visualization'],
  approverRoles: ['scientist','lab_instructor','safety_reviewer','admin'] });

