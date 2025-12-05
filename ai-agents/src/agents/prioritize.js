/**
 * Procedure Prioritization Agent
 * Prioritizes procedures based on multiple factors
 */

const logger = require('../utils/logger');

/**
 * Prioritize a list of procedures
 * @param {Array} procedures - List of procedures to prioritize
 * @returns {Array} Prioritized list with scores
 */
async function prioritize(procedures) {
  logger.info('Prioritizing procedures:', { count: procedures.length });
  
  try {
    const scoredProcedures = procedures.map(procedure => ({
      ...procedure,
      priorityScore: calculatePriorityScore(procedure),
      priorityFactors: getPriorityFactors(procedure)
    }));
    
    // Sort by priority score (highest first)
    scoredProcedures.sort((a, b) => b.priorityScore - a.priorityScore);
    
    // Add rank
    const prioritized = scoredProcedures.map((proc, index) => ({
      ...proc,
      rank: index + 1
    }));
    
    logger.info('Prioritization complete');
    return {
      procedures: prioritized,
      totalCount: prioritized.length,
      prioritizedAt: new Date().toISOString()
    };
    
  } catch (error) {
    logger.error('Prioritization failed:', error);
    throw error;
  }
}

/**
 * Calculate priority score (0-100)
 */
function calculatePriorityScore(procedure) {
  let score = 50; // Base score
  
  // Priority modifier
  const priorityScores = {
    'URGENT': 30,
    'HIGH': 20,
    'NORMAL': 0,
    'LOW': -10
  };
  score += priorityScores[procedure.priority] || 0;
  
  // Age modifier (older = higher priority)
  const ageHours = (Date.now() - new Date(procedure.createdAt).getTime()) / (1000 * 60 * 60);
  score += Math.min(ageHours, 20); // Max 20 points for age
  
  // SLA breach risk
  if (procedure.slaDeadline) {
    const hoursToDeadline = (new Date(procedure.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursToDeadline < 2) {
      score += 25; // Critical SLA risk
    } else if (hoursToDeadline < 8) {
      score += 15; // High SLA risk
    } else if (hoursToDeadline < 24) {
      score += 5; // Moderate SLA risk
    }
  }
  
  // Complexity modifier
  const complexityScores = {
    'CRITICAL': 10,
    'HIGH': 5,
    'MEDIUM': 0,
    'LOW': -5
  };
  score += complexityScores[procedure.complexity] || 0;
  
  // Customer value modifier
  if (procedure.customerValue === 'HIGH') {
    score += 10;
  }
  
  return Math.max(0, Math.min(100, score)); // Clamp to 0-100
}

/**
 * Get factors affecting priority
 */
function getPriorityFactors(procedure) {
  const factors = [];
  
  if (procedure.priority === 'URGENT') {
    factors.push({ factor: 'Urgent Priority', impact: 'HIGH' });
  }
  
  if (procedure.slaDeadline) {
    const hoursToDeadline = (new Date(procedure.slaDeadline).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hoursToDeadline < 8) {
      factors.push({ factor: 'SLA Deadline Approaching', impact: 'CRITICAL' });
    }
  }
  
  const ageHours = (Date.now() - new Date(procedure.createdAt).getTime()) / (1000 * 60 * 60);
  if (ageHours > 24) {
    factors.push({ factor: 'Aging Procedure', impact: 'MEDIUM' });
  }
  
  if (procedure.customerValue === 'HIGH') {
    factors.push({ factor: 'High-Value Customer', impact: 'MEDIUM' });
  }
  
  return factors;
}

module.exports = {
  prioritize
};
