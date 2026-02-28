export type Role = 'admin' | 'employee';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  teamId: string;
  designation: string;
  joinedAt?: string;
}
