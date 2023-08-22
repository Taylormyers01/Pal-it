package com.myapp.repository;

import com.myapp.domain.Miniature;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface MiniatureRepositoryWithBagRelationships {
    Optional<Miniature> fetchBagRelationships(Optional<Miniature> miniature);

    List<Miniature> fetchBagRelationships(List<Miniature> miniatures);

    Page<Miniature> fetchBagRelationships(Page<Miniature> miniatures);
}
