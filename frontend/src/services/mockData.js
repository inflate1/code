// Enhanced mock data for demonstration purposes

export const mockDocuments = [
  {
    id: 1,
    filename: 'acme_contract_q4_2024.pdf',
    original_filename: 'ACME Corp Contract - Q4 2024.pdf',
    file_path: '/mock/storage/acme_contract_q4_2024.pdf',
    file_size: 2457600,
    file_type: 'pdf',
    mime_type: 'application/pdf',
    category: 'contracts',
    status: 'approved',
    tags: ['signed', 'quarterly', 'acme', 'urgent'],
    user_id: 'demo_user',
    created_at: '2024-10-15T10:30:00Z',
    updated_at: '2024-10-15T10:30:00Z',
    extracted_text: 'Contract Agreement between ACME Corp and FileClerk for quarterly services...',
    content_summary: 'Quarterly service agreement with ACME Corp covering Q4 2024 operations.',
    embedding: null
  },
  {
    id: 2,
    filename: 'vendor_a_invoice_001.pdf',
    original_filename: 'Invoice_VendorA_001.pdf',
    file_path: '/mock/storage/vendor_a_invoice_001.pdf',
    file_size: 1228800,
    file_type: 'pdf',
    mime_type: 'application/pdf',
    category: 'invoices',
    status: 'pending',
    tags: ['vendor-a', 'q4', 'pending signature'],
    user_id: 'demo_user',
    created_at: '2024-12-01T14:20:00Z',
    updated_at: '2024-12-01T14:20:00Z',
    extracted_text: 'Invoice from Vendor A for professional services rendered in November 2024...',
    content_summary: 'Professional services invoice from Vendor A for November 2024.',
    embedding: null
  },
  {
    id: 3,
    filename: 'hr_onboarding_john_doe.docx',
    original_filename: 'HR Onboarding - John Doe.docx',
    file_path: '/mock/storage/hr_onboarding_john_doe.docx',
    file_size: 819200,
    file_type: 'docx',
    mime_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    category: 'hr',
    status: 'processed',
    tags: ['onboarding', 'december', 'new hire', 'completed'],
    user_id: 'demo_user',
    created_at: '2024-12-01T09:15:00Z',
    updated_at: '2024-12-01T09:15:00Z',
    extracted_text: 'Employee onboarding documentation for John Doe, Software Engineer...',
    content_summary: 'Complete onboarding documentation for new hire John Doe.',
    embedding: null
  },
  {
    id: 4,
    filename: 'compliance_report_q4.pdf',
    original_filename: 'Compliance Report Q4.pdf',
    file_path: '/mock/storage/compliance_report_q4.pdf',
    file_size: 3145728,
    file_type: 'pdf',
    mime_type: 'application/pdf',
    category: 'compliance',
    status: 'urgent',
    tags: ['quarterly', 'compliance', 'review needed', 'urgent'],
    user_id: 'demo_user',
    created_at: '2024-11-30T16:45:00Z',
    updated_at: '2024-11-30T16:45:00Z',
    extracted_text: 'Quarterly compliance report covering regulatory requirements...',
    content_summary: 'Q4 compliance report requiring immediate review and approval.',
    embedding: null
  },
  {
    id: 5,
    filename: 'data_protection_policy.pdf',
    original_filename: 'Data Protection Policy.pdf',
    file_path: '/mock/storage/data_protection_policy.pdf',
    file_size: 1740800,
    file_type: 'pdf',
    mime_type: 'application/pdf',
    category: 'compliance',
    status: 'approved',
    tags: ['policy', 'data protection', 'approved', 'gdpr'],
    user_id: 'demo_user',
    created_at: '2024-11-15T11:00:00Z',
    updated_at: '2024-11-15T11:00:00Z',
    extracted_text: 'Data Protection Policy outlining GDPR compliance measures...',
    content_summary: 'Updated data protection policy ensuring GDPR compliance.',
    embedding: null
  }
];

