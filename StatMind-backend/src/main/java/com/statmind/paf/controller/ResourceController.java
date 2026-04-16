package com.statmind.paf.controller;

import com.statmind.paf.model.Resource;
import com.statmind.paf.service.ResourceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin
public class ResourceController {

    private final ResourceService service;

    public ResourceController(ResourceService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Resource addResource(@RequestBody Resource resource) {
        return service.addResource(resource);
    }

    // GET ALL
    @GetMapping
    public List<Resource> getAll() {
        return service.getAllResources();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Resource getById(@PathVariable String id) {
        return service.getResourceById(id);
    }

    @GetMapping("/test")
    public String test() {
        return "Working!";
    }

    // UPDATE
    @PutMapping("/{id}")
    public Resource update(@PathVariable String id, @RequestBody Resource resource) {
        return service.updateResource(id, resource);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        service.deleteResource(id);
    }

    // SEARCH + FILTER
    @GetMapping("/search")
    public List<Resource> search(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location
    ) {
        return service.search(type, capacity, location);
    }
}