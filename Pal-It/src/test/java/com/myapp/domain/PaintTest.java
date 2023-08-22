package com.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PaintTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Paint.class);
        Paint paint1 = new Paint();
        paint1.setId(1L);
        Paint paint2 = new Paint();
        paint2.setId(paint1.getId());
        assertThat(paint1).isEqualTo(paint2);
        paint2.setId(2L);
        assertThat(paint1).isNotEqualTo(paint2);
        paint1.setId(null);
        assertThat(paint1).isNotEqualTo(paint2);
    }
}
