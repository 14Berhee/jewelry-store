export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  role: 'admin' | 'user';
};
