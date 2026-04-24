export const FEATURES = [
  {
    key: 'chemistry-experiments',
    name: 'Chemistry Lab',
    icon: '⚗️',
    description: 'Virtual chemistry experiments with AI-powered reaction analysis',
    apiPath: '/chemistry-experiments',
    aiEndpoint: '/ai/chemistry/analyze',
    aiLabel: 'Analyze Experiment',
    columns: ['name', 'category', 'difficulty', 'safetyLevel', 'estimatedTime'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'reactants', label: 'Reactants', type: 'text' },
      { key: 'products', label: 'Products', type: 'text' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'safetyLevel', label: 'Safety Level', type: 'text' },
      { key: 'estimatedTime', label: 'Estimated Time', type: 'text' }
    ],
    detailFields: ['name', 'description', 'reactants', 'products', 'difficulty', 'category', 'safetyLevel', 'estimatedTime']
  },
  {
    key: 'physics-simulations',
    name: 'Physics Lab',
    icon: '⚡',
    description: 'Interactive physics simulations with AI explanations',
    apiPath: '/physics-simulations',
    aiEndpoint: '/ai/physics/explain',
    aiLabel: 'Explain Physics',
    columns: ['name', 'category', 'difficulty', 'formula', 'estimatedTime'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'parameters', label: 'Parameters', type: 'text' },
      { key: 'formula', label: 'Formula', type: 'text' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
      { key: 'estimatedTime', label: 'Estimated Time', type: 'text' }
    ],
    detailFields: ['name', 'description', 'category', 'parameters', 'formula', 'difficulty', 'estimatedTime']
  },
  {
    key: 'biology-labs',
    name: 'Biology Lab',
    icon: '🧬',
    description: 'Virtual biology experiments with AI lab guides',
    apiPath: '/biology-labs',
    aiEndpoint: '/ai/biology/guide',
    aiLabel: 'AI Lab Guide',
    columns: ['name', 'organism', 'labType', 'difficulty'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'organism', label: 'Organism', type: 'text' },
      { key: 'labType', label: 'Lab Type', type: 'text' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
      { key: 'equipment', label: 'Equipment', type: 'textarea', fullWidth: true },
      { key: 'procedures', label: 'Procedures', type: 'textarea', fullWidth: true }
    ],
    detailFields: ['name', 'description', 'organism', 'labType', 'difficulty', 'equipment', 'procedures']
  },
  {
    key: 'lab-equipment',
    name: 'Lab Equipment',
    icon: '🔧',
    description: 'Virtual lab equipment catalog with AI operating guides',
    apiPath: '/lab-equipment',
    aiEndpoint: '/ai/equipment/guide',
    aiLabel: 'Equipment Guide',
    columns: ['name', 'category', 'manufacturer', 'status', 'location'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'manufacturer', label: 'Manufacturer', type: 'text' },
      { key: 'modelNumber', label: 'Model Number', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['available', 'in-use', 'maintenance', 'retired'] },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'virtualAvailable', label: 'Virtual Available', type: 'select', options: ['true', 'false'] }
    ],
    detailFields: ['name', 'description', 'category', 'manufacturer', 'modelNumber', 'status', 'location', 'virtualAvailable']
  },
  {
    key: 'lab-reports',
    name: 'Lab Reports',
    icon: '📝',
    description: 'AI-powered lab report review and grading',
    apiPath: '/lab-reports',
    aiEndpoint: '/ai/report/review',
    aiLabel: 'AI Review',
    columns: ['title', 'studentName', 'subject', 'grade'],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'studentName', label: 'Student Name', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'hypothesis', label: 'Hypothesis', type: 'textarea', fullWidth: true },
      { key: 'methodology', label: 'Methodology', type: 'textarea', fullWidth: true },
      { key: 'results', label: 'Results', type: 'textarea', fullWidth: true },
      { key: 'conclusion', label: 'Conclusion', type: 'textarea', fullWidth: true },
      { key: 'grade', label: 'Grade', type: 'text' }
    ],
    detailFields: ['title', 'studentName', 'subject', 'hypothesis', 'methodology', 'results', 'conclusion', 'grade']
  },
  {
    key: 'safety-training',
    name: 'Safety Training',
    icon: '🛡️',
    description: 'Lab safety training with AI-generated scenarios',
    apiPath: '/safety-training',
    aiEndpoint: '/ai/safety/scenario',
    aiLabel: 'Generate Scenario',
    columns: ['title', 'category', 'hazardType', 'passingScore'],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'hazardType', label: 'Hazard Type', type: 'text' },
      { key: 'procedures', label: 'Procedures', type: 'textarea', fullWidth: true },
      { key: 'passingScore', label: 'Passing Score', type: 'number' }
    ],
    detailFields: ['title', 'description', 'category', 'hazardType', 'procedures', 'passingScore']
  },
  {
    key: 'student-progress',
    name: 'Student Progress',
    icon: '📈',
    description: 'Track and analyze student performance with AI recommendations',
    apiPath: '/student-progress',
    aiEndpoint: '/ai/progress/recommend',
    aiLabel: 'AI Recommendations',
    columns: ['studentName', 'course', 'completedLabs', 'averageScore'],
    fields: [
      { key: 'studentName', label: 'Student Name', type: 'text', required: true },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'course', label: 'Course', type: 'text' },
      { key: 'completedLabs', label: 'Completed Labs', type: 'number' },
      { key: 'totalLabs', label: 'Total Labs', type: 'number' },
      { key: 'averageScore', label: 'Average Score', type: 'number' },
      { key: 'strengths', label: 'Strengths', type: 'textarea', fullWidth: true },
      { key: 'improvements', label: 'Improvements', type: 'textarea', fullWidth: true }
    ],
    detailFields: ['studentName', 'email', 'course', 'completedLabs', 'totalLabs', 'averageScore', 'strengths', 'improvements']
  },
  {
    key: 'data-analysis',
    name: 'Data Analysis',
    icon: '📊',
    description: 'Statistical data analysis with AI-powered insights',
    apiPath: '/data-analysis',
    aiEndpoint: '/ai/analysis/insights',
    aiLabel: 'AI Insights',
    columns: ['title', 'dataType', 'method', 'visualization'],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'dataType', label: 'Data Type', type: 'text' },
      { key: 'dataset', label: 'Dataset', type: 'textarea', fullWidth: true },
      { key: 'method', label: 'Method', type: 'text' },
      { key: 'results', label: 'Results', type: 'textarea', fullWidth: true },
      { key: 'visualization', label: 'Visualization', type: 'text' }
    ],
    detailFields: ['title', 'description', 'dataType', 'dataset', 'method', 'results', 'visualization']
  },
  {
    key: 'molecular-structures',
    name: 'Molecular Viewer',
    icon: '🔮',
    description: 'Explore molecular structures with AI descriptions',
    apiPath: '/molecular-structures',
    aiEndpoint: '/ai/molecular/describe',
    aiLabel: 'AI Description',
    columns: ['name', 'formula', 'molecularWeight', 'category', 'bondType'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'formula', label: 'Formula', type: 'text' },
      { key: 'molecularWeight', label: 'Molecular Weight', type: 'number' },
      { key: 'structure', label: 'Structure', type: 'textarea', fullWidth: true },
      { key: 'category', label: 'Category', type: 'text' },
      { key: 'bondType', label: 'Bond Type', type: 'text' },
      { key: 'properties', label: 'Properties', type: 'textarea', fullWidth: true }
    ],
    detailFields: ['name', 'formula', 'molecularWeight', 'structure', 'category', 'bondType', 'properties']
  },
  {
    key: 'assessments',
    name: 'Assessments',
    icon: '✅',
    description: 'AI-generated assessments and grading tools',
    apiPath: '/assessments',
    aiEndpoint: '/ai/assessment/generate',
    aiLabel: 'Generate Questions',
    columns: ['title', 'subject', 'type', 'difficulty', 'duration'],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'type', label: 'Type', type: 'text' },
      { key: 'questions', label: 'Questions', type: 'textarea', fullWidth: true },
      { key: 'maxScore', label: 'Max Score', type: 'number' },
      { key: 'duration', label: 'Duration', type: 'text' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'] },
      { key: 'aiGenerated', label: 'AI Generated', type: 'select', options: ['true', 'false'] }
    ],
    detailFields: ['title', 'subject', 'type', 'questions', 'maxScore', 'duration', 'difficulty', 'aiGenerated']
  },
  {
    key: 'collaborations',
    name: 'Collaborations',
    icon: '👥',
    description: 'Collaborative research projects with AI guidance',
    apiPath: '/collaborations',
    aiEndpoint: '/ai/collaboration/suggest',
    aiLabel: 'AI Project Plan',
    columns: ['projectName', 'subject', 'status', 'deadline'],
    fields: [
      { key: 'projectName', label: 'Project Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'members', label: 'Members', type: 'text' },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['planning', 'in-progress', 'review', 'completed'] },
      { key: 'deadline', label: 'Deadline', type: 'date' },
      { key: 'notes', label: 'Notes', type: 'textarea', fullWidth: true }
    ],
    detailFields: ['projectName', 'description', 'members', 'subject', 'status', 'deadline', 'notes']
  },
  {
    key: 'lab-schedules',
    name: 'Lab Schedules',
    icon: '📅',
    description: 'Lab session scheduling with AI optimization',
    apiPath: '/lab-schedules',
    aiEndpoint: '/ai/schedule/optimize',
    aiLabel: 'Optimize Session',
    columns: ['labName', 'instructor', 'date', 'startTime', 'room', 'status'],
    fields: [
      { key: 'labName', label: 'Lab Name', type: 'text', required: true },
      { key: 'instructor', label: 'Instructor', type: 'text' },
      { key: 'date', label: 'Date', type: 'date' },
      { key: 'startTime', label: 'Start Time', type: 'text' },
      { key: 'endTime', label: 'End Time', type: 'text' },
      { key: 'room', label: 'Room', type: 'text' },
      { key: 'capacity', label: 'Capacity', type: 'number' },
      { key: 'enrolled', label: 'Enrolled', type: 'number' },
      { key: 'status', label: 'Status', type: 'select', options: ['scheduled', 'in-progress', 'completed', 'cancelled'] }
    ],
    detailFields: ['labName', 'instructor', 'date', 'startTime', 'endTime', 'room', 'capacity', 'enrolled', 'status']
  },
  {
    key: 'research-papers',
    name: 'Research Papers',
    icon: '📄',
    description: 'AI-assisted research paper writing and review',
    apiPath: '/research-papers',
    aiEndpoint: '/ai/research/assist',
    aiLabel: 'AI Writing Assist',
    columns: ['title', 'authors', 'subject', 'status', 'journal'],
    fields: [
      { key: 'title', label: 'Title', type: 'text', required: true },
      { key: 'authors', label: 'Authors', type: 'text' },
      { key: 'abstract', label: 'Abstract', type: 'textarea', fullWidth: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'keywords', label: 'Keywords', type: 'text' },
      { key: 'status', label: 'Status', type: 'select', options: ['draft', 'review', 'published'] },
      { key: 'journal', label: 'Journal', type: 'text' }
    ],
    detailFields: ['title', 'authors', 'abstract', 'subject', 'keywords', 'status', 'journal']
  },
  {
    key: 'virtual-lab-sessions',
    name: 'Virtual Labs',
    icon: '🖥️',
    description: 'Interactive virtual lab sessions with AI guidance',
    apiPath: '/virtual-lab-sessions',
    aiEndpoint: '/ai/virtual-lab/guidance',
    aiLabel: 'AI Guidance',
    columns: ['name', 'subject', 'labType', 'difficulty', 'duration'],
    fields: [
      { key: 'name', label: 'Name', type: 'text', required: true },
      { key: 'description', label: 'Description', type: 'textarea', fullWidth: true },
      { key: 'subject', label: 'Subject', type: 'text' },
      { key: 'labType', label: 'Lab Type', type: 'text' },
      { key: 'objectives', label: 'Objectives', type: 'textarea', fullWidth: true },
      { key: 'instructions', label: 'Instructions', type: 'textarea', fullWidth: true },
      { key: 'duration', label: 'Duration', type: 'text' },
      { key: 'difficulty', label: 'Difficulty', type: 'select', options: ['beginner', 'intermediate', 'advanced'] }
    ],
    detailFields: ['name', 'description', 'subject', 'labType', 'objectives', 'instructions', 'duration', 'difficulty']
  }
];
