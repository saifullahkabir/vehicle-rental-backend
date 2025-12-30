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

const updateBooking = async (bookingId: string, status: string, user: any) => {
  // booking exists?
  const bookingRes = await pool.query(`SELECT * FROM bookings WHERE id=$1`, [
    bookingId,
  ]);

  if (bookingRes.rowCount === 0) {
    throw new Error("Booking not found");
  }

  const booking = bookingRes.rows[0];

  // customer
  if (user.role === "customer") {
    if (booking.customer_id !== user.id) {
      throw new Error("You can only update your own booking");
    }

    if (status !== "cancelled") {
      throw new Error("Customer can only cancel booking");
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new Error("Cannot cancel after rent start date");
    }
  }

  // admin
  if (user.role === "admin") {
    if (status !== "returned") {
      throw new Error("Admin can only mark booking as returned");
    }
  }

  // update booking
  const updateRes = await pool.query(
    `UPDATE bookings SET status=$1 WHERE id=$2 RETURNING *`,
    [status, bookingId]
  );

  // update vehicle availability
  if (status === "cancelled" || status === "returned") {
    await pool.query(
      `UPDATE vehicles SET availability_status='available' WHERE id=$1`,
      [booking.vehicle_id]
    );
  }

  if (status === "returned") {
    return {
      ...updateRes.rows[0],
      vehicle: { availability_status: "available" },
    };
  }

  return updateRes.rows[0];
};

export const bookingService = {
  createBooking,
  getAllBookings,
  updateBooking,
};
