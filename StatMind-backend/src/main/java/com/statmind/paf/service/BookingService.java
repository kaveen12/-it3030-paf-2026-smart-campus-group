package com.statmind.paf.service;

import com.statmind.paf.model.Booking;
import com.statmind.paf.repository.BookingRepository;
import com.statmind.paf.util.SequenceGeneratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private SequenceGeneratorService sequenceGenerator;

    public Booking createBooking(Booking booking) {

        // 1️⃣ Generate Booking ID
        long seq = sequenceGenerator.generateSequence("booking_sequence");
        booking.setBookingId(String.format("Booking-%03d", seq));

        booking.setStatus("PENDING");

        // 2️⃣ Conflict Check
        List<Booking> existingBookings =
                bookingRepository.findByResourceCodeAndDate(
                        booking.getResourceCode(),
                        booking.getDate()
                );

        for (Booking b : existingBookings) {

            boolean overlap =
                    booking.getStartTime().isBefore(b.getEndTime()) &&
                    booking.getEndTime().isAfter(b.getStartTime());

            if (overlap && b.getStatus().equals("APPROVED")) {
                throw new RuntimeException("Time slot already booked!");
            }
        }

        return bookingRepository.save(booking);
    }

    // Approve Booking
    public Booking approveBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("APPROVED");
        return bookingRepository.save(booking);
    }

    // Reject Booking
    public Booking rejectBooking(String id, String reason) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    // Cancel Booking
    public Booking cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
