package com.myapp.repository;

import com.myapp.domain.Formula;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Formula entity.
 *
 * When extending this class, extend FormulaRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface FormulaRepository extends FormulaRepositoryWithBagRelationships, JpaRepository<Formula, Long> {
    default Optional<Formula> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Formula> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Formula> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct formula from Formula formula left join fetch formula.user",
        countQuery = "select count(distinct formula) from Formula formula"
    )
    Page<Formula> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct formula from Formula formula left join fetch formula.user")
    List<Formula> findAllWithToOneRelationships();

    @Query("select formula from Formula formula left join fetch formula.user where formula.id =:id")
    Optional<Formula> findOneWithToOneRelationships(@Param("id") Long id);

}
