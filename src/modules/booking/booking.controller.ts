import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBooking = async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    const user = req.user!;

    if (user.role !== "admin") {
      payload.customer_id = user.id;
    }

    const result = await bookingService.createBooking(payload);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        ...result.booking,
        vehicle: result.vehicle,
      },
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getAllBookings = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const result = await bookingService.getAllBookings(user);

    let formattedData;

    // admin view
    if (user.role === "admin") {
      formattedData = result.rows.map((row: any) => ({
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      }));
    }

    // customer view
    else {
      formattedData = result.rows.map((row: any) => ({
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.type,
        },
      }));
    }

    res.status(200).json({
      success: true,
      message:
        user.role === "admin"
          ? "Bookings retrieved successfully"
          : "Your bookings retrieved successfully",
      data: formattedData,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const bookingId = req.params.bookingId!;
    const { status } = req.body;
    const user = req.user!;

    const result = await bookingService.updateBooking(bookingId, status, user);

    res.status(200).json({
      success: true,
      message:
        status === "cancelled"
          ? "Booking cancelled successfully"
          : "Booking marked as returned. Vehicle is now available",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const bookingController = {
  createBooking,
  getAllBookings,
  updateBooking,
};
