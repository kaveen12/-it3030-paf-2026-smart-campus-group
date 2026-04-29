package com.statmind.paf.service;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TicketPriorityService {

    private final List<String> highKeywords = List.of(
            "fire", "broken", "emergency", "leak", "power outage", "unusable"
    );

    private final List<String> mediumKeywords = List.of(
            "flickering", "slow", "noise", "intermittent"
    );

    private final List<String> lowKeywords = List.of(
            "dirty", "upgrade", "suggestion", "dusty"
    );

    public String analyzePriority(String description) {
        if (description == null || description.isBlank()) {
            return "MEDIUM";
        }

        String text = description.toLowerCase();

        int highScore = countMatches(text, highKeywords) * 3;
        int mediumScore = countMatches(text, mediumKeywords) * 2;
        int lowScore = countMatches(text, lowKeywords);

        if (highScore > 0 && highScore >= mediumScore && highScore >= lowScore) {
            return "HIGH";
        }

        if (mediumScore > 0 && mediumScore >= lowScore) {
            return "MEDIUM";
        }

        if (lowScore > 0) {
            return "LOW";
        }

        return "MEDIUM";
    }

    private int countMatches(String text, List<String> keywords) {
        int count = 0;

        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                count++;
            }
        }

        return count;
    }
}