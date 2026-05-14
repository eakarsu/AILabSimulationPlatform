const express = require('express');
const auth = require('../middleware/auth');
const models = require('../models');

// Paginated models
const PAGINATED_MODELS = ['ChemistryExperiment', 'PhysicsSimulation', 'BiologyLab', 'Assessment', 'StudentProgress'];

function createCrudRouter(modelName, searchFields = ['name']) {
  const router = express.Router();
  const Model = models[modelName];
  const usePagination = PAGINATED_MODELS.includes(modelName);

  // Get all (paginated for key models)
  router.get('/', auth, async (req, res) => {
    try {
      if (usePagination && (req.query.page || req.query.limit)) {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;
        const { count, rows } = await Model.findAndCountAll({ limit, offset, order: [['createdAt', 'DESC']] });
        return res.json({ data: rows, pagination: { page, limit, total: count, totalPages: Math.ceil(count / limit) } });
      }
      const items = await Model.findAll({ order: [['id', 'ASC']] });
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get by ID
  router.get('/:id', auth, async (req, res) => {
    // Skip numeric-looking special sub-paths
    if (isNaN(parseInt(req.params.id))) {
      return res.status(404).json({ error: 'Not found' });
    }
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create
  router.post('/', auth, async (req, res) => {
    try {
      const item = await Model.create(req.body);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update
  router.put('/:id', auth, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      await item.update(req.body);
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete
  router.delete('/:id', auth, async (req, res) => {
    try {
      const item = await Model.findByPk(req.params.id);
      if (!item) return res.status(404).json({ error: 'Not found' });
      await item.destroy();
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}

module.exports = createCrudRouter;
