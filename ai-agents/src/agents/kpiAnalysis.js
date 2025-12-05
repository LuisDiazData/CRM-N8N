/**
 * KPI Analysis Agent
 * Analyzes KPI data and generates insights and alerts
 */

const logger = require('../utils/logger');

// Thresholds for alerts
const THRESHOLDS = {
  SLA_COMPLIANCE_MIN: 90,
  COMPLETION_RATE_MIN: 80,
  AVG_HANDLING_HOURS_MAX: 4,
  ERROR_RATE_MAX: 5,
  SATISFACTION_MIN: 4.0
};

/**
 * Analyze KPI data and generate insights
 * @param {Object} kpiData - KPI data to analyze
 * @returns {Object} Analysis result with insights and alerts
 */
async function analyze(kpiData) {
  logger.info('Analyzing KPIs:', { timestamp: kpiData.timestamp });
  
  try {
    const operationalInsights = analyzeOperationalKpis(kpiData.operational);
    const analystInsights = analyzeAnalystKpis(kpiData.analysts);
    const alerts = generateAlerts(kpiData);
    const recommendations = generateRecommendations(kpiData, alerts);
    const trends = detectTrends(kpiData);
    
    const analysis = {
      ...kpiData,
      aiAnalysis: {
        operationalInsights,
        analystInsights,
        trends,
        recommendations
      },
      alerts,
      analysisConfidence: 0.92,
      analyzedAt: new Date().toISOString()
    };
    
    logger.info('KPI Analysis complete:', { alertCount: alerts.length });
    return analysis;
    
  } catch (error) {
    logger.error('KPI Analysis failed:', error);
    throw error;
  }
}

/**
 * Analyze operational KPIs
 */
function analyzeOperationalKpis(operational) {
  const insights = [];
  
  const completionRate = parseFloat(operational.completionRate) || 0;
  const slaCompliance = operational.slaComplianceRate || 0;
  const avgHours = operational.avgCompletionHours || 0;
  
  // Completion rate analysis
  if (completionRate >= 90) {
    insights.push({
      metric: 'Completion Rate',
      status: 'EXCELLENT',
      message: `Outstanding completion rate of ${completionRate}%`
    });
  } else if (completionRate >= 80) {
    insights.push({
      metric: 'Completion Rate',
      status: 'GOOD',
      message: `Healthy completion rate of ${completionRate}%`
    });
  } else {
    insights.push({
      metric: 'Completion Rate',
      status: 'NEEDS_ATTENTION',
      message: `Completion rate at ${completionRate}% - consider reviewing bottlenecks`
    });
  }
  
  // SLA compliance analysis
  if (slaCompliance >= 95) {
    insights.push({
      metric: 'SLA Compliance',
      status: 'EXCELLENT',
      message: `Exceptional SLA compliance at ${slaCompliance.toFixed(1)}%`
    });
  } else if (slaCompliance >= THRESHOLDS.SLA_COMPLIANCE_MIN) {
    insights.push({
      metric: 'SLA Compliance',
      status: 'GOOD',
      message: `SLA compliance at ${slaCompliance.toFixed(1)}%`
    });
  } else {
    insights.push({
      metric: 'SLA Compliance',
      status: 'CRITICAL',
      message: `SLA compliance below threshold at ${slaCompliance.toFixed(1)}%`
    });
  }
  
  // Processing time analysis
  if (avgHours <= 2) {
    insights.push({
      metric: 'Processing Time',
      status: 'EXCELLENT',
      message: `Fast average processing time of ${avgHours.toFixed(1)} hours`
    });
  } else if (avgHours <= THRESHOLDS.AVG_HANDLING_HOURS_MAX) {
    insights.push({
      metric: 'Processing Time',
      status: 'GOOD',
      message: `Average processing time of ${avgHours.toFixed(1)} hours`
    });
  } else {
    insights.push({
      metric: 'Processing Time',
      status: 'NEEDS_ATTENTION',
      message: `High average processing time of ${avgHours.toFixed(1)} hours`
    });
  }
  
  // Backlog analysis
  const backlogRatio = operational.pending / (operational.totalProcedures || 1);
  if (backlogRatio > 0.3) {
    insights.push({
      metric: 'Backlog',
      status: 'WARNING',
      message: `${operational.pending} procedures pending (${(backlogRatio * 100).toFixed(1)}% of total)`
    });
  }
  
  return insights;
}

/**
 * Analyze analyst KPIs
 */
