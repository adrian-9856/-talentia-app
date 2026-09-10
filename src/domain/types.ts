export type Registration = {
  name: string; email: string; phone: string; municipality: string;
  programId: string; consent: boolean;
};
export type Profile = {
  education: string; trainingType: string; interest: string; experience: string;
  skills: string; availability: string; digitalBarrier: string; hasCV: string; objective: string;
};
export type StatusEvent = {
  id: string; enrollmentId: string; from: string; to: string; changedAt: string; changedBy: string;
};
export type Participant = {
  id: string; organizationId: string; name: string; email: string; phone: string;
  municipality: string; consent: boolean | null; consentAt: string | null;
  createdAt: string; source: "sample" | "registration";
  enrollment: { id: string; programId: string; status: string; statusChangedAt: string };
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
}
