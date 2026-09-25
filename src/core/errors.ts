export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
}

function isValidationIssueArray(
  value: ValidationIssue | readonly ValidationIssue[],
): value is readonly ValidationIssue[] {
  return Array.isArray(value);
}

export class ReleaseSocialValidationError extends Error {
  readonly issues: readonly ValidationIssue[];

  constructor(issue: ValidationIssue | readonly ValidationIssue[]) {
    const issues = isValidationIssueArray(issue) ? issue : [issue];
    super(issues.map((item) => `${item.path}: ${item.message}`).join('; '));
    this.name = 'ReleaseSocialValidationError';
    this.issues = issues;
  }
}

export function validationError(code: string, path: string, message: string): never {
  throw new ReleaseSocialValidationError({ code, path, message });
}
