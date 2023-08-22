package com.myapp.repository;

import com.myapp.domain.Paint;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Paint entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PaintRepository extends JpaRepository<Paint, Long> {}
