// Mock data for FileClerkAI Dashboard

export const mockDocuments = [
  {
    id: 1,
    name: 'ACME Corp Contract - Q4 2024',
    type: 'pdf',
    category: 'contracts',
    status: 'approved',
    lastModified: '2024-10-15',
    tags: ['signed', 'quarterly', 'acme', 'urgent'],
    size: '2.4 MB',
    content: 'Contract details for ACME Corp quarterly agreement...'
  },
  {
    id: 2,
    name: 'Invoice_VendorA_001',
    type: 'pdf',
    category: 'invoices',
    status: 'pending',
    lastModified: '2024-12-01',
    tags: ['vendor-a', 'q4', 'pending signature'],
    size: '1.2 MB',
    content: 'Invoice from Vendor A for services rendered...'
  },
  {
    id: 3,
    name: 'Invoice_VendorA_002',
    type: 'pdf',
    category: 'invoices',
    status: 'pending',
    lastModified: '2024-12-05',
    tags: ['vendor-a', 'q4', 'pending signature'],
    size: '1.1 MB',
    content: 'Second invoice from Vendor A for additional services...'
  },
  {
    id: 4,
    name: 'Invoice_VendorA_003',
    type: 'pdf',
    category: 'invoices',
    status: 'pending',
    lastModified: '2024-12-10',
    tags: ['vendor-a', 'q4', 'pending signature'],
    size: '1.3 MB',
    content: 'Third invoice from Vendor A for monthly services...'
  },
  {
    id: 5,
    name: 'HR Onboarding - John Doe',
    type: 'docx',
    category: 'hr',
    status: 'processed',
    lastModified: '2024-12-01',
    tags: ['onboarding', 'december', 'new hire'],
    size: '0.8 MB',
    content: 'HR onboarding documentation for John Doe...'
  },
  {
    id: 6,
    name: 'HR Onboarding - Jane Smith',
    type: 'docx',
    category: 'hr',
    status: 'processed',
    lastModified: '2024-12-05',
    tags: ['onboarding', 'december', 'new hire'],
    size: '0.9 MB',
    content: 'HR onboarding documentation for Jane Smith...'
  },
  {
    id: 7,
    name: 'Compliance Report Q4',
    type: 'pdf',
    category: 'compliance',
    status: 'urgent',
    lastModified: '2024-11-30',
    tags: ['quarterly', 'compliance', 'review needed'],
    size: '3.1 MB',
    content: 'Quarterly compliance report requiring review...'
  },
  {
    id: 8,
    name: 'Data Protection Policy',
    type: 'pdf',
    category: 'compliance',
    status: 'approved',
    lastModified: '2024-11-15',
    tags: ['policy', 'data protection', 'approved'],
    size: '1.7 MB',
    content: 'Updated data protection policy document...'
  }
];

export const mockActivities = [
  {
    id: 1,
    action: 'Contract Retrieved',
    description: 'Found and retrieved signed contract from October 2024 for ACME Corp based on voice command',
    type: 'retrieved',
    timestamp: '2 minutes ago',
    actor: 'ai',
    fileType: 'PDF',
    files: ['ACME Corp Contract - Q4 2024.pdf'],
    userConfirmation: 'Confirmed as correct document'
  },
  {
    id: 2,
    action: 'Invoices Merged',
    description: 'Successfully merged three most recent invoices from Vendor A into single PDF document',
    type: 'merged',
    timestamp: '15 minutes ago',
    actor: 'ai',
    fileType: 'PDF',
    files: ['Invoice_VendorA_001.pdf', 'Invoice_VendorA_002.pdf', 'Invoice_VendorA_003.pdf'],
    userConfirmation: 'Approved merge operation'
  },
  {
    id: 3,
    action: 'HR Forms Summarized',
    description: 'Created comprehensive summary of all HR onboarding forms signed this month',
    type: 'summarized',
    timestamp: '1 hour ago',
    actor: 'ai',
    fileType: 'DOCX',
    files: ['HR Onboarding - John Doe.docx', 'HR Onboarding - Jane Smith.docx'],
    userConfirmation: 'Summary approved for distribution'
  },
  {
    id: 4,
    action: 'Document Sent',
    description: 'Compliance report sent to regulatory team for review',
    type: 'sent',
    timestamp: '2 hours ago',
    actor: 'user',
    fileType: 'PDF',
    files: ['Compliance Report Q4.pdf']
  },
  {
    id: 5,
    action: 'Contract Retrieved',
    description: 'Located supplier agreement for TechCorp from August 2024',
    type: 'retrieved',
    timestamp: '3 hours ago',
    actor: 'ai',
    fileType: 'PDF',
    files: ['TechCorp Supplier Agreement.pdf']
  }
];

