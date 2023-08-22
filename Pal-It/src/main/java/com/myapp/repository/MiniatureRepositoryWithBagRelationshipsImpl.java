package com.myapp.repository;

import com.myapp.domain.Miniature;
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
public class MiniatureRepositoryWithBagRelationshipsImpl implements MiniatureRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Miniature> fetchBagRelationships(Optional<Miniature> miniature) {
        return miniature.map(this::fetchMiniatureFormulas);
    }

    @Override
    public Page<Miniature> fetchBagRelationships(Page<Miniature> miniatures) {
        return new PageImpl<>(fetchBagRelationships(miniatures.getContent()), miniatures.getPageable(), miniatures.getTotalElements());
    }

    @Override
    public List<Miniature> fetchBagRelationships(List<Miniature> miniatures) {
        return Optional.of(miniatures).map(this::fetchMiniatureFormulas).orElse(Collections.emptyList());
    }

    Miniature fetchMiniatureFormulas(Miniature result) {
        return entityManager
            .createQuery(
                "select miniature from Miniature miniature left join fetch miniature.miniatureFormulas where miniature is :miniature",
                Miniature.class
            )
            .setParameter("miniature", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Miniature> fetchMiniatureFormulas(List<Miniature> miniatures) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, miniatures.size()).forEach(index -> order.put(miniatures.get(index).getId(), index));
        List<Miniature> result = entityManager
            .createQuery(
                "select distinct miniature from Miniature miniature left join fetch miniature.miniatureFormulas where miniature in :miniatures",
                Miniature.class
            )
            .setParameter("miniatures", miniatures)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
