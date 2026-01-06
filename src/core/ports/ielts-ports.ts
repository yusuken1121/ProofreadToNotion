import {
  IELTSAssessment,
  IELTSSession,
  TaskType,
} from "../domain/ielts-entities";

export interface IAIGateway {
  generateProblem(taskType: TaskType): Promise<string>;
  evaluateEssay(essay: string, taskType: TaskType): Promise<IELTSAssessment>;
}

export interface IIELTSRepository {
  saveSession(session: IELTSSession): Promise<void>;
}
