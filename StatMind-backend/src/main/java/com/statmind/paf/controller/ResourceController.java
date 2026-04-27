package com.statmind.paf.controller;

import com.statmind.paf.model.Resource;
import com.statmind.paf.service.ResourceService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class ResourceController {

    @Autowired
    private ResourceService service;

    // =========================
    // CREATE
    // =========================
    @PostMapping
    public Resource addResource(@RequestBody Resource resource) {
        return service.saveResource(resource);
    }

    // =========================
    // UPLOAD CSV
    // =========================
   @PostMapping(value = "/upload", consumes = "multipart/form-data")
public ResponseEntity<String> uploadCSV(@RequestParam("file") MultipartFile file) {

    if (file.isEmpty()) {
        return ResponseEntity.badRequest().body("File is empty ❌");
    }

    service.saveBulkResources(file);

    return ResponseEntity.ok("CSV uploaded successfully ✅");
}

    // =========================
    // GET ALL
    // =========================
    @GetMapping
    public List<Resource> getAllResources() {
        return service.getAllResources();
    }

    // =========================
    // GET BY ID
    // =========================
    @GetMapping("/{id}")
    public Optional<Resource> getById(@PathVariable String id) {
        return service.getById(id);
    }

    // =========================
    // GET BY CODE
    // =========================
    @GetMapping("/code/{code}")
    public Optional<Resource> getByCode(@PathVariable String code) {
        return service.getByCode(code);
    }

    // =========================
    // SEARCH & FILTER
    // =========================
    @GetMapping("/search")
    public List<Resource> searchResources(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String location
    ) {
        return service.searchResources(type, capacity, location);
    }

    // =========================
    // UPDATE
    // =========================
    @PutMapping("/{id}")
    public Resource updateResource(@PathVariable String id,
                                   @RequestBody Resource resource) {
        return service.updateResource(id, resource);
    }

    // =========================
    // DELETE
    // =========================
    @DeleteMapping("/{id}")
    public String deleteResource(@PathVariable String id) {
        return service.deleteResource(id);
    }
}