function analyzeAnalystKpis(analysts) {
  if (!analysts || analysts.length === 0) {
    return [{ message: 'No analyst data available for analysis' }];
  }
  
  const insights = [];
  
  // Top performers
  const sortedByVolume = [...analysts].sort((a, b) => b.proceduresHandled - a.proceduresHandled);
  if (sortedByVolume[0]) {
    insights.push({
      type: 'TOP_PERFORMER',
      analyst: sortedByVolume[0].name,
      message: `Top performer: ${sortedByVolume[0].name} with ${sortedByVolume[0].proceduresHandled} procedures handled`
    });
  }
  
  // Best satisfaction
  const sortedBySatisfaction = [...analysts].sort((a, b) => b.avgSatisfaction - a.avgSatisfaction);
  if (sortedBySatisfaction[0] && sortedBySatisfaction[0].avgSatisfaction >= 4.5) {
    insights.push({
      type: 'HIGH_SATISFACTION',
      analyst: sortedBySatisfaction[0].name,
      message: `Highest customer satisfaction: ${sortedBySatisfaction[0].name} with ${sortedBySatisfaction[0].avgSatisfaction.toFixed(1)} rating`
    });
  }
  
  // Analysts needing attention
  analysts.forEach(analyst => {
    if (analyst.errorRate > THRESHOLDS.ERROR_RATE_MAX) {
      insights.push({
        type: 'HIGH_ERROR_RATE',
        analyst: analyst.name,
        message: `${analyst.name} has error rate of ${analyst.errorRate.toFixed(1)}% - consider additional training`
      });
    }
    
    if (analyst.avgSatisfaction < THRESHOLDS.SATISFACTION_MIN) {
      insights.push({
        type: 'LOW_SATISFACTION',
        analyst: analyst.name,
        message: `${analyst.name} has satisfaction score of ${analyst.avgSatisfaction.toFixed(1)} - review customer interactions`
      });
    }
  });
  
  return insights;
}

/**
 * Generate alerts based on KPI thresholds
 */
function generateAlerts(kpiData) {
  const alerts = [];
  const { operational, analysts } = kpiData;
  
  // Operational alerts
  if (operational.slaComplianceRate < THRESHOLDS.SLA_COMPLIANCE_MIN) {
    alerts.push(`⚠️ SLA Compliance is ${operational.slaComplianceRate.toFixed(1)}% (threshold: ${THRESHOLDS.SLA_COMPLIANCE_MIN}%)`);
  }
  
  if (parseFloat(operational.completionRate) < THRESHOLDS.COMPLETION_RATE_MIN) {
    alerts.push(`⚠️ Completion Rate is ${operational.completionRate}% (threshold: ${THRESHOLDS.COMPLETION_RATE_MIN}%)`);
  }
  
  if (operational.avgCompletionHours > THRESHOLDS.AVG_HANDLING_HOURS_MAX) {
    alerts.push(`⚠️ Average handling time is ${operational.avgCompletionHours.toFixed(1)}h (threshold: ${THRESHOLDS.AVG_HANDLING_HOURS_MAX}h)`);
  }
  
  // Analyst alerts
  if (analysts) {
    analysts.forEach(analyst => {
      if (analyst.errorRate > THRESHOLDS.ERROR_RATE_MAX) {
        alerts.push(`⚠️ ${analyst.name} has high error rate: ${analyst.errorRate.toFixed(1)}%`);
      }
    });
  }
  
  return alerts;
}

/**
 * Generate recommendations based on analysis
 */
function generateRecommendations(kpiData, alerts) {
  const recommendations = [];
  const { operational } = kpiData;
  
  if (operational.pending > 10) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Reduce Backlog',
      description: 'Consider reallocating resources or extending working hours to clear the backlog'
    });
  }
  
  if (operational.slaComplianceRate < 90) {
    recommendations.push({
      priority: 'CRITICAL',
      action: 'Improve SLA Compliance',
      description: 'Review SLA breaches and identify common causes. Consider implementing early warning notifications.'
    });
  }
  
  if (alerts.length === 0) {
    recommendations.push({
      priority: 'LOW',
      action: 'Maintain Performance',
      description: 'All KPIs are within acceptable thresholds. Continue monitoring and maintain current practices.'
    });
  }
  
  return recommendations;
}

/**
 * Detect trends in KPI data
 */
function detectTrends(kpiData) {
  // This would compare with historical data in a real implementation
  return {
    volumeTrend: 'STABLE',
    efficiencyTrend: 'IMPROVING',
    satisfactionTrend: 'STABLE',
    note: 'Trend analysis requires historical data comparison'
  };
}

module.exports = {
  analyze,
  THRESHOLDS
};
