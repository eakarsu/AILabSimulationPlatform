const express = require('express');
const auth = require('../middleware/auth');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { queryOpenRouter } = require('../utils/openrouter');
const models = require('../models');
const { Assessment, AssessmentAttempt, AiResult, LabReport } = models;
const router = express.Router();

// Apply rate limiter to all AI routes
router.use(aiRateLimiter);

// Helper: parse JSON from AI text responses
function parseAIJson(text) {
  try { return JSON.parse(text); } catch (e) {}
  const stripped = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim();
  try { return JSON.parse(stripped); } catch (e) {}
  const start = text.indexOf('{'); const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1) { try { return JSON.parse(text.slice(start, end + 1)); } catch (e) {} }
  return null;
}

// Helper: persist AI result
async function saveAiResult(userId, endpoint, inputData, result, parsedResult) {
  try {
    await AiResult.create({ userId, endpoint, inputData, result, parsedResult });
  } catch (e) {
    console.error('Failed to save AI result:', e.message);
  }
}

// Chemistry AI - Analyze experiment
router.post('/chemistry/analyze', auth, async (req, res) => {
  try {
    const { name, reactants, products, description } = req.body;
    const prompt = `As a chemistry professor, provide a detailed analysis of this experiment:
    Experiment: ${name}
    Description: ${description}
    Reactants: ${reactants}
    Products: ${products}

    Please provide:
    1. Balanced chemical equation
    2. Reaction type and mechanism
    3. Safety considerations
    4. Expected observations
    5. Common errors students make
    6. Real-world applications`;
    const result = await queryOpenRouter(prompt, 'You are an expert chemistry professor helping students understand chemical reactions and experiments.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/chemistry/analyze', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Physics AI - Explain simulation
router.post('/physics/explain', auth, async (req, res) => {
  try {
    const { name, category, formula, parameters } = req.body;
    const prompt = `As a physics professor, explain this simulation in detail:
    Simulation: ${name}
    Category: ${category}
    Key Formula: ${formula}
    Parameters: ${parameters}

    Please provide:
    1. Underlying physics principles
    2. Mathematical derivation of the key formula
    3. How each parameter affects the outcome
    4. Real-world examples
    5. Common misconceptions
    6. Suggested experiments to verify`;
    const result = await queryOpenRouter(prompt, 'You are an expert physics professor helping students understand physical phenomena through simulations.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/physics/explain', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Biology AI - Lab guide
router.post('/biology/guide', auth, async (req, res) => {
  try {
    const { name, organism, labType, procedures } = req.body;
    const prompt = `As a biology professor, provide guidance for this lab:
    Lab: ${name}
    Organism: ${organism}
    Type: ${labType}
    Procedures: ${procedures}

    Please provide:
    1. Detailed step-by-step protocol
    2. Expected results and what to look for
    3. Troubleshooting common problems
    4. Safety precautions specific to this organism
    5. Discussion questions for students
    6. Extension activities`;
    const result = await queryOpenRouter(prompt, 'You are an expert biology professor guiding students through laboratory experiments.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/biology/guide', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lab Report AI - Review
router.post('/report/review', auth, async (req, res) => {
  try {
    const { title, hypothesis, methodology, results, conclusion } = req.body;
    const prompt = `As a science instructor, review this lab report:
    Title: ${title}
    Hypothesis: ${hypothesis}
    Methodology: ${methodology}
    Results: ${results}
    Conclusion: ${conclusion}

    Please provide:
    1. Overall quality assessment (A-F grade recommendation)
    2. Strengths of the report
    3. Areas for improvement
    4. Scientific accuracy check
    5. Suggestions for better data presentation
    6. Writing quality feedback`;
    const result = await queryOpenRouter(prompt, 'You are a meticulous science instructor who provides constructive feedback on lab reports.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/report/review', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lab Report AI - Rubric grader
router.post('/report/rubric-grade', auth, async (req, res) => {
  try {
    const { reportId } = req.body;
    const report = await LabReport.findByPk(reportId);
    if (!report) return res.status(404).json({ error: 'Lab report not found' });

    const content = [
      report.hypothesis ? `Hypothesis: ${report.hypothesis}` : '',
      report.methodology ? `Methods: ${report.methodology}` : '',
      report.results ? `Data/Results: ${report.results}` : '',
      report.conclusion ? `Conclusion: ${report.conclusion}` : '',
    ].filter(Boolean).join('\n\n');

    const prompt = `Grade this lab report against the standard rubric. Sections: Hypothesis(20pts), Methods(20pts), Data Collection(20pts), Analysis(20pts), Conclusion(20pts). Report content: ${content}. Return JSON: { hypothesis_score, methods_score, data_collection_score, analysis_score, conclusion_score, total_score, feedback_by_section: {hypothesis, methods, data_collection, analysis, conclusion}, overall_feedback }`;

    const result = await queryOpenRouter(prompt, 'You are a meticulous science instructor grading lab reports against a standard rubric. Return only valid JSON.');
    const parsed = parseAIJson(result.content);

    if (parsed) {
      await report.update({ gradingResult: parsed });
    }
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/report/rubric-grade', { reportId }, result.content, parsed);

    res.json(parsed || { raw: result.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Safety AI - Generate scenario
router.post('/safety/scenario', auth, async (req, res) => {
  try {
    const { title, hazardType, category } = req.body;
    const prompt = `Create a detailed safety training scenario for:
    Topic: ${title}
    Hazard Type: ${hazardType}
    Category: ${category}

    Please provide:
    1. A realistic emergency scenario (2-3 paragraphs)
    2. Step-by-step correct response procedure
    3. Common mistakes people make in this situation
    4. Prevention strategies
    5. A 5-question multiple-choice quiz about this scenario
    6. Key takeaways`;
    const result = await queryOpenRouter(prompt, 'You are a laboratory safety expert creating training materials for university students.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/safety/scenario', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Equipment AI - Virtual guide
router.post('/equipment/guide', auth, async (req, res) => {
  try {
    const { name, category, description } = req.body;
    const prompt = `As a lab technician expert, provide a comprehensive guide for:
    Equipment: ${name}
    Category: ${category}
    Description: ${description}

    Please provide:
    1. How to properly set up this equipment
    2. Calibration procedures
    3. Step-by-step operating instructions
    4. Maintenance schedule and procedures
    5. Common troubleshooting issues and solutions
    6. Safety precautions when using this equipment`;
    const result = await queryOpenRouter(prompt, 'You are an experienced laboratory technician who trains students on equipment use.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/equipment/guide', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Student Progress AI - Recommendations
router.post('/progress/recommend', auth, async (req, res) => {
  try {
    const { studentName, course, completedLabs, totalLabs, averageScore, strengths, improvements } = req.body;
    const prompt = `As an academic advisor, provide personalized recommendations:
    Student: ${studentName}
    Course: ${course}
    Progress: ${completedLabs}/${totalLabs} labs completed
    Average Score: ${averageScore}%
    Strengths: ${strengths}
    Areas for Improvement: ${improvements}

    Please provide:
    1. Performance summary
    2. Specific study recommendations
    3. Suggested labs to focus on next
    4. Learning resources recommendations
    5. Time management tips
    6. Motivation and encouragement`;
    const result = await queryOpenRouter(prompt, 'You are a supportive academic advisor helping students improve their laboratory performance.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/progress/recommend', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Data Analysis AI - Insights
router.post('/analysis/insights', auth, async (req, res) => {
  try {
    const { title, dataType, dataset, method, results } = req.body;
    const prompt = `As a data science expert, provide insights for this analysis:
    Title: ${title}
    Data Type: ${dataType}
    Dataset: ${dataset}
    Method: ${method}
    Results: ${results}

    Please provide:
    1. Interpretation of results
    2. Statistical significance assessment
    3. Potential sources of error
    4. Alternative analysis methods
    5. Visualization recommendations
    6. Conclusions and next steps`;
    const result = await queryOpenRouter(prompt, 'You are a data science expert helping students interpret their experimental data.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/analysis/insights', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Molecular AI - Describe structure
router.post('/molecular/describe', auth, async (req, res) => {
  try {
    const { name, formula, category, bondType, properties } = req.body;
    const prompt = `As a chemistry expert, describe this molecule in detail:
    Molecule: ${name}
    Formula: ${formula}
    Category: ${category}
    Bond Type: ${bondType}
    Properties: ${properties}

    Please provide:
    1. Detailed structural description
    2. 3D geometry and bond angles
    3. Electronic structure and hybridization
    4. Physical and chemical properties explained
    5. Biological significance (if applicable)
    6. Industrial/pharmaceutical applications`;
    const result = await queryOpenRouter(prompt, 'You are a structural chemistry expert explaining molecular structures to students.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/molecular/describe', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assessment AI - Generate questions (structured JSON output)
router.post('/assessment/generate', auth, async (req, res) => {
  try {
    const { subject, type, difficulty, topic } = req.body;
    const prompt = `Generate a ${type} assessment for ${topic || 'General'} at ${difficulty} level. Return ONLY valid JSON: { questions: [{question, options: [A,B,C,D], correct_answer, explanation, points}], total_points, estimated_minutes }`;
    const result = await queryOpenRouter(prompt, 'You are an expert educator creating fair and comprehensive assessments. Return only valid JSON, no other text.');
    const parsed = parseAIJson(result.content);

    let assessment = null;
    if (parsed && parsed.questions) {
      assessment = await Assessment.create({
        title: `AI Generated: ${topic || type} - ${difficulty}`,
        subject: subject || topic,
        type,
        difficulty,
        questions: parsed.questions,
        totalPoints: parsed.total_points || 100,
        estimatedMinutes: parsed.estimated_minutes,
        maxScore: parsed.total_points || 100,
        aiGenerated: true
      });
    }
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/assessment/generate', req.body, result.content, parsed);
    res.json({ content: result.content, parsed, assessment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Collaboration AI - Project suggestions
router.post('/collaboration/suggest', auth, async (req, res) => {
  try {
    const { projectName, subject, description, members } = req.body;
    const prompt = `As a research advisor, provide guidance for this collaborative project:
    Project: ${projectName}
    Subject: ${subject}
    Description: ${description}
    Team Members: ${members}

    Please provide:
    1. Detailed project plan with milestones
    2. Role assignments for team members
    3. Research methodology recommendations
    4. Required resources and materials
    5. Timeline with weekly goals
    6. Presentation and reporting guidelines`;
    const result = await queryOpenRouter(prompt, 'You are a research advisor helping student teams plan and execute collaborative projects.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/collaboration/suggest', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Research Paper AI - Assist
router.post('/research/assist', auth, async (req, res) => {
  try {
    const { title, subject, abstract, keywords } = req.body;
    const prompt = `As a research writing expert, assist with this paper:
    Title: ${title}
    Subject: ${subject}
    Abstract: ${abstract}
    Keywords: ${keywords}

    Please provide:
    1. Suggested outline for the paper
    2. Key literature to review
    3. Methodology recommendations
    4. Data presentation suggestions
    5. Writing tips for each section
    6. Common pitfalls to avoid in this field`;
    const result = await queryOpenRouter(prompt, 'You are a research writing expert helping students write publication-quality papers.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/research/assist', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Virtual Lab AI - Guidance
router.post('/virtual-lab/guidance', auth, async (req, res) => {
  try {
    const { name, subject, objectives, instructions } = req.body;
    const prompt = `As a virtual lab instructor, provide guidance:
    Lab: ${name}
    Subject: ${subject}
    Objectives: ${objectives}
    Instructions: ${instructions}

    Please provide:
    1. Pre-lab preparation checklist
    2. Detailed walkthrough of the virtual experiment
    3. Key observations to note
    4. Data recording template
    5. Post-lab analysis questions
    6. Connection to real-world applications`;
    const result = await queryOpenRouter(prompt, 'You are a virtual lab instructor helping students get the most out of their virtual laboratory experience.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/virtual-lab/guidance', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lab Schedule AI - Optimize
router.post('/schedule/optimize', auth, async (req, res) => {
  try {
    const { labName, instructor, capacity, enrolled, date, startTime, endTime } = req.body;
    const prompt = `As a lab coordinator, optimize this lab session:
    Lab: ${labName}
    Instructor: ${instructor}
    Date: ${date}, ${startTime} - ${endTime}
    Capacity: ${capacity}, Enrolled: ${enrolled}

    Please provide:
    1. Session preparation checklist
    2. Equipment setup requirements
    3. Time management plan for the session
    4. Group organization suggestions
    5. Contingency plans for common issues
    6. Post-session cleanup and documentation`;
    const result = await queryOpenRouter(prompt, 'You are a laboratory coordinator optimizing lab session efficiency and student experience.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/schedule/optimize', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// General AI Assistant
router.post('/assistant', auth, async (req, res) => {
  try {
    const { question, context } = req.body;
    const prompt = `Student question: ${question}
    ${context ? `Context: ${context}` : ''}

    Please provide a helpful, educational response.`;
    const result = await queryOpenRouter(prompt, 'You are an AI lab assistant for a university science education platform. Provide clear, accurate, and educational responses.');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/assistant', req.body, result.content, null);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET AI Results - paginated history for current user
router.get('/results', auth, async (req, res) => {
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

// AI: Student misconception detector
router.post('/student/misconception-detector', auth, async (req, res) => {
  try {
    const { subject, submission, expected_answer, common_misconceptions } = req.body;
    if (!submission) return res.status(400).json({ error: 'submission required' });

    const prompt = `As a STEM education researcher, examine this student submission and identify likely misconceptions, error patterns, and remediation steps.

Subject: ${subject || 'general STEM'}
Expected answer / target understanding: ${expected_answer || 'not provided'}
Known common misconceptions for this topic: ${common_misconceptions || 'use your domain knowledge'}

Student submission:
${submission}

Return JSON only:
{
  "misconceptions_detected": [
    { "name": string, "evidence_in_submission": string, "category": "conceptual|procedural|notational|safety|other", "severity": "low|medium|high" }
  ],
  "error_patterns": string[],
  "correct_understanding_summary": string,
  "remediation_steps": string[],
  "follow_up_questions_to_ask_student": string[],
  "suggested_practice_problems": string[],
  "confidence_0_100": number
}`;

    const result = await queryOpenRouter(prompt, 'You are a STEM misconception researcher. Return JSON only.');
    const parsed = parseAIJson(result.content || '');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/student/misconception-detector', req.body, result.content, parsed);
    res.json({ ...result, parsed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI: Real-time safety monitor (advisory; no autonomous control)
router.post('/safety/realtime-monitor', auth, async (req, res) => {
  try {
    const { experiment, current_step, observations, last_actions } = req.body;
    if (!current_step) return res.status(400).json({ error: 'current_step required' });

    const prompt = `As a lab safety officer, evaluate the current state of an in-progress experiment for safety risks. Recommend whether to continue, pause, or stop.

Experiment: ${experiment || 'unspecified'}
Current step: ${current_step}
Observations / sensor data: ${observations || 'none provided'}
Recent student actions: ${last_actions || 'unspecified'}

Return JSON only:
{
  "risk_level": "none|low|moderate|high|critical",
  "violations_detected": [{ "violation": string, "category": "ppe|fire|chemical|electrical|biohazard|procedure|other", "severity": "low|medium|high|critical" }],
  "recommended_action": "continue|warn|pause|stop|evacuate",
  "specific_instructions": string[],
  "rationale": string,
  "confidence_0_100": number,
  "disclaimer": "Advisory only; final safety decisions rest with the supervising instructor."
}`;

    const result = await queryOpenRouter(prompt, 'You are a lab safety officer AI. Be conservative when uncertain. Return JSON only.');
    const parsed = parseAIJson(result.content || '');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/safety/realtime-monitor', req.body, result.content, parsed);
    res.json({ ...result, parsed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// AI: Lab equipment predictor (recommend equipment for an experiment type)
router.post('/equipment/predict', auth, async (req, res) => {
  try {
    const { experiment_type, learning_objectives, student_count, budget, constraints } = req.body;
    if (!experiment_type) return res.status(400).json({ error: 'experiment_type required' });

    const prompt = `As a lab manager, predict the equipment, consumables, and PPE needed to run this experiment. Account for student count, budget, and constraints.

Experiment type: ${experiment_type}
Learning objectives: ${learning_objectives || 'unspecified'}
Student count: ${student_count || 'unspecified'}
Budget: ${budget || 'flexible'}
Constraints: ${constraints || 'none'}

Return JSON only:
{
  "equipment": [{ "item": string, "quantity": number, "rationale": string, "estimated_cost_usd": number }],
  "consumables": [{ "item": string, "quantity": number, "estimated_cost_usd": number }],
  "ppe": [string],
  "alternatives_for_low_budget": [{ "instead_of": string, "use": string, "tradeoffs": string }],
  "preparation_time_minutes": number,
  "safety_notes": [string],
  "summary": string
}`;

    const result = await queryOpenRouter(prompt, 'You are a school / university lab manager AI. Return JSON only.');
    const parsed = parseAIJson(result.content || '');
    await saveAiResult(req.user?.id || req.user?.userId, '/ai/equipment/predict', req.body, result.content, parsed);
    res.json({ ...result, parsed });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
