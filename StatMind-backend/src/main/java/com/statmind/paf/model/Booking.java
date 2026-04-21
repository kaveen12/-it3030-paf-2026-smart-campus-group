package com.statmind.paf.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    private String bookingId;   // Booking-001
    private String resourceCode; // from Module A 

    private String userName; 

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String purpose;
    private int attendees;

    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
    private String rejectionReason;

    private String userId;
}
