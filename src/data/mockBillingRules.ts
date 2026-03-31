export type BillingRuleList = 'applied' | 'site';

export interface BillingRuleRow {
  ruleId: string;
  scope: 'Global' | 'Site';
  /** Shown in the third column (usage / priority style counts from product screenshots). */
  usageCount: number;
  reason: string;
  explanation: string;
  list: BillingRuleList;
  /** Site-rules row can show an Edit control in the notes column (see RUL-674890 reference). */
  showEdit?: boolean;
}

/** Applied Rules — content from billing rules screenshots (global rules + usage-style counts). */
const APPLIED_ROWS: BillingRuleRow[] = [
  {
    ruleId: 'RUL-64533',
    scope: 'Global',
    usageCount: 51,
    reason:
      'We have an updated logic for prior auth based on insurance priority, which makes use of prior auths populated on the encounter auxiliary data table.',
    explanation:
      "If an encounter is created by Athelas EHR, we want to use this new updated logic through the action and set prior auths based on the data in the encounter auxiliary data table. IF encounter created by name = 'ATHELAS_EHR', then run the action 'set_prior_auth_based_on_insurance_priority'. This would apply this action for all ATHELAS_EHR claims.",
    list: 'applied',
  },
  {
    ruleId: 'RUL-42252',
    scope: 'Global',
    usageCount: 51,
    reason:
      '[Physical Therapy / Occupational Therapy] 97161-97164 is a PT evaluation code, that should have a GP modifier. 97165-97168 is an OT evaluation code, that should have GO modifier.',
    explanation:
      'If the CPT code matches regex `\\b9716[1-8]\\b`. Add GP modifier to 97161-97164, remove GO, GN modifier from 97161-97164. Add GO modifier to 97165-97168, remove GP, GN modifier from 97165-97168.',
    list: 'applied',
  },
  {
    ruleId: 'RUL-414534',
    scope: 'Global',
    usageCount: 44,
    reason:
      '[Claim Validation] Claims billed with just one CPT should not be billed with 25 modifiers unless there is another encounter for the patient on the same DOS with same rendering provider. Except Site ID 301, 302, 628, 629, 653, 654, 283, 745, 298, 2280.',
    explanation:
      'If number of procedures is only 1 and there is no split encounter associated with the same patient, same DOS, same insurance company, and same rendering provider, THEN remove 25 modifier if found (Should only be appended if reporting multiple services).',
    list: 'applied',
  },
  {
    ruleId: 'RUL-625123',
    scope: 'Global',
    usageCount: 31,
    reason:
      'Per CMS, post-operative visits only need to be reported for practitioners from nine states (Florida, Kentucky, Louisiana, Nevada, New Jersey, North Dakota, Ohio, Oregon, and Rhode Island) for offices with more than 10 providers. https://www.cms.gov/medicare/payment/fee-schedules/physician/global-surgery-data-collection',
    explanation:
      'If billing to states not FL, KY, LA, NV, NJ, ND, OH, OR, RI, remove 99024. [Edit: Excluding Site ID 327, 242, 456, 339, 529, 768, 2219 and 152900]',
    list: 'applied',
  },
  {
    ruleId: 'RUL-630973',
    scope: 'Global',
    usageCount: 23,
    reason:
      "This rule applies the 'QW' modifier to a predefined list of laboratory CPT codes to ensure proper reimbursement for CLIA-waived tests. The 'QW' modifier is added to all procedures matching the specified CPT codes, except for claims originating from specific site IDs (393, 364, 207, 1890, 2506, 152659). It is crucial to ensure the list of CPT codes accurately reflects current CLIA-waived tests and payer guidelines, as the provided list is extensive and may include codes not typically considered CLIA-waived or may omit others. Regularly review and update the CPT code list based on CMS updates and payer policies.",
    explanation:
      'IF site id != 393, 364, 207, 1890, 2506, 152659 THEN add modifier QW to cpt codes = 81003, 87880, 80048, 80053, 82374, 80069, 80051, 82435, 82550, 82565, 82947, 84132, 84295, 84520, 80305, 89321, 86780, G0433, 87633, 87801, 82010, 86386, 87502, 82465, 83718, 84478, 80061, 85018, 82274, G0328, 86308, 87804, 82040, 87809, 87905, 84460, 84075, 82150, 84450, 83880, 80047, 82247, 86294, 82310, 82330, 81007, 82570, 82055, 83001, 82985, 82977, 82950, 82951, 82952, 83036, 83037, 86318, 87077, 87899, 85014, 85017, 86803, 87806, 86701, 86703, 83605, 85721, 83655, 80178, 83002, 86618, 83516, 82044, 82043, 86305, 82271, 83861, 82523, 87210, 83986, 82120, 85576, 84703, 85610, 84155, 87807, 89300, 87808, 84443, 84550, 87428, 87426, 87400, 87338, 87389, 87631, 87634, 87635, 87651, 87811, 84681',
    list: 'applied',
  },
  {
    ruleId: 'RUL-240',
    scope: 'Global',
    usageCount: 15,
    reason: 'Need to fix missing or extra long diagnosis code pointers list on all procedures.',
    explanation:
      'If diagnosis code pointers on any procedure is missing or greater than 4 in length, fix it or set to default [1]',
    list: 'applied',
  },
  {
    ruleId: 'RUL-415934',
    scope: 'Global',
    usageCount: 12,
    reason: 'Rule to Block Submission if Payer = Self-pay',
    explanation:
      'Action: The rule will block the claim submission. Condition: This rule will trigger if the payer is identified as self-pay. This rule ensures that claims with a self-pay payer are blocked from submission.',
    list: 'applied',
  },
  {
    ruleId: 'RUL-685747',
    scope: 'Global',
    usageCount: 3,
    reason:
      "We need to apply the appropriate therapy modifiers (GP, GO, GN) to therapy claims based on the rendering provider's taxonomy. GN - Service delivered personally by a speech-language pathologist or under an outpatient speech-language pathology plan of care. GO - Service delivered personally by an occupational therapist or under an outpatient occupational therapy plan of care. GP - Service delivered personally by a physical therapist or under an outpatient physical therapy plan of care. This rule excludes claims for specific payers and site IDs, and also excludes institutional claims. Exclusions: Payer ID: 5706 (MERITAIN HEALTH MINNEAPOLIS) Site IDs: 393, 302, 152949, 152707 Institutional billing type claims.",
    explanation:
      'This rule applies therapy modifiers (GP, GO, GN) to CPT codes identified as therapy services. The modifier is determined primarily by the rendering provider\'s taxonomy. If the taxonomy is not available, modifiers may be inferred based on existing procedure codes (CO/CQ) or by identifying speech-language pathology-specific CPT codes.\n\nTaxonomies used for modifier mapping: GO modifier (Occupational Therapy): e.g. 225X00000X series; GP modifier (Physical Therapy): e.g. 225100000X series; GN modifier (Speech-Language Pathology): 235Z00000X, 2355S0801X, 235500000X.\n\nCPTs where this will be applied include common therapy and timed codes (e.g. 97110, 97112, 97116, 97140, 97530, G0283, etc.) per your internal therapy matrix.\n\nNote: As per CMS guidelines effective 2026-01-01, these codes as well: 98979, 98984 and 98985.',
    list: 'applied',
  },
  {
    ruleId: 'RUL-68021',
    scope: 'Global',
    usageCount: 1,
    reason:
      '[Test patients] Colossus team uses "Athelas" or "Whisman" in patient\'s name for test patients. We need to block these claims from being submitted.',
    explanation:
      'IF patient first name has ATHELAS and patient last name has WHISMAN, THEN block claim from submission. Except Site ID 616.',
    list: 'applied',
  },
];

