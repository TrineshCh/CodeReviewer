import { Team } from '../types';

export const teams: Team[] = [
  {
    id: 'team-1',
    name: 'Backend Warriors',
    leadId: 'admin-1',
    memberIds: ['emp-1', 'emp-2', 'emp-3', 'emp-9'],
    project: 'Inventory Management System',
    description: 'Building the core backend services and APIs',
  },
  {
    id: 'team-2',
    name: 'Frontend Avengers',
    leadId: 'admin-2',
    memberIds: ['emp-4', 'emp-5', 'emp-6', 'emp-11'],
    project: 'Customer Portal Redesign',
    description: 'Redesigning the customer-facing web application',
  },
  {
    id: 'team-3',
    name: 'Cloud Ninjas',
    leadId: 'admin-1',
    memberIds: ['emp-7', 'emp-8', 'emp-10', 'emp-12'],
    project: 'Infrastructure Migration',
    description: 'Migrating on-premise infrastructure to cloud',
  },
];
