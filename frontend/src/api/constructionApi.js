import { request } from './apiClient';

export const constructionApi = {
  // 1. Dashboard & Daily Site Assistant
  chatDailyAssistant: async ({ query, projectName, userRole, activePhase, file }) => {
    const formData = new FormData();
    formData.append('query', query);
    if (projectName) formData.append('project_name', projectName);
    if (userRole) formData.append('user_role', userRole);
    if (activePhase) formData.append('active_phase', activePhase);
    if (file) formData.append('file', file);

    return request('/assistant/chat', {
      method: 'POST',
      body: formData,
    });
  },

  // 2. Safety Monitoring & Hazard Detection
  auditSafety: async ({ file, siteLocation, priority }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (siteLocation) formData.append('site_location', siteLocation);
    if (priority) formData.append('inspection_priority', priority);

    return request('/safety/audit', {
      method: 'POST',
      body: formData,
    });
  },

  // 3. Crack Detection & Structural Analysis
  analyzeCrack: async ({ file, elementType, ageOfStructure }) => {
    const formData = new FormData();
    formData.append('file', file);
    if (elementType) formData.append('element_type', elementType);
    if (ageOfStructure) formData.append('age_of_structure', ageOfStructure);

    return request('/structural/analyze-crack', {
      method: 'POST',
      body: formData,
    });
  },

  // 4. Construction Project Planning
  generateProjectPlan: async (planData) => {
    return request('/planning/generate-plan', {
      method: 'POST',
      body: JSON.stringify(planData),
    });
  },

  // 5. Weather-Aware Advisory
  evaluateWeather: async (weatherData) => {
    return request('/weather/evaluate', {
      method: 'POST',
      body: JSON.stringify(weatherData),
    });
  },

  // 6. Real Estate Valuation
  estimateValuation: async (valuationData) => {
    return request('/valuation/estimate', {
      method: 'POST',
      body: JSON.stringify(valuationData),
    });
  },

  // 7. Knowledge Base & Compliance Assistant (RAG)
  queryCompliance: async (complianceData) => {
    return request('/compliance/query', {
      method: 'POST',
      body: JSON.stringify(complianceData),
    });
  },

  // System Health & Configuration
  getHealth: async () => {
    return request('/health');
  },

  updateConfigKeys: async ({ geminiApiKey, openaiApiKey, aiProvider }) => {
    return request('/config/keys', {
      method: 'POST',
      body: JSON.stringify({
        gemini_api_key: geminiApiKey,
        openai_api_key: openaiApiKey,
        ai_provider: aiProvider,
      }),
    });
  },
};
