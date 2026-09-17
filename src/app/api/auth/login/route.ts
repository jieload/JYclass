import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { phone, password } = await req.json();

    if (!phone || !password) {
      return NextResponse.json(
        { error: "请填写手机号和密码" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { phone },
    });
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "手机号或密码错误" },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "手机号或密码错误" },
        { status: 401 }
      );
    }

    const token = await createToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    // 登录仅在本地网络使用，不向任何外部服务器上报

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        phone: user.phone,
        email: user.email,
        name: user.name,
        school: user.school,
        role: user.role,
        motto: user.motto,
        studentMotto: user.studentMotto,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    const message = error instanceof Error ? error.message : "登录失败";
    return NextResponse.json({ error: "登录失败", detail: message }, { status: 500 });
  }
}
