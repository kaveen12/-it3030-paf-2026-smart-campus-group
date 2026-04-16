package com.statmind.paf.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Resource {

    @Id
    private String id;

    private String name;
    private String type; // LECTURE_HALL, LAB, MEETING_ROOM, EQUIPMENT

    private int capacity;
    private String location;

    private String status; // ACTIVE, OUT_OF_SERVICE

    private List<String> availabilityWindows; // e.g. ["MON 9-12", "TUE 2-5"]
}