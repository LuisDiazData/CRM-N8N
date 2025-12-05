/**
 * Document Classification Agent
 * Classifies insurance procedures by type, complexity, and required handling
 */

const logger = require('../utils/logger');

// Procedure categories
const CATEGORIES = {
  CLAIM: 'CLAIM',
  NEW_POLICY: 'NEW_POLICY',
  RENEWAL: 'RENEWAL',
  ENDORSEMENT: 'ENDORSEMENT',
  CANCELLATION: 'CANCELLATION',
  INQUIRY: 'INQUIRY'
};

// Complexity levels
const COMPLEXITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

/**
 * Classify procedure based on its data
 * @param {Object} procedureData - The procedure data to classify
 * @returns {Object} Classification result
 */
async function classify(procedureData) {
  logger.info('Classifying procedure:', { procedureId: procedureData.id });
  
  try {
    const category = determineCategory(procedureData);
    const complexity = determineComplexity(procedureData);
    const estimatedTime = estimateProcessingTime(category, complexity);
    const recommendedAnalyst = recommendAnalyst(category, complexity);
    
    const classification = {
      procedureId: procedureData.id,
      category,
      complexity,
      estimatedTime,
      recommendedAnalyst,
      confidence: 0.87,
      classifiedAt: new Date().toISOString(),
      tags: generateTags(procedureData, category),
      aiInsights: generateInsights(procedureData, category, complexity)
    };
    
    logger.info('Classification complete:', classification);
    return classification;
    
  } catch (error) {
    logger.error('Classification failed:', error);
    throw error;
  }
}

/**
 * Determine procedure category based on keywords and type
 */
function determineCategory(data) {
  const type = (data.procedure?.type || '').toLowerCase();
  const description = (data.procedure?.description || '').toLowerCase();
  
  if (type.includes('claim') || description.includes('siniestro') || description.includes('accidente')) {
    return CATEGORIES.CLAIM;
  }
  if (type.includes('new') || type.includes('nueva') || description.includes('contratar')) {
    return CATEGORIES.NEW_POLICY;
  }
  if (type.includes('renewal') || type.includes('renovación') || description.includes('renovar')) {
    return CATEGORIES.RENEWAL;
  }
  if (type.includes('endorsement') || type.includes('endoso') || description.includes('modificar')) {
    return CATEGORIES.ENDORSEMENT;
  }
  if (type.includes('cancel') || description.includes('cancelar') || description.includes('baja')) {
    return CATEGORIES.CANCELLATION;
  }
  
  return CATEGORIES.INQUIRY;
}

/**
 * Determine complexity based on procedure attributes
 */
function determineComplexity(data) {
  const priority = (data.procedure?.priority || '').toUpperCase();
  const description = (data.procedure?.description || '').toLowerCase();
  
  // Priority-based complexity
  if (priority === 'URGENT' || priority === 'HIGH') {
    return COMPLEXITY.CRITICAL;
  }
  
  // Keyword-based complexity
  const highComplexityKeywords = ['legal', 'fraud', 'dispute', 'multiple', 'complex'];
  const mediumComplexityKeywords = ['review', 'documentation', 'verification'];
  
  if (highComplexityKeywords.some(kw => description.includes(kw))) {
    return COMPLEXITY.HIGH;
  }
  if (mediumComplexityKeywords.some(kw => description.includes(kw))) {
    return COMPLEXITY.MEDIUM;
  }
  
  return COMPLEXITY.LOW;
}

/**
 * Estimate processing time in hours
 */
function estimateProcessingTime(category, complexity) {
  const baseTime = {
    [CATEGORIES.CLAIM]: 4,
    [CATEGORIES.NEW_POLICY]: 2,
    [CATEGORIES.RENEWAL]: 1,
    [CATEGORIES.ENDORSEMENT]: 2,
    [CATEGORIES.CANCELLATION]: 1,
    [CATEGORIES.INQUIRY]: 0.5
  };
  
  const complexityMultiplier = {
    [COMPLEXITY.LOW]: 1,
    [COMPLEXITY.MEDIUM]: 1.5,
    [COMPLEXITY.HIGH]: 2.5,
    [COMPLEXITY.CRITICAL]: 4
  };
  
  return baseTime[category] * complexityMultiplier[complexity];
}

/**
 * Recommend analyst based on category and complexity
 */
function recommendAnalyst(category, complexity) {
  // This would integrate with analyst availability and skill matching
  // For now, returns a queue assignment based on category
  const analystQueues = {
    [CATEGORIES.CLAIM]: 'claims-team',
    [CATEGORIES.NEW_POLICY]: 'sales-team',
    [CATEGORIES.RENEWAL]: 'retention-team',
    [CATEGORIES.ENDORSEMENT]: 'service-team',
    [CATEGORIES.CANCELLATION]: 'retention-team',
    [CATEGORIES.INQUIRY]: 'support-team'
  };
  
  if (complexity === COMPLEXITY.CRITICAL) {
    return 'senior-team';
  }
  
  return analystQueues[category] || 'general-queue';
}

/**
 * Generate tags for the procedure
 */
function generateTags(data, category) {
  const tags = [category.toLowerCase()];
  
  if (data.procedure?.priority === 'URGENT') {
    tags.push('urgent');
  }
  if (data.source) {
    tags.push(`source-${data.source.toLowerCase()}`);
  }
  
  return tags;
}

/**
 * Generate AI insights about the procedure
 */
function generateInsights(data, category, complexity) {
  const insights = [];
  
  if (complexity === COMPLEXITY.CRITICAL) {
    insights.push('This procedure requires immediate attention due to high priority.');
  }
  
  if (category === CATEGORIES.CLAIM) {
    insights.push('Consider requesting additional documentation for faster processing.');
  }
  
  if (category === CATEGORIES.CANCELLATION) {
    insights.push('Retention opportunity: Consider offering alternative plans before processing cancellation.');
  }
  
  return insights;
}

module.exports = {
  classify,
  CATEGORIES,
  COMPLEXITY
};
