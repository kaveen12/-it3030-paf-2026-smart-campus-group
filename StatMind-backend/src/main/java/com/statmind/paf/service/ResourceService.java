package com.statmind.paf.service;

import com.statmind.paf.model.Resource;
import com.statmind.paf.repository.ResourceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ResourceService {

    @Autowired
    private ResourceRepository repository;

    // =========================
    // ADD RESOURCE
    // =========================
    public Resource saveResource(Resource resource) {

        String code = generateResourceCode(resource.getType());
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
    // SEARCH & FILTER (FIXED)
    // =========================
    public List<Resource> searchResources(String type, Integer capacity, String location) {

        List<Resource> resources = repository.findAll();

        return resources.stream()
                .filter(r -> type == null ||
                        r.getType().equalsIgnoreCase(type))
                .filter(r -> capacity == null ||
                        r.getCapacity() >= capacity)
                .filter(r -> location == null ||
                        r.getLocation().equalsIgnoreCase(location))
                .toList();
    }

    // =========================
    // UPDATE
    // =========================
    public Resource updateResource(String id, Resource newData) {

        Resource resource = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource Not Found"));

        resource.setName(newData.getName());
        resource.setType(newData.getType());
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
    // AUTO GENERATE CODE (FIXED)
    // =========================
    private String generateResourceCode(String type) {

        if (type == null) {
            return "RES-001";
        }

        String normalizedType = type.toUpperCase().trim();

        String prefix;

        switch (normalizedType) {

            case "LECTURE_HALL":
                prefix = "LH";
                break;

            case "LAB":
                prefix = "LAB";
                break;

            case "MEETING_ROOM":
                prefix = "MR";
                break;

            case "PROJECTOR":
            case "CAMERA":
            case "EQUIPMENT":
                prefix = "EQ";
                break;

            default:
                prefix = "RES";
        }

        long count = repository.findAll().stream()
                .filter(r -> r.getType() != null &&
                        r.getType().equalsIgnoreCase(type))
                .count() + 1;

        return prefix + "-" + String.format("%03d", count);
    }
}