// ============================================
// REPOSITORY : ResourceRepository.java
// package com.statmind.paf.repository
// ============================================
package com.statmind.paf.repository;

import com.statmind.paf.model.Resource;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface ResourceRepository extends MongoRepository<Resource, String> {

    long countByType(String type);

    Optional<Resource> findByResourceCode(String resourceCode);
}