export const mockActivities = [
  {
    id: 1,
    user_id: 'demo_user',
    action: 'Document Uploaded',
    description: 'Uploaded document: ACME Corp Contract - Q4 2024.pdf',
    activity_type: 'upload',
    actor: 'user',
    file_type: 'PDF',
    files: ['ACME Corp Contract - Q4 2024.pdf'],
    user_confirmation: null,
    created_at: '2024-12-15T10:30:00Z',
    metadata: {}
  },
  {
    id: 2,
    user_id: 'demo_user',
    action: 'Voice Command Processed',
    description: 'Processed voice command: "Find contracts"',
    activity_type: 'voice_command',
    actor: 'ai',
    file_type: 'Command',
    files: [],
    user_confirmation: 'Found 3 contract documents',
    created_at: '2024-12-15T10:25:00Z',
    metadata: { intent: 'search_documents', confidence: 0.92 }
  },
  {
    id: 3,
    user_id: 'demo_user',
    action: 'Document Summarized',
    description: 'Generated summary for compliance report',
    activity_type: 'summarize',
    actor: 'ai',
    file_type: 'PDF',
    files: ['Compliance Report Q4.pdf'],
    user_confirmation: 'Summary approved for distribution',
    created_at: '2024-12-15T10:15:00Z',
    metadata: { word_count: 1247, processing_time: 3.2 }
  },
  {
    id: 4,
    user_id: 'demo_user',
    action: 'Documents Merged',
    description: 'Merged three invoices into single PDF',
    activity_type: 'merge',
    actor: 'ai',
    file_type: 'PDF',
    files: ['Invoice_VendorA_001.pdf', 'Invoice_VendorA_002.pdf', 'Invoice_VendorA_003.pdf'],
    user_confirmation: 'Approved merge operation',
    created_at: '2024-12-15T09:45:00Z',
    metadata: { merged_count: 3, output_file: 'merged_invoices_20241215.pdf' }
  },
  {
    id: 5,
    user_id: 'demo_user',
    action: 'Document Translated',
    description: 'Translated policy document to Spanish',
    activity_type: 'translate',
    actor: 'ai',
    file_type: 'PDF',
    files: ['Data Protection Policy.pdf'],
    user_confirmation: null,
    created_at: '2024-12-15T09:30:00Z',
    metadata: { target_language: 'Spanish', confidence: 0.95 }
  }
];

