package com.statmind.paf.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "counters")
public class Counter {

    @Id
    private String id; // "booking_sequence"

    private long seq;
}
