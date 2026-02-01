import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    console.log("--- Спроба реєстрації ---");
    await connectDB();
    
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Всі поля обов'язкові" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Цей email вже зайнятий" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log("Користувач створений:", newUser.email);
    return NextResponse.json({ message: "Успіх" }, { status: 201 });

  } catch (error) {
    // ЦЕЙ РЯДОК ВИВЕДЕ ПОМИЛКУ В ТЕРМІНАЛ
    console.error("ПОМИЛКА РЕЄСТРАЦІЇ:", error.message); 
    
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}