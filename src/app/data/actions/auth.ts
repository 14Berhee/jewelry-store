'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignupFormSchema } from '@/lib/validation/auth';
import type { FormState } from '@/lib/validation/auth';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function registerUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const rawData = {
    username: formData.get('username'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const parsed = SignupFormSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      zodErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { username, email, password } = parsed.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    return {
      success: false,
      message: 'Имэйл хаяг аль хэдийн бүртгэлтэй байна',
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: username,
      email,
      password: hashedPassword,
      role: 'USER',
    },
  });

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  (await cookies()).set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    data: {
      username: user.name,
      email: user.email,
      role: user.role,
    },
    message: 'Хаяг ажилттай бүртгэгдлээ',
  };
}

export async function loginUserAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const identifier = formData.get('identifier') as string;
  const password = formData.get('password') as string;

  if (!identifier || !password) {
    return { success: false, message: 'Бүх талбарыг бөглөнө үү' };
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { name: identifier }] },
  });

  if (!user) return { success: false, message: 'Хэрэглэгч олдсонгүй' };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { success: false, message: 'Нууц үг буруу байна' };

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  );

  (await cookies()).set({
    name: 'token',
    value: token,
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  });

  return {
    success: true,
    data: { username: user.name, email: user.email, role: user.role },
    message: 'Амжилттай нэвтэрлээ',
  };
}

type PasswordResetRequestState = {
  success: boolean;
  message: string;
  devToken?: string;
};

export async function requestPasswordResetAction(
  prevState: PasswordResetRequestState,
  formData: FormData
): Promise<PasswordResetRequestState> {
  const email = formData.get('email') as string;

  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Зөв имэйл хаяг оруулна уу',
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return {
        success: true,
        message:
          'Хэрэв таны имэйл бүртгэлтэй бол нууц үг сэргээх холбоос илгээгдсэн',
      };
    }

    const resetToken = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: '1h' }
    );

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: resetToken,
        resetTokenExpiry: new Date(Date.now() + 3600000),
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl, user.name);

      return {
        success: true,
        message: 'Нууц үг сэргээх холбоос таны имэйл рүү илгээгдлээ',
      };
    } catch (emailError) {
      console.error('Email sending failed:', emailError);

      console.log('Password reset token:', resetToken);
      console.log('Reset URL:', resetUrl);

      return {
        success: true,
        message: 'Нууц үг сэргээх холбоос таны имэйл рүү илгээгдлээ',
      };
    }
  } catch (error) {
    console.error('Password reset request error:', error);
    return {
      success: false,
      message: 'Алдаа гарлаа. Дахин оролдоно уу',
    };
  }
}

type PasswordResetState = {
  success: boolean;
  message: string;
  data?: {
    role: string;
  };
};

export async function resetPasswordAction(
  prevState: PasswordResetState,
  formData: FormData
): Promise<PasswordResetState> {
  const token = formData.get('token') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!token) {
    return {
      success: false,
      message: 'Буруу холбоос',
    };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой',
    };
  }

  if (password !== confirmPassword) {
    return {
      success: false,
      message: 'Нууц үг таарахгүй байна',
    };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.userId,
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        success: false,
        message: 'Холбоос хүчингүй эсвэл хугацаа дууссан байна',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    const loginToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    (await cookies()).set({
      name: 'token',
      value: loginToken,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      success: true,
      message: 'Нууц үг амжилттай солигдлоо',
      data: {
        role: user.role,
      },
    };
  } catch (error) {
    console.error('Password reset error:', error);
    return {
      success: false,
      message: 'Холбоос хүчингүй эсвэл хугацаа дууссан байна',
    };
  }
}

async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  name: string
) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'My Jewelry <onboarding@resend.dev>',
      to: [email],
      subject: 'Нууц үг сэргээх - My Jewelry',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(to right, #ec4899, #f43f5e); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
              .button { display: inline-block; background: linear-gradient(to right, #ec4899, #f43f5e); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
              .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>My Jewelry</h1>
              </div>
              <div class="content">
                <h2>Сайн байна уу, ${name}!</h2>
                <p>Та нууц үгээ сэргээхийг хүссэн байна.</p>
                <p>Дараах товч дээр дарж нууц үгээ шинэчилнэ үү:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Нууц үг сэргээх</a>
                </div>
                <p><strong>Анхаар:</strong> Энэ холбоос 1 цагийн дараа хүчингүй болно.</p>
                <p>Хэрэв та нууц үгээ сэргээхийг хүсээгүй бол энэ имэйлийг үл хэрэгсэнэ үү.</p>
                <p>Хүндэтгэсэн,<br>My Jewelry баг</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} My Jewelry. Бүх эрх хуулиар хамгаалагдсан.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      throw error;
    }

    console.log('✅ Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}
