package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FormulaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Formula.class);
        Formula formula1 = new Formula();
        formula1.setId(1L);
        Formula formula2 = new Formula();
        formula2.setId(formula1.getId());
        assertThat(formula1).isEqualTo(formula2);
        formula2.setId(2L);
        assertThat(formula1).isNotEqualTo(formula2);
        formula1.setId(null);
        assertThat(formula1).isNotEqualTo(formula2);
    }
}