/** Site Rules — content from screenshot including global rows and one site row with edit affordance. */
const SITE_ROWS: BillingRuleRow[] = [
  {
    ruleId: 'RUL-401757',
    scope: 'Global',
    usageCount: 1,
    reason: '[General] Modifier can be 2 alphanumeric characters only.',
    explanation:
      'If the `claimInformation:serviceLines:professionalService:procedureModifiers` or `claimInformation:serviceLines:institutionalService:procedureModifiers` does not match regex `\\b[a-zA-Z0-9]{2}\\b`, then block.',
    list: 'site',
  },
  {
    ruleId: 'RUL-680169',
    scope: 'Global',
    usageCount: 1,
    reason:
      '[Block Invalid Member IDs] If policy ID contains following invalid member IDs, block from submission and set to Athelas Responsibility for review. MISSINGPOLICYNUMBER, 000000000, MISSING, NA, SELF-PAY, UNKNOWN.',
    explanation:
      '[Block Invalid Member IDs] If the primary or secondary policy number is MISSINGPOLICYNUMBER, 000000000, MISSING, NA, SELF-PAY, UNKNOWN, block from submission and set to Athelas Responsibility for review.',
    list: 'site',
  },
  {
    ruleId: 'RUL-67950',
    scope: 'Global',
    usageCount: 1,
    reason:
      '[Test patients] Colossus team uses "Athelas" or "Whisman" in patient\'s name for test patients. We need to block these claims from being submitted.',
    explanation:
      'IF patient first name has ATHELAS and patient last name has WHISMAN, THEN block claim from submission. Except Site ID 616.',
    list: 'site',
  },
  {
    ruleId: 'RUL-674890',
    scope: 'Site',
    usageCount: 1,
    reason: 'test',
    explanation: 'test',
    list: 'site',
    showEdit: true,
  },
];

export const MOCK_BILLING_RULE_ROWS: BillingRuleRow[] = [...APPLIED_ROWS, ...SITE_ROWS];
