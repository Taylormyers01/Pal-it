package taylor.rocks.palit.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import taylor.rocks.palit.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
