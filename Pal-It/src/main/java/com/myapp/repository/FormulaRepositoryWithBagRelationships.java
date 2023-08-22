package com.myapp.repository;

import com.myapp.domain.Formula;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface FormulaRepositoryWithBagRelationships {
    Optional<Formula> fetchBagRelationships(Optional<Formula> formula);

    List<Formula> fetchBagRelationships(List<Formula> formulas);

    Page<Formula> fetchBagRelationships(Page<Formula> formulas);
}
