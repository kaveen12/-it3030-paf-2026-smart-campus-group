package com.statmind.paf.repository;

import com.statmind.paf.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByType(String type);

    List<Resource> findByCapacityGreaterThanEqual(int capacity);

    List<Resource> findByLocationContainingIgnoreCase(String location);

    List<Resource> findByTypeAndCapacityGreaterThanEqualAndLocationContainingIgnoreCase(
            String type, int capacity, String location
    );
}