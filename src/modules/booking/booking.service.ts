import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, any>) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // check vehicle availability
  const vehicleResult = await pool.query(
    `SELECT * FROM vehicles WHERE id=$1 AND availability_status='available'`,
    [vehicle_id]
  );

  if (vehicleResult.rows.length === 0) {
    throw new Error("Vehicle not available");
  }

  const formatDate = (date: string | Date) => {
    new Date(date).toISOString().substring(0, 10);
  };

  const vehicle = vehicleResult.rows[0];
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  if (end < start) {
    throw new Error("End date must be after start date");
  }

  const totalTime = end.getTime() - start.getTime();
  const numberOfDays = Math.ceil(totalTime / (1000 * 60 * 60 * 24));
  const total_price = vehicle.daily_rent_price * numberOfDays;

  const result = await pool.query(
    `INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1,$2,$3,$4,$5,'active') RETURNING *`,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status to booked
  await pool.query(
    `UPDATE vehicles SET availability_status='booked' WHERE id=$1`,
    [vehicle_id]
  );

  return {
    booking: {
      ...result.rows[0],
      rent_start_date: new Date(result.rows[0].rent_start_date)
        .toISOString()
        .substring(0, 10),
      rent_end_date: new Date(result.rows[0].rent_end_date)
        .toISOString()
        .substring(0, 10),
    },
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

const getAllBookings = async (user: any) => {
  if (user.role === "admin") {
    const result = await pool.query(`
  SELECT 
    bookings.id,
    bookings.customer_id,
    bookings.vehicle_id,
    bookings.rent_start_date,
    bookings.rent_end_date,
    bookings.total_price,
    bookings.status,
    users.name AS customer_name,
    users.email AS customer_email,
    vehicles.vehicle_name,
    vehicles.registration_number
  FROM bookings
  JOIN users ON bookings.customer_id = users.id
  JOIN vehicles ON bookings.vehicle_id = vehicles.id
`);
    return result;
  } else {
    const result = await pool.query(
      `
  SELECT 
    bookings.id,
    bookings.vehicle_id,
    bookings.rent_start_date,
    bookings.rent_end_date,
    bookings.total_price,
    bookings.status,
    vehicles.vehicle_name,
    vehicles.registration_number,
    vehicles.type
  FROM bookings
  JOIN vehicles ON bookings.vehicle_id = vehicles.id
  WHERE bookings.customer_id = $1
`,
      [user.id]
    );
    return result;
  }
};

export const bookingService = {
  createBooking,
  getAllBookings,
};
