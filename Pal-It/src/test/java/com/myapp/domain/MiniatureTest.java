package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class MiniatureTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Miniature.class);
        Miniature miniature1 = new Miniature();
        miniature1.setId(1L);
        Miniature miniature2 = new Miniature();
        miniature2.setId(miniature1.getId());
        assertThat(miniature1).isEqualTo(miniature2);
        miniature2.setId(2L);
        assertThat(miniature1).isNotEqualTo(miniature2);
        miniature1.setId(null);
        assertThat(miniature1).isNotEqualTo(miniature2);
    }
}
