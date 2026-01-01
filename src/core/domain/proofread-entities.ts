export type WritingStyle = "casual" | "formal" | "normal";
export type ErrorLevel = "basic" | "intermediate" | "advanced";
export type ErrorType = "grammar" | "vocabulary" | "usage";

export interface ProofreadRequest {
  text: string;
  writingStyle: WritingStyle;
  errorLevel: ErrorLevel;
  errorTypes: ErrorType[];
}
