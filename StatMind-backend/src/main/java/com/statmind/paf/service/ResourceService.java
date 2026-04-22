package com.statmind.paf.service;

import com.statmind.paf.model.Resource;
import com.statmind.paf.repository.ResourceRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    // =========================
    // ADD RESOURCE
    // =========================
    public Resource saveResource(Resource resource) {

        String type = normalizeType(resource.getType());
        resource.setType(type);

        String code = generateResourceCode(type);
        resource.setResourceCode(code);

        return repository.save(resource);
    }

    // =========================
    // GET ALL
    // =========================
    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    // =========================
    // GET BY ID
    // =========================
    public Optional<Resource> getById(String id) {
        return repository.findById(id);
    }

    // =========================
    // GET BY CODE
    // =========================
    public Optional<Resource> getByCode(String code) {
        return repository.findByResourceCode(code);
    }

    // =========================
    // SEARCH
    // =========================
    public List<Resource> searchResources(String type, Integer capacity, String location) {

        List<Resource> resources = repository.findAll();

        return resources.stream()
                .filter(r -> type == null || r.getType().equalsIgnoreCase(type))
                .filter(r -> capacity == null || r.getCapacity() >= capacity)
                .filter(r -> location == null || r.getLocation().equalsIgnoreCase(location))
                .toList();
    }

    // =========================
    // BULK UPLOAD
    // =========================
    public void saveBulkResources(MultipartFile file) {

        try (Reader reader = new InputStreamReader(file.getInputStream())) {

            Iterable<CSVRecord> records = CSVFormat.DEFAULT
                    .withFirstRecordAsHeader()
                    .parse(reader);

            for (CSVRecord record : records) {

                Resource resource = new Resource();

                resource.setName(record.get("name"));

                String type = normalizeType(record.get("type"));
                resource.setType(type);

                resource.setCapacity(Integer.parseInt(record.get("capacity")));
                resource.setLocation(record.get("location").trim());

                resource.setStartDate(record.get("startDate"));
                resource.setStartTime(record.get("startTime"));
                resource.setEndDate(record.get("endDate"));
                resource.setEndTime(record.get("endTime"));

                resource.setStatus(record.get("status"));
                resource.setDescription(record.get("description"));

                String code = generateResourceCode(type);
                resource.setResourceCode(code);

                repository.save(resource);
            }

        } catch (Exception e) {
            throw new RuntimeException("CSV Failed: " + e.getMessage());
        }
    }

    // =========================
    // UPDATE
    // =========================
    public Resource updateResource(String id, Resource newData) {

        Resource resource = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource Not Found"));

        resource.setName(newData.getName());
        resource.setType(normalizeType(newData.getType()));
        resource.setCapacity(newData.getCapacity());
        resource.setLocation(newData.getLocation());

        resource.setStartDate(newData.getStartDate());
        resource.setStartTime(newData.getStartTime());
        resource.setEndDate(newData.getEndDate());
        resource.setEndTime(newData.getEndTime());

        resource.setStatus(newData.getStatus());
        resource.setDescription(newData.getDescription());

        return repository.save(resource);
    }

    // =========================
    // DELETE
    // =========================
    public String deleteResource(String id) {
        repository.deleteById(id);
        return "Resource Deleted Successfully";
    }

    // =========================
    // AUTO CODE GENERATOR (FIXED & SAFE)
    // =========================
   private final Map<String, Integer> sequenceMap = new HashMap<>();

private synchronized String generateResourceCode(String type) {

    String prefix = getPrefix(type);

    // initialize only once from DB
    if (!sequenceMap.containsKey(prefix)) {

        List<Resource> resources = repository.findAll();

        int max = 0;

        for (Resource r : resources) {

            String code = r.getResourceCode();

            if (code != null && code.startsWith(prefix + "-")) {

                try {
                    int num = Integer.parseInt(code.substring(prefix.length() + 1));
                    if (num > max) max = num;
                } catch (Exception ignored) {}
            }
        }

        sequenceMap.put(prefix, max);
    }

    // 🔥 ALWAYS increment (NO reuse)
    int next = sequenceMap.get(prefix) + 1;
    sequenceMap.put(prefix, next);

    return prefix + "-" + String.format("%03d", next);
}
    // NORMALIZE TYPE
    // =========================
    private String normalizeType(String type) {
        if (type == null) return "RES";

        type = type.toUpperCase().replace(" ", "_").trim();

        return switch (type) {
            case "LECTURE_HALL" -> "LECTURE_HALL";
            case "LAB" -> "LAB";
            case "MEETING_ROOM" -> "MEETING_ROOM";
            case "PROJECTOR", "CAMERA", "EQUIPMENT" -> "EQUIPMENT";
            default -> "RES";
        };
    }

    // =========================
    // PREFIX MAPPING
    // =========================
    private String getPrefix(String type) {
    if (type == null) return "RES";

    return switch (type.toUpperCase()) {
        case "LECTURE_HALL" -> "LH";
        case "LAB" -> "LAB";
        case "MEETING_ROOM" -> "MR";
        case "PROJECTOR", "CAMERA", "EQUIPMENT" -> "EQ";
        default -> "RES";
    };
}
}