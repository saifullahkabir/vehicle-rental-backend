import bcrypt from "bcryptjs";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

//* signup user
const signupUser = async (payload: Record<string, unknown>) => {
  let { name, email, password, phone, role } = payload;

  email = (email as string).toLowerCase();

  if ((password as string).length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  const hashedPass = await bcrypt.hash(password as string, 10);

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role]
  );

  delete result.rows[0].password;
  return result;
};

//* singin user
const signinUser = async (email: string, password: string) => {
  const result = await pool.query(
    `
    SELECT * FROM users WHERE email=$1
    `,
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("User not found!");
  }

  const matchPassword = await bcrypt.compare(password, result.rows[0].password);

  if (!matchPassword) {
    throw new Error("Invalid Credentials!");
  }

  const jwtPayload = {
    id: result.rows[0].id,
    email: result.rows[0].email,
    role: result.rows[0].role,
  };

  const secret = config.jwtSecret as string;
  const token = jwt.sign(jwtPayload, secret, {
    expiresIn: "7d",
  });

  delete result.rows[0].password;

  return { token, user: result.rows[0] };
};

export const authService = {
  signupUser,
  signinUser,
};
