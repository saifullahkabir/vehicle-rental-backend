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

export const vehicleService = {
  createVehicle,
  getAllVehicles,
};
