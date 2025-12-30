import { pool } from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, phone, role FROM users`
  );

  return result;
};

const updateUser = async (id: string, payload: Record<string, any>) => {
  const { name, email, phone, role } = payload;

  const result = await pool.query(
    `UPDATE users SET name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING *`,
    [name, email, phone, role, id]
  );

  delete result.rows[0].password;
  return result;
};

const deleteUser = async (userId: string) => {
  // check active bookings
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE customer_id=$1 AND status='active'`,
    [userId]
  );
  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete user active bookings exist");
  }

  // check user exists
  const existingUser = await pool.query(`SELECT * FROM users WHERE id=$1`, [
    userId,
  ]);
  if (existingUser.rows.length === 0) {
    throw new Error("User not found");
  }

  // delete user
  const result = await pool.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
    userId,
  ]);
  return result.rows[0];
};

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
