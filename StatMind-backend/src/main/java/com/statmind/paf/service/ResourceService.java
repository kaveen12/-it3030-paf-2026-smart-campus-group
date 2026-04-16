package com.statmind.paf.service;

import com.statmind.paf.model.Resource;
import com.statmind.paf.repository.ResourceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResourceService {

    private final ResourceRepository repository;

    public ResourceService(ResourceRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Resource addResource(Resource resource) {
        return repository.save(resource);
    }

    // GET ALL
    public List<Resource> getAllResources() {
        return repository.findAll();
    }

    // GET BY ID
    public Resource getResourceById(String id) {
        return repository.findById(id).orElse(null);
    }

    // UPDATE
    public Resource updateResource(String id, Resource updated) {
        Resource existing = getResourceById(id);
        if (existing == null) return null;

        existing.setName(updated.getName());
        existing.setType(updated.getType());
        existing.setCapacity(updated.getCapacity());
        existing.setLocation(updated.getLocation());
        existing.setStatus(updated.getStatus());
        existing.setAvailabilityWindows(updated.getAvailabilityWindows());

        return repository.save(existing);
    }

    // DELETE
    public void deleteResource(String id) {
        repository.deleteById(id);
    }

    // SEARCH / FILTER
    public List<Resource> search(String type, Integer capacity, String location) {

        if (type != null && capacity != null && location != null) {
            return repository.findByTypeAndCapacityGreaterThanEqualAndLocationContainingIgnoreCase(
                    type, capacity, location);
        }

        if (type != null) return repository.findByType(type);
        if (capacity != null) return repository.findByCapacityGreaterThanEqual(capacity);
        if (location != null) return repository.findByLocationContainingIgnoreCase(location);

        return repository.findAll();
    }
}