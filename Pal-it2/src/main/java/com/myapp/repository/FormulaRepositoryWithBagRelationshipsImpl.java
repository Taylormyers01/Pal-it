package com.myapp.repository;

import com.myapp.domain.Formula;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class FormulaRepositoryWithBagRelationshipsImpl implements FormulaRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Formula> fetchBagRelationships(Optional<Formula> formula) {
        return formula.map(this::fetchPaintFormulas);
    }

    @Override
    public Page<Formula> fetchBagRelationships(Page<Formula> formulas) {
        return new PageImpl<>(fetchBagRelationships(formulas.getContent()), formulas.getPageable(), formulas.getTotalElements());
    }

    @Override
    public List<Formula> fetchBagRelationships(List<Formula> formulas) {
        return Optional.of(formulas).map(this::fetchPaintFormulas).orElse(Collections.emptyList());
    }

    Formula fetchPaintFormulas(Formula result) {
        return entityManager
            .createQuery(
                "select formula from Formula formula left join fetch formula.paintFormulas where formula is :formula",
                Formula.class
            )
            .setParameter("formula", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Formula> fetchPaintFormulas(List<Formula> formulas) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, formulas.size()).forEach(index -> order.put(formulas.get(index).getId(), index));
        List<Formula> result = entityManager
            .createQuery(
                "select distinct formula from Formula formula left join fetch formula.paintFormulas where formula in :formulas",
                Formula.class
            )
            .setParameter("formulas", formulas)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
