// ============================================
// REPOSITORY : ResourceRepository.java
// package com.statmind.paf.repository
// ============================================
package com.statmind.paf.repository;

import com.statmind.paf.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.List;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    List<Resource> findByResourceCodeStartingWithIgnoreCase(String prefix);
    List<Resource> findByType(String type);

    Optional<Resource> findByResourceCode(String resourceCode);
}