const express = require('express');
const auth = require('../middleware/auth');
const { queryOpenRouter } = require('../utils/openrouter');
const router = express.Router();

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
    res.json(result);
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
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Assessment AI - Generate questions
router.post('/assessment/generate', auth, async (req, res) => {
  try {
    const { subject, type, difficulty, topic } = req.body;
    const prompt = `Generate an assessment for:
    Subject: ${subject}
    Type: ${type}
    Difficulty: ${difficulty}
    Topic: ${topic || 'General'}

    Please provide:
    1. 5 multiple-choice questions with 4 options each (mark correct answer)
    2. 3 short-answer questions
    3. 2 problem-solving questions
    4. Answer key with explanations
    5. Grading rubric
    6. Estimated completion time`;
    const result = await queryOpenRouter(prompt, 'You are an expert educator creating fair and comprehensive assessments.');
    res.json(result);
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
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
