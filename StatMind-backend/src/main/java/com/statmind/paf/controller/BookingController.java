package com.statmind.paf.controller;

import com.statmind.paf.model.Booking;
import com.statmind.paf.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // CREATE booking
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // GET all bookings
    @GetMapping
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // APPROVE
    @PutMapping("/{id}/approve")
    public Booking approve(@PathVariable String id) {
        return bookingService.approveBooking(id);
    }

    // REJECT
    @PutMapping("/{id}/reject")
    public Booking reject(@PathVariable String id,
                          @RequestParam String reason) {
        return bookingService.rejectBooking(id, reason);
    }

    // CANCEL
    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable String id) {
        return bookingService.cancelBooking(id);
    }
}
