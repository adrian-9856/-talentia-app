export type Registration = {
  name: string; email: string; phone: string; municipality: string;
  zona?: string; consent: boolean;
};
export type Profile = {
  education: string; trainingType: string; interest: string; experience: string;
  skills: string; availability: string; digitalBarrier: string; hasCV: string; objective: string;
};
export type Diagnosis = {
  situacion: string; tiempoSinEmpleo: string; motivacion: string;
  nivelUrgencia: string; redApoyo: string; expectativaApoyo: string;
};
export type PsychometricAnswers = {
  r1:string;r2:string;r3:string;r4:string;r5:string;
  i1:string;i2:string;i3:string;i4:string;i5:string;
  a1:string;a2:string;a3:string;a4:string;a5:string;
  s1:string;s2:string;s3:string;s4:string;s5:string;
  e1:string;e2:string;e3:string;e4:string;e5:string;
  c1:string;c2:string;c3:string;c4:string;c5:string;
};
export type CvExperienceEntry = { title:string; company:string; dateRange:string; bullets:string; };
export type CvEducationEntry = { degree:string; institution:string; dateRange:string; bullets:string; };
export type CvData = {
  jobTitle:string; summary:string; languages:string; references:string;
  photo?:string; address?:string; socialHandle?:string; website?:string; additionalInfo?:string;
  experiences?:CvExperienceEntry[]; education?:CvEducationEntry[];
};
export type StatusEvent = {
  id: string; enrollmentId: string; from: string; to: string; changedAt: string; changedBy: string;
};
export type Participant = {
  id: string; organizationId: string; name: string; email: string; phone: string;
  municipality: string; consent: boolean | null; consentAt: string | null;
  createdAt: string; source: "sample" | "registration";
  enrollment: { id: string; programId: string; status: string; statusChangedAt: string };
  zona?: string;
  profile: Profile | null; profileSavedAt: string | null;
  history: StatusEvent[];
};
export type TeamFilters = { query: string; program: string; status: string };
export type DashboardFilters = { program:string; city:string; occupation:string; status:string };
export type StepStatus = "pendiente" | "en_proceso" | "completado";
export type Questionnaire = {
  occupation: string; expectedSalary: string; experienceMonths: string;
  cvUpdated: string; clarity: string; digitalAccess: string; wantsTraining: string; experienceHelp: string;
};
export type RouteStep = { id: string; title: string; reason: string; action: string; owner: string; status: StepStatus };
export type Journey = { answers: Questionnaire; steps: RouteStep[]; updatedAt: string; reviewedAt: string | null; reviewedBy: string | null };
export type DemoState = {
  version: 1; participants: Participant[]; activeParticipantId: string | null;
  registrationDraft: Registration; profileDrafts: Record<string, Profile>; teamFilters: TeamFilters;
  journeys?: Record<string, Journey>;
  questionnaireDrafts?: Record<string, Questionnaire>;
  dashboardFilters?: DashboardFilters;
  diagnoses?: Record<string, Diagnosis>;
  diagnosisDrafts?: Record<string, Partial<Diagnosis>>;
  psychometrics?: Record<string, PsychometricAnswers>;
  psychometricDrafts?: Record<string, Partial<PsychometricAnswers>>;
  cvData?: Record<string, CvData>;
};
export type FieldErrors = Partial<Record<keyof Registration, string>>;
export interface StoragePort { getItem(key: string): string | null; setItem(key: string, value: string): void; }
export interface DemoRepository {
  load(): DemoState;
  saveRegistrationDraft(draft: Partial<Registration>): DemoState;
  register(input: Registration): DemoState;
  saveProfileDraft(id: string, profile: Partial<Profile>): DemoState;
  saveProfile(id: string, profile: Profile): DemoState;
  changeStatus(id: string, nextStatus: string, expectedStatus: string): DemoState;
  saveFilters(filters: TeamFilters): DemoState;
  startNewRegistration(): DemoState;
  selectParticipant(id: string): DemoState;
  saveQuestionnaireDraft(id: string, draft: Partial<Questionnaire>): DemoState;
  saveQuestionnaire(id: string, answers: Questionnaire): DemoState;
  updateRouteStep(id: string, stepId: string, status: StepStatus): DemoState;
  reviewRoute(id: string): DemoState;
  saveDashboardFilters(filters: Partial<DashboardFilters>): DemoState;
  saveDiagnosisDraft(id: string, draft: Partial<Diagnosis>): DemoState;
  saveDiagnosis(id: string, diagnosis: Diagnosis): DemoState;
  savePsychometricDraft(id: string, draft: Partial<PsychometricAnswers>): DemoState;
  savePsychometric(id: string, answers: PsychometricAnswers): DemoState;
  saveCvData(id: string, data: CvData): DemoState;
  unlockPsychometric(id: string): DemoState;
}
