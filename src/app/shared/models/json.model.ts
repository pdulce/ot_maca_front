/**
 * Modelo de datos para el JSON.
 */
export interface JsonStatus {
  id?: number;
  name?: string;
}
export interface JsonEnvironment {
  id?: number;
  userId?: any;
  name?: string;
  description?: string;
  status?: any;
  creationDate?: string;
  updateDate?: any;
  isDeleted?: number;
}
export interface JsonJiraProjects {
  id: number;
  jiraProject?: string;
  jenkinsJobName?: string;
  environment?: JsonEnvironment;
  creationDate?: any;
  updateDate?: any;
  isDeleted?: number;
}
export interface JsonSystem {
  id?: number;
  userId?: any;
  name?: string;
  key?: string;
  creationDate?: any;
  updateDate?: any;
  isDeleted?: number;
  jiraProjects?: JsonJiraProjects[];
  status?: JsonStatus;
}
export interface JsonSystemGroup {
  id?: number;
  userId?: any;
  name?: string;
  description?: string;
  systems?: JsonSystem[];
  creationDate?: string;
  updateDate?: string;
  status?: JsonStatus;
  isDeleted?: number;
}
export interface JsonRoleActions {
  id?: number;
  name?: string;
  description?: string;
  screen?: string;
  creationDate?: string;
  updateDate?: string;
  isDeleted?: number;
  isSelected?: number;
}
export interface JsonRole {
  id?: number;
  userId?: any;
  name?: string;
  description?: string;
  creationDate?: string;
  updateDate?: string;
  status?: JsonStatus;
  isDeleted?: number;
  roleActions?: JsonRoleActions[];
}
export interface JsonUser {
  id?: number;
  userId?: any;
  firstName?: string;
  lastName?: string;
  email?: string;
  username?: string;
  password?: string;
  role?: JsonRole;
  systemGroups?: JsonSystemGroup[];
  creationDate?: string;
  updateDate?: string;
  status?: JsonStatus;
  isDeleted: number;
}
export interface JsonPlanCases {
  id?: number;
  user?: JsonUser;
  caseId?: any;
  key?: string;
  summary?: string;
  status?: any;
  creationDate?: any;
  updateDate?: any;
  isDeleted?: number;
}
export interface Json {
  id?: number;
  userId?: any;
  jiraProject?: string;
  jiraProjectTitle?: string;
  jiraProjectDescription?: string;
  jiraTestCountOk?: any;
  jiraTestCountKo?: any;
  jenkinsJobName?: any;
  jenkinsJobStatus?: string;
  jenkinsJobId?: any;
  xrayId?: any;
  systemGroup?: JsonSystemGroup;
  system?: JsonSystem;
  environment?: JsonEnvironment;
  launchDate?: any;
  periodically?: any;
  source?: string;
  creationDate?: string;
  updateDate?: string;
  isDeleted?: number;
  planCases?: JsonPlanCases[];
}
