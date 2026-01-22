import { z } from 'zod';

export const SigninFormSchema = z.object({
  identifier: z
    .string()
    .min(3, 'Имэйл эсвэл нэр дор хаяж 3 тэмдэгттэй байх ёстой'),

  password: z.string().min(6, 'Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой'),
});

export const SignupFormSchema = z.object({
  username: z.string().min(3, 'Нэр дор хаяж 3 тэмдэгтээс бүрдэх ёстой'),
  email: z.string().email('Имэйл хаяг буруу байна'),
  password: z.string().min(6, 'Нууц үг дор хаяж 6 үсэгээс бүрдсэн байх ёстой'),
});

export type FormState = {
  success?: boolean;
  message?: string;
  data?: {
    identifier?: string;
    username?: string;
    email?: string;
    password?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    role?: string;
  };
  zodErrors?: {
    identifier?: string[];
    username?: string[];
    email?: string[];
    password?: string[];
  } | null;
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
};
