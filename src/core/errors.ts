export interface ValidationIssue {
  code: string;
  path: string;
  message: string;
}

export class ReleaseSocialValidationError extends Error {
  readonly issues: readonly ValidationIssue[];

  constructor(issue: ValidationIssue | readonly ValidationIssue[]) {
    const issues = Array.isArray(issue) ? issue : [issue];
    super(issues.map((item) => `${item.path}: ${item.message}`).join('; '));
    this.name = 'ReleaseSocialValidationError';
    this.issues = issues;
  }
}

export function validationError(code: string, path: string, message: string): never {
  throw new ReleaseSocialValidationError({ code, path, message });
}
