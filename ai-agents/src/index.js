require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('./utils/logger');
const classifyAgent = require('./agents/classify');
const prioritizeAgent = require('./agents/prioritize');
const kpiAnalysisAgent = require('./agents/kpiAnalysis');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Document Classification Agent
app.post('/classify', async (req, res) => {
  try {
    const { procedureData } = req.body;
    let parsedData;
    try {
      parsedData = typeof procedureData === 'string' ? JSON.parse(procedureData) : procedureData;
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid JSON', message: 'procedureData must be valid JSON' });
    }
    const classification = await classifyAgent.classify(parsedData);
    res.json(classification);
  } catch (error) {
    logger.error('Classification error:', error);
    res.status(500).json({ error: 'Classification failed', message: error.message });
  }
});

// Procedure Prioritization Agent
app.post('/prioritize', async (req, res) => {
  try {
    const { procedures } = req.body;
    const prioritized = await prioritizeAgent.prioritize(procedures);
    res.json(prioritized);
  } catch (error) {
    logger.error('Prioritization error:', error);
    res.status(500).json({ error: 'Prioritization failed', message: error.message });
  }
});

// KPI Analysis Agent
app.post('/analyze-kpis', async (req, res) => {
  try {
    const { kpiData } = req.body;
    let parsedData;
    try {
      parsedData = typeof kpiData === 'string' ? JSON.parse(kpiData) : kpiData;
    } catch (parseError) {
      return res.status(400).json({ error: 'Invalid JSON', message: 'kpiData must be valid JSON' });
    }
    const analysis = await kpiAnalysisAgent.analyze(parsedData);
    res.json(analysis);
  } catch (error) {
    logger.error('KPI Analysis error:', error);
    res.status(500).json({ error: 'KPI Analysis failed', message: error.message });
  }
});

// Customer Query Response Agent
app.post('/respond-query', async (req, res) => {
  try {
    const { query, context } = req.body;
    // Placeholder for customer query response
    res.json({
      response: 'Query response generated',
      confidence: 0.85,
      suggestedActions: []
    });
  } catch (error) {
    logger.error('Query response error:', error);
    res.status(500).json({ error: 'Query response failed', message: error.message });
  }
});

app.listen(PORT, () => {
  logger.info(`AI Agents server running on port ${PORT}`);
});