export const mockMemories = [
  {
    id: 1,
    user_id: 'demo_user',
    title: 'ACME Corp Contract Summary',
    content: 'Contract signed in October 2024 for quarterly services. Value: $50,000. Auto-renewal clause included. Next review: January 2025. Key stakeholders: John Smith (ACME), Sarah Johnson (Legal).',
    memory_type: 'summary',
    tags: ['acme', 'contract', 'quarterly', 'auto-renewal'],
    starred: true,
    created_at: '2024-12-15T08:30:00Z',
    updated_at: '2024-12-15T08:30:00Z',
    metadata: { document_ids: ['1'], confidence: 0.94 }
  },
  {
    id: 2,
    user_id: 'demo_user',
    title: 'Monthly Invoice Processing Routine',
    content: 'Steps:\n1. Find all invoices from current month\n2. Sort by vendor\n3. Merge vendor invoices\n4. Send to accounting team\n5. Update tracking spreadsheet\n6. Archive processed invoices',
    memory_type: 'routine',
    tags: ['invoices', 'monthly', 'routine', 'accounting'],
    starred: false,
    created_at: '2024-12-14T16:20:00Z',
    updated_at: '2024-12-14T16:20:00Z',
    metadata: { steps: ['Find invoices', 'Sort by vendor', 'Merge', 'Send to accounting', 'Update tracking', 'Archive'] }
  },
  {
    id: 3,
    user_id: 'demo_user',
    title: 'HR Onboarding Checklist',
    content: 'All new hires need: Employee handbook signed, IT equipment form completed, Benefits enrollment submitted, Emergency contact information, Tax forms (W-4, I-9), Office access badge requested, Email account setup, Training schedule assigned.',
    memory_type: 'bookmark',
    tags: ['hr', 'onboarding', 'checklist', 'new-hire'],
    starred: true,
    created_at: '2024-12-13T14:15:00Z',
    updated_at: '2024-12-13T14:15:00Z',
    metadata: { reference_id: '3', checklist_items: 8 }
  },
  {
    id: 4,
    user_id: 'demo_user',
    title: 'Compliance Review Process',
    content: 'Previous search: "Find all compliance documents that need review" returned 12 documents. 8 processed, 4 pending review. Next quarterly review scheduled for March 2025.',
    memory_type: 'history',
    tags: ['compliance', 'review', 'query', 'quarterly'],
    starred: false,
    created_at: '2024-12-12T11:45:00Z',
    updated_at: '2024-12-12T11:45:00Z',
    metadata: { documents_found: 12, processed: 8, pending: 4 }
  },
  {
    id: 5,
    user_id: 'demo_user',
    title: 'Vendor A Invoice Pattern',
    content: 'Vendor A typically sends 3 invoices per month. Usually arrive 1st, 5th, and 10th. Average processing time: 2 business days. Payment terms: Net 30. Contact: billing@vendora.com',
    memory_type: 'summary',
    tags: ['vendor-a', 'invoices', 'pattern', 'billing'],
    starred: false,
    created_at: '2024-12-11T13:30:00Z',
    updated_at: '2024-12-11T13:30:00Z',
    metadata: { frequency: 'monthly', average_count: 3, payment_terms: 'Net 30' }
  }
];

export const mockTasks = [
  {
    id: 1,
    task_type: 'document_summarization',
    status: 'completed',
    progress: 100.0,
    user_id: 'demo_user',
    created_at: '2024-12-15T10:15:00Z',
    updated_at: '2024-12-15T10:18:00Z',
    result: {
      document_id: '4',
      summary: 'The Q4 compliance report shows strong adherence to regulatory requirements with only 2 minor findings. All critical controls are functioning effectively.',
      word_count: 1247
    },
    error: null
  },
  {
    id: 2,
    task_type: 'document_merge',
    status: 'processing',
    progress: 65.0,
    user_id: 'demo_user',
    created_at: '2024-12-15T10:20:00Z',
    updated_at: '2024-12-15T10:22:00Z',
    result: null,
    error: null
  },
  {
    id: 3,
    task_type: 'document_translation',
    status: 'pending',
    progress: 0.0,
    user_id: 'demo_user',
    created_at: '2024-12-15T10:25:00Z',
    updated_at: '2024-12-15T10:25:00Z',
    result: null,
    error: null
  },
  {
    id: 4,
    task_type: 'document_analysis',
    status: 'failed',
    progress: 0.0,
    user_id: 'demo_user',
    created_at: '2024-12-15T09:30:00Z',
    updated_at: '2024-12-15T09:32:00Z',
    result: null,
    error: 'Document format not supported'
  }
];

