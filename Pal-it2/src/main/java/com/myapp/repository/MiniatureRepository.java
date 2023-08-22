package com.myapp.repository;

import com.myapp.domain.Miniature;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Miniature entity.
 *
 * When extending this class, extend MiniatureRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface MiniatureRepository extends MiniatureRepositoryWithBagRelationships, JpaRepository<Miniature, Long> {
    default Optional<Miniature> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Miniature> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Miniature> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct miniature from Miniature miniature left join fetch miniature.user",
        countQuery = "select count(distinct miniature) from Miniature miniature"
    )
    Page<Miniature> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct miniature from Miniature miniature left join fetch miniature.user")
    List<Miniature> findAllWithToOneRelationships();

    @Query("select miniature from Miniature miniature left join fetch miniature.user where miniature.id =:id")
    Optional<Miniature> findOneWithToOneRelationships(@Param("id") Long id);
}