export const mockMemories = [
  {
    id: 1,
    title: 'ACME Corp Contract Summary',
    content: 'Contract signed in October 2024 for quarterly services. Value: $50,000. Auto-renewal clause included. Next review: January 2025.',
    type: 'summary',
    tags: ['acme', 'contract', 'quarterly'],
    timestamp: '2 hours ago',
    starred: true
  },
  {
    id: 2,
    title: 'Monthly Invoice Processing',
    content: 'Standard routine: Find all invoices from current month → Sort by vendor → Merge vendor invoices → Send to accounting',
    type: 'routine',
    tags: ['invoices', 'monthly', 'routine'],
    timestamp: '1 day ago',
    starred: false
  },
  {
    id: 3,
    title: 'HR Onboarding Checklist',
    content: 'All new hires need: Employee handbook signed, IT equipment form, Benefits enrollment, Emergency contact info, Tax forms (W-4, I-9)',
    type: 'bookmark',
    tags: ['hr', 'onboarding', 'checklist'],
    timestamp: '2 days ago',
    starred: true
  },
  {
    id: 4,
    title: 'Compliance Documents Query',
    content: 'Previous search: "Find all compliance documents that need review" returned 12 documents. 8 processed, 4 pending review.',
    type: 'history',
    tags: ['compliance', 'review', 'query'],
    timestamp: '3 days ago',
    starred: false
  },
  {
    id: 5,
    title: 'Vendor A Invoice Pattern',
    content: 'Vendor A typically sends 3 invoices per month. Usually arrive 1st, 5th, and 10th. Average processing time: 2 business days.',
    type: 'summary',
    tags: ['vendor-a', 'invoices', 'pattern'],
    timestamp: '5 days ago',
    starred: false
  },
  {
    id: 6,
    title: 'Document Approval Workflow',
    content: 'Saved workflow: Review document → Check signatures → Verify compliance → Send to stakeholders → Update status → Archive',
    type: 'routine',
    tags: ['approval', 'workflow', 'process'],
    timestamp: '1 week ago',
    starred: true
  }
];

export const mockAnalytics = {
  totalDocuments: 1247,
  documentsProcessed: 89,
  timeSaved: 24.5,
  commandsUsed: 156,
  mostUsedCommands: [
    { command: 'Find contracts', count: 42 },
    { command: 'Merge invoices', count: 38 },
    { command: 'Summarize documents', count: 31 },
    { command: 'Send to team', count: 28 },
    { command: 'Review compliance', count: 17 }
  ],
  weeklyActivity: [
    { day: 'Mon', actions: 23 },
    { day: 'Tue', actions: 31 },
    { day: 'Wed', actions: 18 },
    { day: 'Thu', actions: 42 },
    { day: 'Fri', actions: 35 },
    { day: 'Sat', actions: 8 },
    { day: 'Sun', actions: 5 }
  ],
  fileTypes: [
    { type: 'PDF', count: 687, percentage: 55 },
    { type: 'DOCX', count: 312, percentage: 25 },
    { type: 'XLSX', count: 186, percentage: 15 },
    { type: 'Others', count: 62, percentage: 5 }
  ]
};

export const mockUpcomingTasks = [
  {
    id: 1,
    title: '3 files awaiting signature',
    description: 'Vendor contracts need to be signed by end of week',
    priority: 'high',
    dueDate: '2024-12-15',
    files: ['Contract_VendorB.pdf', 'Contract_VendorC.pdf', 'Service_Agreement.pdf'],
    type: 'signature'
  },
  {
    id: 2,
    title: '2 conflicting file versions flagged',
    description: 'Multiple versions of the same document detected',
    priority: 'medium',
    dueDate: '2024-12-16',
    files: ['Policy_v1.pdf', 'Policy_v2.pdf'],
    type: 'conflict'
  },
  {
    id: 3,
    title: 'Compliance review due',
    description: 'Quarterly compliance documents need review',
    priority: 'high',
    dueDate: '2024-12-20',
    files: ['Q4_Compliance_Report.pdf'],
    type: 'review'
  },
  {
    id: 4,
    title: 'Archive old documents',
    description: '47 documents from 2023 ready for archiving',
    priority: 'low',
    dueDate: '2024-12-31',
    files: [],
    type: 'archive'
  }
];

export const mockAgentActions = [
  {
    id: 1,
    name: 'Summarize',
    description: 'Create AI-powered summary of document content',
    icon: 'FileText',
    category: 'analysis'
  },
  {
    id: 2,
    name: 'Compare',
    description: 'Compare two or more documents for differences',
    icon: 'GitCompare',
    category: 'analysis'
  },
  {
    id: 3,
    name: 'Convert',
    description: 'Convert document to different format',
    icon: 'RefreshCw',
    category: 'transform'
  },
  {
    id: 4,
    name: 'Merge',
    description: 'Combine multiple documents into one',
    icon: 'Merge',
    category: 'transform'
  },
  {
    id: 5,
    name: 'Redact',
    description: 'Remove sensitive information from document',
    icon: 'EyeOff',
    category: 'security'
  },
  {
    id: 6,
    name: 'Send',
    description: 'Share document with team members',
    icon: 'Send',
    category: 'communication'
  },
  {
    id: 7,
    name: 'Extract Data',
    description: 'Extract specific information from document',
    icon: 'Download',
    category: 'analysis'
  },
  {
    id: 8,
    name: 'Translate',
    description: 'Translate document to another language',
    icon: 'Languages',
    category: 'transform'
  }
];