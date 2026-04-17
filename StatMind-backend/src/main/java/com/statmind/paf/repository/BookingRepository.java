package com.statmind.paf.repository;

import com.statmind.paf.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {

    List<Booking> findByResourceCodeAndDate(
            String resourceCode, LocalDate date
    );
}
