export type PersonType = 'REAL' | 'LEGAL';
export type Gender = 'MALE' | 'FEMALE';

export type Page = 'dashboard' | 'people' | 'services' | 'contracts';

export const OrganizationRoles = [
  "DEFAULT_ORG",
  "CUSTOMER",
  "CONSULTANT",
  "TAX_OFFICE",
  "SOCIAL_SECURITY_OFFICE",
  "BANK",
  "INVESTMENT_FUND"
] as const;
export type OrganizationRole = typeof OrganizationRoles[number];

export const LegalEntityTypes = [
    "PARTNERSHIP",
    "JOINT_STOCK_PARTNERSHIP",
    "LIMITED_PARTNERSHIP",
    "PUBLIC_JOINT_STOCK",
    "COOPERATIVE",
    "NON_COMMERCIAL_INSTITUTE",
    "FOREIGN_BRANCH",
    "FOREIGN_REPRESENTATIVE",
    "PUBLIC_COOPERATIVE",
    // "INVESTMENT_FUND" is covered by OrganizationRoles, but kept here if it's a distinct legal type
    "GOVERNMENT_COMPANY",
    "OTHER"
] as const;
export type LegalEntityType = typeof LegalEntityTypes[number];

export type FileFormat = 'image' | 'pdf' | 'docx' | 'other';

export interface Document {
  id: string; 
  type: string;
  description: string;
  fileName: string;
  fileFormat: FileFormat;
  file?: File; 
}

interface BasePerson {
  id: number;
  personType: PersonType;
  organizationRole: OrganizationRole;
  financialYearStart?: string; 
  email?: string;
  landline?: string;
  mobile?: string;
  address?: string;
  postalCode?: string;
  description?: string;
  documents: Document[];
}

export interface RealPerson extends BasePerson {
  personType: 'REAL';
  firstName: string;
  lastName: string;
  nationalId: string; 
  birthDate?: string; 
  gender?: Gender;
}

export interface LegalPerson extends BasePerson {
  personType: 'LEGAL';
  name: string;
  nationalId: string; 
  registrationDate?: string; 
  legalEntityType?: LegalEntityType;
}

export type Person = RealPerson | LegalPerson;

export const ServiceAreas = ['ACCOUNTING', 'TAX', 'REGISTRATION', 'TRAINING'] as const;
export type ServiceArea = typeof ServiceAreas[number];

export const ServiceStatuses = ['ACTIVE', 'INACTIVE'] as const;
export type ServiceStatus = typeof ServiceStatuses[number];

export const ActionActors = ['CUSTOMER', 'ORGANIZATION'] as const;
export type ActionActor = typeof ActionActors[number];

export const ActionFrequencies = [
  'CALENDAR_YEAR',
  'CALENDAR_MONTH',
  'CALENDAR_QUARTER',
  'FISCAL_YEAR',
  'FISCAL_QUARTER',
  'FISCAL_BIANNUAL',
] as const;
export type ActionFrequency = typeof ActionFrequencies[number];

export interface StandardAction {
  id: string; 
  title: string;
  actor: ActionActor;
  frequency: ActionFrequency;
  issuanceDay: number;
  prerequisiteActionId?: string | null;
}

export interface Service {
  id: number;
  code: string;
  title: string;
  area: ServiceArea;
  defaultPrice: number;
  defaultDuration: number; 
  status: ServiceStatus;
  standardActions: StandardAction[];
}

// User type for authentication
export interface User {
    id: number;
    username: string;
    name: string;
    role: string;
    avatarUrl: string;
}

// For the new personnel/expert list
export interface Personnel {
    id: number;
    userId: number; // Link to User ID
    name: string;
    nationalId: string;
    position: string;
    specialization: ServiceArea[];
    mobile: string;
    email: string;
}

// Contract types
export const ContractStatuses = ['REGISTERED', 'CONFIRMED', 'IN_PROGRESS', 'FINISHED', 'PENDING_FINISH', 'CLOSED'] as const;
export type ContractStatus = typeof ContractStatuses[number];

export interface ContractServiceItem {
  id: string; // From useFieldArray
  serviceId: number | null;
  initialDurationDays: number;
  price: number;
  description?: string;
  selectedStandardActionIds: string[];
}

// For the new access settings table
export const ContractRoleTypes = [
    'SERVICE_CONTACT_CUSTOMER',
    'CONTRACT_CONTACT_CUSTOMER',
    'SUPERVISOR_CUSTOMER',
    'SERVICE_EXPERT_ORG',
    'CONTRACT_EXPERT_ORG',
    'SUPERVISOR_ORG'
] as const;
export type ContractRoleType = typeof ContractRoleTypes[number];

export const NotificationMethods = [
    'PORTAL',
    'SMS',
    'EMAIL'
] as const;
export type NotificationMethod = typeof NotificationMethods[number];

export interface ContractAccessSetting {
    id: string; // for useFieldArray
    roleType: ContractRoleType;
    serviceArea: ServiceArea;
    personnelId: number | null;
    notificationMethods: NotificationMethod[];
    mobile?: string;
    email?: string;
}

export interface Contract {
  id: number;
  contractCode: string;
  title: string;
  customerId: number;
  serviceArea: ServiceArea;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  totalAmount: number;
  status: ContractStatus;
  contractServices: ContractServiceItem[];
  contractAccessSettings: ContractAccessSetting[];
}

export interface ContractFilters {
  serviceIds?: number[];
  serviceAreas?: ServiceArea[];
  startDate?: string;
  endDate?: string;
}