import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const professionalTemplates = [
  {
    name: 'Non-Disclosure Agreement (NDA)',
    description: 'Protect confidential information shared between parties. Ideal for business discussions, partnerships, and employee onboarding.',
    isPublic: true,
    content: {
      fields: [
        { id: 'disclosing_party', label: 'Disclosing Party Name', type: 'text', required: true },
        { id: 'receiving_party', label: 'Receiving Party Name', type: 'text', required: true },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'confidential_info', label: 'Description of Confidential Information', type: 'text', required: true },
        { id: 'duration', label: 'Agreement Duration', type: 'text', required: true },
        { id: 'governing_law', label: 'Governing Law (State/Jurisdiction)', type: 'text', required: true },
        { id: 'disclosing_signature', label: 'Disclosing Party Signature', type: 'signature', required: true },
        { id: 'receiving_signature', label: 'Receiving Party Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Employment Agreement',
    description: 'Standard employment contract covering compensation, responsibilities, benefits, and terms of employment.',
    isPublic: true,
    content: {
      fields: [
        { id: 'employer_name', label: 'Employer / Company Name', type: 'text', required: true },
        { id: 'employee_name', label: 'Employee Full Name', type: 'text', required: true },
        { id: 'job_title', label: 'Job Title / Position', type: 'text', required: true },
        { id: 'start_date', label: 'Employment Start Date', type: 'date', required: true },
        { id: 'compensation', label: 'Annual Compensation', type: 'text', required: true },
        { id: 'work_location', label: 'Work Location', type: 'text', required: true },
        { id: 'employment_type', label: 'Employment Type (Full-time/Part-time)', type: 'text', required: true },
        { id: 'probation_period', label: 'Probation Period', type: 'text', required: false },
        { id: 'benefits', label: 'Benefits Package Description', type: 'text', required: false },
        { id: 'termination_notice', label: 'Termination Notice Period', type: 'text', required: true },
        { id: 'non_compete', label: 'Non-Compete Clause Acknowledged', type: 'checkbox', required: true },
        { id: 'employer_signature', label: 'Employer Signature', type: 'signature', required: true },
        { id: 'employee_signature', label: 'Employee Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Independent Contractor Agreement',
    description: 'Define the terms of engagement with freelancers and independent contractors including scope, payment, and deliverables.',
    isPublic: true,
    content: {
      fields: [
        { id: 'company_name', label: 'Company Name', type: 'text', required: true },
        { id: 'contractor_name', label: 'Contractor Full Name', type: 'text', required: true },
        { id: 'project_description', label: 'Project / Services Description', type: 'text', required: true },
        { id: 'start_date', label: 'Contract Start Date', type: 'date', required: true },
        { id: 'end_date', label: 'Contract End Date', type: 'date', required: true },
        { id: 'compensation_rate', label: 'Compensation Rate', type: 'text', required: true },
        { id: 'payment_schedule', label: 'Payment Schedule', type: 'text', required: true },
        { id: 'deliverables', label: 'Key Deliverables', type: 'text', required: true },
        { id: 'ip_ownership', label: 'IP Ownership Terms', type: 'text', required: true },
        { id: 'confidentiality', label: 'Confidentiality Clause Acknowledged', type: 'checkbox', required: true },
        { id: 'company_signature', label: 'Company Representative Signature', type: 'signature', required: true },
        { id: 'contractor_signature', label: 'Contractor Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Service Level Agreement (SLA)',
    description: 'Define service expectations, metrics, and remedies between service providers and clients.',
    isPublic: true,
    content: {
      fields: [
        { id: 'provider_name', label: 'Service Provider Name', type: 'text', required: true },
        { id: 'client_name', label: 'Client Name', type: 'text', required: true },
        { id: 'service_description', label: 'Service Description', type: 'text', required: true },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'uptime_guarantee', label: 'Uptime Guarantee (%)', type: 'text', required: true },
        { id: 'response_time', label: 'Response Time Commitment', type: 'text', required: true },
        { id: 'support_hours', label: 'Support Hours', type: 'text', required: true },
        { id: 'escalation_process', label: 'Escalation Process', type: 'text', required: true },
        { id: 'penalties', label: 'Penalty for SLA Breach', type: 'text', required: true },
        { id: 'review_period', label: 'Review Period', type: 'text', required: false },
        { id: 'provider_signature', label: 'Provider Signature', type: 'signature', required: true },
        { id: 'client_signature', label: 'Client Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Lease / Rental Agreement',
    description: 'Residential or commercial property lease agreement covering rent, duration, rules, and responsibilities.',
    isPublic: true,
    content: {
      fields: [
        { id: 'landlord_name', label: 'Landlord / Property Owner Name', type: 'text', required: true },
        { id: 'tenant_name', label: 'Tenant Full Name', type: 'text', required: true },
        { id: 'property_address', label: 'Property Address', type: 'text', required: true },
        { id: 'lease_start', label: 'Lease Start Date', type: 'date', required: true },
        { id: 'lease_end', label: 'Lease End Date', type: 'date', required: true },
        { id: 'monthly_rent', label: 'Monthly Rent Amount', type: 'text', required: true },
        { id: 'security_deposit', label: 'Security Deposit Amount', type: 'text', required: true },
        { id: 'payment_due_date', label: 'Rent Due Day of Month', type: 'text', required: true },
        { id: 'utilities_included', label: 'Utilities Included', type: 'text', required: false },
        { id: 'pet_policy', label: 'Pet Policy', type: 'text', required: false },
        { id: 'rules_acknowledged', label: 'Property Rules Acknowledged', type: 'checkbox', required: true },
        { id: 'landlord_signature', label: 'Landlord Signature', type: 'signature', required: true },
        { id: 'tenant_signature', label: 'Tenant Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Sales / Purchase Agreement',
    description: 'Standard agreement for the sale and purchase of goods or assets, including pricing, delivery, and warranties.',
    isPublic: true,
    content: {
      fields: [
        { id: 'seller_name', label: 'Seller Name', type: 'text', required: true },
        { id: 'buyer_name', label: 'Buyer Name', type: 'text', required: true },
        { id: 'item_description', label: 'Description of Goods / Assets', type: 'text', required: true },
        { id: 'purchase_price', label: 'Purchase Price', type: 'text', required: true },
        { id: 'payment_method', label: 'Payment Method', type: 'text', required: true },
        { id: 'delivery_date', label: 'Delivery Date', type: 'date', required: true },
        { id: 'delivery_address', label: 'Delivery Address', type: 'text', required: true },
        { id: 'warranty_terms', label: 'Warranty Terms', type: 'text', required: false },
        { id: 'inspection_period', label: 'Inspection Period (Days)', type: 'text', required: false },
        { id: 'seller_signature', label: 'Seller Signature', type: 'signature', required: true },
        { id: 'buyer_signature', label: 'Buyer Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Power of Attorney',
    description: 'Authorize another person to act on your behalf in legal, financial, or medical matters.',
    isPublic: true,
    content: {
      fields: [
        { id: 'principal_name', label: 'Principal (Grantor) Full Name', type: 'text', required: true },
        { id: 'agent_name', label: 'Agent (Attorney-in-Fact) Full Name', type: 'text', required: true },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'powers_granted', label: 'Powers Granted', type: 'text', required: true },
        { id: 'scope_limitations', label: 'Scope Limitations', type: 'text', required: false },
        { id: 'expiration_date', label: 'Expiration Date', type: 'date', required: false },
        { id: 'revocation_terms', label: 'Revocation Terms', type: 'text', required: true },
        { id: 'principal_signature', label: 'Principal Signature', type: 'signature', required: true },
        { id: 'agent_signature', label: 'Agent Acknowledgment Signature', type: 'signature', required: true },
        { id: 'witness_name', label: 'Witness Full Name', type: 'text', required: true },
        { id: 'witness_signature', label: 'Witness Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Consulting Agreement',
    description: 'Professional consulting engagement terms covering scope, fees, timeline, and intellectual property.',
    isPublic: true,
    content: {
      fields: [
        { id: 'consultant_name', label: 'Consultant Name / Firm', type: 'text', required: true },
        { id: 'client_name', label: 'Client Name / Company', type: 'text', required: true },
        { id: 'scope_of_work', label: 'Scope of Work', type: 'text', required: true },
        { id: 'start_date', label: 'Engagement Start Date', type: 'date', required: true },
        { id: 'end_date', label: 'Engagement End Date', type: 'date', required: true },
        { id: 'fee_structure', label: 'Fee Structure (Hourly/Fixed/Retainer)', type: 'text', required: true },
        { id: 'payment_terms', label: 'Payment Terms', type: 'text', required: true },
        { id: 'expenses', label: 'Expense Reimbursement Policy', type: 'text', required: false },
        { id: 'confidentiality', label: 'Confidentiality Acknowledged', type: 'checkbox', required: true },
        { id: 'ip_assignment', label: 'IP Assignment Acknowledged', type: 'checkbox', required: true },
        { id: 'consultant_signature', label: 'Consultant Signature', type: 'signature', required: true },
        { id: 'client_signature', label: 'Client Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Partnership Agreement',
    description: 'Establish the terms of a business partnership including profit sharing, roles, contributions, and dissolution.',
    isPublic: true,
    content: {
      fields: [
        { id: 'partnership_name', label: 'Partnership / Business Name', type: 'text', required: true },
        { id: 'partner_1_name', label: 'Partner 1 Full Name', type: 'text', required: true },
        { id: 'partner_2_name', label: 'Partner 2 Full Name', type: 'text', required: true },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'business_purpose', label: 'Business Purpose', type: 'text', required: true },
        { id: 'capital_contributions', label: 'Capital Contributions', type: 'text', required: true },
        { id: 'profit_sharing', label: 'Profit / Loss Sharing Ratio', type: 'text', required: true },
        { id: 'management_roles', label: 'Management Roles & Responsibilities', type: 'text', required: true },
        { id: 'decision_making', label: 'Decision Making Process', type: 'text', required: true },
        { id: 'dissolution_terms', label: 'Dissolution Terms', type: 'text', required: true },
        { id: 'partner_1_signature', label: 'Partner 1 Signature', type: 'signature', required: true },
        { id: 'partner_2_signature', label: 'Partner 2 Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Non-Compete Agreement',
    description: 'Prevent parties from engaging in competing business activities for a specified period and geographic area.',
    isPublic: true,
    content: {
      fields: [
        { id: 'company_name', label: 'Company Name', type: 'text', required: true },
        { id: 'individual_name', label: 'Individual Full Name', type: 'text', required: true },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'restricted_activities', label: 'Restricted Activities', type: 'text', required: true },
        { id: 'geographic_scope', label: 'Geographic Scope', type: 'text', required: true },
        { id: 'duration', label: 'Duration of Non-Compete', type: 'text', required: true },
        { id: 'consideration', label: 'Consideration Provided', type: 'text', required: true },
        { id: 'exceptions', label: 'Exceptions / Carve-outs', type: 'text', required: false },
        { id: 'remedies', label: 'Remedies for Breach', type: 'text', required: true },
        { id: 'company_signature', label: 'Company Signature', type: 'signature', required: true },
        { id: 'individual_signature', label: 'Individual Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Release & Waiver of Liability',
    description: 'Release a party from liability for potential risks, commonly used for events, activities, and services.',
    isPublic: true,
    content: {
      fields: [
        { id: 'organization_name', label: 'Organization / Company Name', type: 'text', required: true },
        { id: 'participant_name', label: 'Participant Full Name', type: 'text', required: true },
        { id: 'activity_description', label: 'Activity / Event Description', type: 'text', required: true },
        { id: 'activity_date', label: 'Activity Date', type: 'date', required: true },
        { id: 'location', label: 'Location', type: 'text', required: true },
        { id: 'risks_acknowledged', label: 'Risks Acknowledged', type: 'text', required: true },
        { id: 'medical_consent', label: 'Emergency Medical Consent', type: 'checkbox', required: true },
        { id: 'emergency_contact', label: 'Emergency Contact Name & Phone', type: 'text', required: true },
        { id: 'voluntary_participation', label: 'Voluntary Participation Confirmed', type: 'checkbox', required: true },
        { id: 'participant_signature', label: 'Participant Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Bill of Sale',
    description: 'Record the transfer of ownership of personal property from seller to buyer.',
    isPublic: true,
    content: {
      fields: [
        { id: 'seller_name', label: 'Seller Full Name', type: 'text', required: true },
        { id: 'buyer_name', label: 'Buyer Full Name', type: 'text', required: true },
        { id: 'item_description', label: 'Item Description', type: 'text', required: true },
        { id: 'serial_number', label: 'Serial / Identification Number', type: 'text', required: false },
        { id: 'sale_price', label: 'Sale Price', type: 'text', required: true },
        { id: 'sale_date', label: 'Date of Sale', type: 'date', required: true },
        { id: 'condition', label: 'Item Condition', type: 'text', required: true },
        { id: 'as_is', label: 'Sold As-Is Acknowledged', type: 'checkbox', required: true },
        { id: 'seller_signature', label: 'Seller Signature', type: 'signature', required: true },
        { id: 'buyer_signature', label: 'Buyer Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Letter of Intent (LOI)',
    description: 'Express preliminary commitment before a formal agreement for business deals, acquisitions, or partnerships.',
    isPublic: true,
    content: {
      fields: [
        { id: 'party_1_name', label: 'Party 1 Name / Company', type: 'text', required: true },
        { id: 'party_2_name', label: 'Party 2 Name / Company', type: 'text', required: true },
        { id: 'purpose', label: 'Purpose of Letter of Intent', type: 'text', required: true },
        { id: 'proposed_terms', label: 'Proposed Key Terms', type: 'text', required: true },
        { id: 'timeline', label: 'Proposed Timeline', type: 'text', required: true },
        { id: 'due_diligence', label: 'Due Diligence Period', type: 'text', required: false },
        { id: 'exclusivity', label: 'Exclusivity Period', type: 'text', required: false },
        { id: 'binding_provisions', label: 'Binding Provisions', type: 'text', required: true },
        { id: 'expiration_date', label: 'LOI Expiration Date', type: 'date', required: true },
        { id: 'party_1_signature', label: 'Party 1 Signature', type: 'signature', required: true },
        { id: 'party_2_signature', label: 'Party 2 Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Loan Agreement',
    description: 'Document the terms of a personal or business loan including amount, interest rate, and repayment schedule.',
    isPublic: true,
    content: {
      fields: [
        { id: 'lender_name', label: 'Lender Full Name', type: 'text', required: true },
        { id: 'borrower_name', label: 'Borrower Full Name', type: 'text', required: true },
        { id: 'loan_amount', label: 'Loan Amount', type: 'text', required: true },
        { id: 'interest_rate', label: 'Interest Rate (%)', type: 'text', required: true },
        { id: 'loan_date', label: 'Loan Date', type: 'date', required: true },
        { id: 'repayment_start', label: 'Repayment Start Date', type: 'date', required: true },
        { id: 'repayment_schedule', label: 'Repayment Schedule', type: 'text', required: true },
        { id: 'maturity_date', label: 'Maturity Date', type: 'date', required: true },
        { id: 'collateral', label: 'Collateral (if any)', type: 'text', required: false },
        { id: 'late_payment_fee', label: 'Late Payment Fee', type: 'text', required: true },
        { id: 'prepayment_terms', label: 'Prepayment Terms', type: 'text', required: false },
        { id: 'lender_signature', label: 'Lender Signature', type: 'signature', required: true },
        { id: 'borrower_signature', label: 'Borrower Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Media Release / Photo Consent',
    description: 'Obtain consent to use photos, videos, or recordings of individuals for marketing or publicity purposes.',
    isPublic: true,
    content: {
      fields: [
        { id: 'organization_name', label: 'Organization Name', type: 'text', required: true },
        { id: 'subject_name', label: 'Subject Full Name', type: 'text', required: true },
        { id: 'media_type', label: 'Type of Media (Photo/Video/Audio)', type: 'text', required: true },
        { id: 'purpose', label: 'Purpose of Use', type: 'text', required: true },
        { id: 'platforms', label: 'Distribution Platforms', type: 'text', required: true },
        { id: 'duration', label: 'Duration of Consent', type: 'text', required: true },
        { id: 'compensation', label: 'Compensation (if any)', type: 'text', required: false },
        { id: 'revocation_rights', label: 'Revocation Rights Acknowledged', type: 'checkbox', required: true },
        { id: 'subject_signature', label: 'Subject Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Intellectual Property Assignment',
    description: 'Transfer ownership of intellectual property rights including patents, copyrights, and trademarks.',
    isPublic: true,
    content: {
      fields: [
        { id: 'assignor_name', label: 'Assignor (Current Owner) Name', type: 'text', required: true },
        { id: 'assignee_name', label: 'Assignee (New Owner) Name', type: 'text', required: true },
        { id: 'ip_description', label: 'IP Description', type: 'text', required: true },
        { id: 'ip_type', label: 'IP Type (Patent/Copyright/Trademark/Trade Secret)', type: 'text', required: true },
        { id: 'registration_number', label: 'Registration / Application Number', type: 'text', required: false },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'consideration', label: 'Consideration / Payment', type: 'text', required: true },
        { id: 'warranties', label: 'Assignor Warranties', type: 'text', required: true },
        { id: 'further_assurances', label: 'Further Assurances Acknowledged', type: 'checkbox', required: true },
        { id: 'assignor_signature', label: 'Assignor Signature', type: 'signature', required: true },
        { id: 'assignee_signature', label: 'Assignee Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Terms of Service Agreement',
    description: 'Define the terms and conditions for using a product, platform, or service.',
    isPublic: true,
    content: {
      fields: [
        { id: 'company_name', label: 'Company / Platform Name', type: 'text', required: true },
        { id: 'user_name', label: 'User Full Name', type: 'text', required: true },
        { id: 'service_description', label: 'Service Description', type: 'text', required: true },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'acceptable_use', label: 'Acceptable Use Policy', type: 'text', required: true },
        { id: 'payment_terms', label: 'Payment Terms', type: 'text', required: false },
        { id: 'data_privacy', label: 'Data Privacy Policy Acknowledged', type: 'checkbox', required: true },
        { id: 'liability_limitation', label: 'Liability Limitation Acknowledged', type: 'checkbox', required: true },
        { id: 'dispute_resolution', label: 'Dispute Resolution Method', type: 'text', required: true },
        { id: 'user_signature', label: 'User Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Offer Letter',
    description: 'Formal job offer letter outlining position details, compensation, and start date for prospective employees.',
    isPublic: true,
    content: {
      fields: [
        { id: 'company_name', label: 'Company Name', type: 'text', required: true },
        { id: 'candidate_name', label: 'Candidate Full Name', type: 'text', required: true },
        { id: 'position_title', label: 'Position Title', type: 'text', required: true },
        { id: 'department', label: 'Department', type: 'text', required: true },
        { id: 'start_date', label: 'Proposed Start Date', type: 'date', required: true },
        { id: 'salary', label: 'Base Salary', type: 'text', required: true },
        { id: 'bonus_structure', label: 'Bonus / Commission Structure', type: 'text', required: false },
        { id: 'benefits_summary', label: 'Benefits Summary', type: 'text', required: false },
        { id: 'reporting_to', label: 'Reports To', type: 'text', required: true },
        { id: 'offer_expiry', label: 'Offer Expiration Date', type: 'date', required: true },
        { id: 'at_will_acknowledged', label: 'At-Will Employment Acknowledged', type: 'checkbox', required: true },
        { id: 'candidate_signature', label: 'Candidate Signature', type: 'signature', required: true },
        { id: 'hr_signature', label: 'HR Representative Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Mutual Termination Agreement',
    description: 'Mutually agree to end a contract, partnership, or employment relationship on specified terms.',
    isPublic: true,
    content: {
      fields: [
        { id: 'party_1_name', label: 'Party 1 Name', type: 'text', required: true },
        { id: 'party_2_name', label: 'Party 2 Name', type: 'text', required: true },
        { id: 'original_agreement', label: 'Original Agreement Reference', type: 'text', required: true },
        { id: 'termination_date', label: 'Effective Termination Date', type: 'date', required: true },
        { id: 'reason', label: 'Reason for Termination', type: 'text', required: false },
        { id: 'outstanding_obligations', label: 'Outstanding Obligations', type: 'text', required: true },
        { id: 'settlement_terms', label: 'Settlement Terms', type: 'text', required: true },
        { id: 'return_of_property', label: 'Return of Property Terms', type: 'text', required: true },
        { id: 'mutual_release', label: 'Mutual Release of Claims Acknowledged', type: 'checkbox', required: true },
        { id: 'party_1_signature', label: 'Party 1 Signature', type: 'signature', required: true },
        { id: 'party_2_signature', label: 'Party 2 Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
  {
    name: 'Data Processing Agreement (DPA)',
    description: 'GDPR-compliant agreement governing how personal data is processed between data controllers and processors.',
    isPublic: true,
    content: {
      fields: [
        { id: 'controller_name', label: 'Data Controller Name', type: 'text', required: true },
        { id: 'processor_name', label: 'Data Processor Name', type: 'text', required: true },
        { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
        { id: 'data_categories', label: 'Categories of Personal Data', type: 'text', required: true },
        { id: 'data_subjects', label: 'Categories of Data Subjects', type: 'text', required: true },
        { id: 'processing_purpose', label: 'Purpose of Processing', type: 'text', required: true },
        { id: 'processing_duration', label: 'Duration of Processing', type: 'text', required: true },
        { id: 'security_measures', label: 'Technical & Organizational Security Measures', type: 'text', required: true },
        { id: 'sub_processors', label: 'Sub-Processors (if any)', type: 'text', required: false },
        { id: 'data_transfer', label: 'International Data Transfer Mechanism', type: 'text', required: false },
        { id: 'breach_notification', label: 'Breach Notification Timeline', type: 'text', required: true },
        { id: 'gdpr_compliance', label: 'GDPR Compliance Acknowledged', type: 'checkbox', required: true },
        { id: 'controller_signature', label: 'Data Controller Signature', type: 'signature', required: true },
        { id: 'processor_signature', label: 'Data Processor Signature', type: 'signature', required: true },
        { id: 'date_signed', label: 'Date Signed', type: 'date', required: true },
      ],
    },
  },
];

async function main() {
  console.log('Starting template seeding...');

  // Find or create a system user for public templates
  let systemUser = await prisma.user.findFirst({
    where: { email: 'system@onesign.click' },
  });

  if (!systemUser) {
    // Use the first available user as the template creator
    systemUser = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
    });
  }

  if (!systemUser) {
    console.error('No users found. Please create a user first.');
    process.exit(1);
  }

  console.log(`Using user "${systemUser.name}" (${systemUser.email}) as template creator`);

  // Check existing templates
  const existingCount = await prisma.template.count();
  console.log(`Found ${existingCount} existing templates`);

  let created = 0;
  for (const template of professionalTemplates) {
    // Check if template with same name already exists
    const exists = await prisma.template.findFirst({
      where: { name: template.name },
    });

    if (exists) {
      console.log(`  Skipping "${template.name}" (already exists)`);
      continue;
    }

    await prisma.template.create({
      data: {
        name: template.name,
        description: template.description,
        content: template.content,
        isPublic: template.isPublic,
        createdById: systemUser.id,
      },
    });
    created++;
    console.log(`  Created: "${template.name}"`);
  }

  console.log(`\nSeeding complete! Created ${created} new templates (${professionalTemplates.length} total defined)`);
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