export const mockUpcomingTasks = [
  {
    id: 1,
    title: '3 files awaiting signature',
    description: 'Vendor contracts need to be signed by end of week',
    priority: 'high',
    dueDate: '2024-12-20',
    files: ['Contract_VendorB.pdf', 'Contract_VendorC.pdf', 'Service_Agreement.pdf'],
    type: 'signature'
  },
  {
    id: 2,
    title: '2 conflicting file versions flagged',
    description: 'Multiple versions of the same document detected',
    priority: 'medium',
    dueDate: '2024-12-18',
    files: ['Policy_v1.pdf', 'Policy_v2.pdf'],
    type: 'conflict'
  },
  {
    id: 3,
    title: 'Compliance review due',
    description: 'Quarterly compliance documents need review',
    priority: 'high',
    dueDate: '2024-12-25',
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

export const mockAnalytics = {
  totalDocuments: 247,
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
    { type: 'PDF', count: 137, percentage: 55 },
    { type: 'DOCX', count: 62, percentage: 25 },
    { type: 'XLSX', count: 37, percentage: 15 },
    { type: 'Others', count: 11, percentage: 5 }
  ]
};

// Mock action responses
export const mockActionResponses = {
  summarize: [
    "This document contains a comprehensive overview of quarterly business operations, highlighting key performance indicators, financial metrics, and strategic initiatives. The analysis reveals strong growth trends and identifies areas for operational improvement.",
    "The document outlines critical compliance requirements and regulatory standards that must be maintained. It includes detailed procedures, audit findings, and recommended actions for ensuring continued adherence to industry regulations.",
    "This contract document establishes the terms and conditions for service delivery, including scope of work, payment terms, deliverables, and performance metrics. It defines the legal framework for the business relationship between parties."
  ],
  compare: [
    "Document comparison reveals 3 key differences in pricing structures and 2 variations in service terms. Overall similarity: 78%. Main differences found in sections 4.2 (pricing) and 6.1 (termination clauses).",
    "The documents show substantial alignment in core content with minor variations in formatting and terminology. 5 content differences identified, primarily in appendices and supporting materials.",
    "Comparison analysis shows significant divergence in approach and methodology. Documents differ in 8 major areas including scope, timeline, and resource allocation."
  ],
  convert: [
    "Document successfully converted to PDF format. Original formatting preserved, including tables, images, and special characters. File size optimized for sharing and archival.",
    "Conversion to Excel format completed. Data extracted and organized into structured spreadsheet with proper column headers and formatting.",
    "Document converted to Word format with full editing capabilities. All content, formatting, and embedded objects transferred successfully."
  ],
  merge: [
    "Successfully merged 3 documents into a single PDF file. Total pages: 47. Combined file size: 2.8 MB. Table of contents generated automatically.",
    "Document merge completed. 5 files combined with intelligent section organization. Duplicate content removed and formatting standardized.",
    "Merge operation successful. Files consolidated with preserved original formatting and automatic page numbering."
  ],
  redact: [
    "Sensitive information redacted from document. Items removed: 12 SSNs, 8 phone numbers, 15 email addresses, 5 bank account numbers. Document ready for public distribution.",
    "Privacy protection applied. Personal identifiers, financial data, and confidential business information securely redacted while maintaining document readability.",
    "Redaction complete. 23 sensitive data points removed including names, addresses, and proprietary information. Compliance with data protection regulations ensured."
  ],
  translate: [
    "Document translated to Spanish. Translation accuracy: 96%. Technical terminology preserved with appropriate business context. Ready for international distribution.",
    "French translation completed with cultural adaptation for business communications. All legal terms and technical specifications accurately translated.",
    "German translation finished. Complex technical content translated with industry-specific terminology. Document reviewed for accuracy and clarity."
  ],
  extract: [
    "Data extraction complete. Identified: 15 names, 8 dates, 12 monetary amounts, 5 contract numbers, 3 signatures. Information organized in structured format.",
    "Key information extracted: Company details, contact information, financial figures, important dates, and action items. Data ready for database import.",
    "Extraction results: 23 entities identified including people, organizations, locations, and key metrics. Confidence level: 94%."
  ],
  send: [
    "Document sent to 5 team members via secure email. Recipients: John Smith, Sarah Johnson, Mike Brown, Lisa Davis, Tom Wilson. Delivery confirmation received.",
    "File shared with accounting department. Access permissions configured for view-only. Notification sent to 3 stakeholders.",
    "Document distributed to compliance team with appropriate security clearance. Audit trail created for regulatory tracking."
  ]
};