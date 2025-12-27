import bcrypt from "bcryptjs";
import { pool } from "../../config/db";

//* signup user
const signupUser = async (payload: Record<string, unknown>) => {
  let { name, email, password, phone, role } = payload;

  email = (email as string).toLowerCase();

  if((password as string).length < 6){
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

export const authService = {
  signupUser,
};
