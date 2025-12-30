import { pool } from "../../config/db";

//* create vehicle
const createVehicle = async (payload: Record<string, any>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
    INSERT INTO vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  return result;
};

//* get all vehicles
const getAllVehicles = async () => {
  const result = await pool.query(`SELECT * FROM vehicles`);
  return result;
};

//* get a single vehicle
const getVehicleById = async (id: string) => {
  const result = await pool.query(
    `
    SELECT * FROM vehicles WHERE id=$1
    `,
    [id]
  );

  return result;
};

//* update vehicle
const updateVehicle = async (id: string, payload: Record<string, any>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const result = await pool.query(
    `
    UPDATE vehicles SET vehicle_name = COALESCE($1, vehicle_name), type = COALESCE($2, type),registration_number = COALESCE($3, registration_number), daily_rent_price = COALESCE($4, daily_rent_price), availability_status = COALESCE($5, availability_status) WHERE id=$6 RETURNING *
    `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      id,
    ]
  );

  return result;
};

//* delete vehicle
const deleteVehicle = async (vehicleId: string) => {
  // check for active bookings
  const bookings = await pool.query(
    `SELECT * FROM bookings WHERE vehicle_id=$1 AND status='active'`,
    [vehicleId]
  );

  if (bookings.rows.length > 0) {
    throw new Error("Cannot delete vehicle: active bookings exist");
  }

  // check if vehicle exists
  const vehicle = await pool.query(`SELECT * FROM vehicles WHERE id=$1`, [
    vehicleId,
  ]);
  if (vehicle.rows.length === 0) {
    throw new Error("Vehicle not found");
  }

  await pool.query(`DELETE FROM vehicles WHERE id=$1`, [vehicleId]);
  return;
};

export const vehicleService = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
