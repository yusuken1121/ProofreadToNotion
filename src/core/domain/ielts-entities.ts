export type TaskType = "Task 1" | "Task 2";

export interface IELTSScores {
  overall: number;
  TR: number;
  CC: number;
  LR: number;
  GRA: number;
}

export interface IELTSFeedbackDetail {
  score: number;
  feedback: string;
}

export interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
}

export interface IELTSAssessment {
  overall_band: number;
  criteria: {
    TR: IELTSFeedbackDetail;
    CC: IELTSFeedbackDetail;
    LR: IELTSFeedbackDetail;
    GRA: IELTSFeedbackDetail;
  };
  rewrite_suggestion: string;
  weakness_tags: string[];
  key_vocabulary: VocabularyItem[];
}

export interface IELTSSession {
  essay: string;
  taskType: TaskType;
  assessment: IELTSAssessment;
  createdAt: Date;
}
