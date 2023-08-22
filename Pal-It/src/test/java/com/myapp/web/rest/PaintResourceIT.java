package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Paint;
import com.myapp.repository.PaintRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link PaintResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class PaintResourceIT {

    private static final String DEFAULT_BRAND = "AAAAAAAAAA";
    private static final String UPDATED_BRAND = "BBBBBBBBBB";

    private static final String DEFAULT_PAINT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_PAINT_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/paints";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PaintRepository paintRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPaintMockMvc;

    private Paint paint;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Paint createEntity(EntityManager em) {
        Paint paint = new Paint().brand(DEFAULT_BRAND).paintName(DEFAULT_PAINT_NAME);
        return paint;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Paint createUpdatedEntity(EntityManager em) {
        Paint paint = new Paint().brand(UPDATED_BRAND).paintName(UPDATED_PAINT_NAME);
        return paint;
    }

    @BeforeEach
    public void initTest() {
        paint = createEntity(em);
    }

    @Test
    @Transactional
    void createPaint() throws Exception {
        int databaseSizeBeforeCreate = paintRepository.findAll().size();
        // Create the Paint
        restPaintMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paint)))
            .andExpect(status().isCreated());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeCreate + 1);
        Paint testPaint = paintList.get(paintList.size() - 1);
        assertThat(testPaint.getBrand()).isEqualTo(DEFAULT_BRAND);
        assertThat(testPaint.getPaintName()).isEqualTo(DEFAULT_PAINT_NAME);
    }

    @Test
    @Transactional
    void createPaintWithExistingId() throws Exception {
        // Create the Paint with an existing ID
        paint.setId(1L);

        int databaseSizeBeforeCreate = paintRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPaintMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paint)))
            .andExpect(status().isBadRequest());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPaints() throws Exception {
        // Initialize the database
        paintRepository.saveAndFlush(paint);

        // Get all the paintList
        restPaintMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(paint.getId().intValue())))
            .andExpect(jsonPath("$.[*].brand").value(hasItem(DEFAULT_BRAND)))
            .andExpect(jsonPath("$.[*].paintName").value(hasItem(DEFAULT_PAINT_NAME)));
    }

    @Test
    @Transactional
    void getPaint() throws Exception {
        // Initialize the database
        paintRepository.saveAndFlush(paint);

        // Get the paint
        restPaintMockMvc
            .perform(get(ENTITY_API_URL_ID, paint.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(paint.getId().intValue()))
            .andExpect(jsonPath("$.brand").value(DEFAULT_BRAND))
            .andExpect(jsonPath("$.paintName").value(DEFAULT_PAINT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingPaint() throws Exception {
        // Get the paint
        restPaintMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPaint() throws Exception {
        // Initialize the database
        paintRepository.saveAndFlush(paint);

        int databaseSizeBeforeUpdate = paintRepository.findAll().size();

        // Update the paint
        Paint updatedPaint = paintRepository.findById(paint.getId()).get();
        // Disconnect from session so that the updates on updatedPaint are not directly saved in db
        em.detach(updatedPaint);
        updatedPaint.brand(UPDATED_BRAND).paintName(UPDATED_PAINT_NAME);

        restPaintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPaint.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPaint))
            )
            .andExpect(status().isOk());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
        Paint testPaint = paintList.get(paintList.size() - 1);
        assertThat(testPaint.getBrand()).isEqualTo(UPDATED_BRAND);
        assertThat(testPaint.getPaintName()).isEqualTo(UPDATED_PAINT_NAME);
    }

    @Test
    @Transactional
    void putNonExistingPaint() throws Exception {
        int databaseSizeBeforeUpdate = paintRepository.findAll().size();
        paint.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, paint.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paint))
            )
            .andExpect(status().isBadRequest());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPaint() throws Exception {
        int databaseSizeBeforeUpdate = paintRepository.findAll().size();
        paint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaintMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(paint))
            )
            .andExpect(status().isBadRequest());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPaint() throws Exception {
        int databaseSizeBeforeUpdate = paintRepository.findAll().size();
        paint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaintMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(paint)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePaintWithPatch() throws Exception {
        // Initialize the database
        paintRepository.saveAndFlush(paint);

        int databaseSizeBeforeUpdate = paintRepository.findAll().size();

        // Update the paint using partial update
        Paint partialUpdatedPaint = new Paint();
        partialUpdatedPaint.setId(paint.getId());

        restPaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaint))
            )
            .andExpect(status().isOk());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
        Paint testPaint = paintList.get(paintList.size() - 1);
        assertThat(testPaint.getBrand()).isEqualTo(DEFAULT_BRAND);
        assertThat(testPaint.getPaintName()).isEqualTo(DEFAULT_PAINT_NAME);
    }

    @Test
    @Transactional
    void fullUpdatePaintWithPatch() throws Exception {
        // Initialize the database
        paintRepository.saveAndFlush(paint);

        int databaseSizeBeforeUpdate = paintRepository.findAll().size();

        // Update the paint using partial update
        Paint partialUpdatedPaint = new Paint();
        partialUpdatedPaint.setId(paint.getId());

        partialUpdatedPaint.brand(UPDATED_BRAND).paintName(UPDATED_PAINT_NAME);

        restPaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPaint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPaint))
            )
            .andExpect(status().isOk());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
        Paint testPaint = paintList.get(paintList.size() - 1);
        assertThat(testPaint.getBrand()).isEqualTo(UPDATED_BRAND);
        assertThat(testPaint.getPaintName()).isEqualTo(UPDATED_PAINT_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingPaint() throws Exception {
        int databaseSizeBeforeUpdate = paintRepository.findAll().size();
        paint.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, paint.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paint))
            )
            .andExpect(status().isBadRequest());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPaint() throws Exception {
        int databaseSizeBeforeUpdate = paintRepository.findAll().size();
        paint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaintMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(paint))
            )
            .andExpect(status().isBadRequest());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPaint() throws Exception {
        int databaseSizeBeforeUpdate = paintRepository.findAll().size();
        paint.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPaintMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(paint)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Paint in the database
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePaint() throws Exception {
        // Initialize the database
        paintRepository.saveAndFlush(paint);

        int databaseSizeBeforeDelete = paintRepository.findAll().size();

        // Delete the paint
        restPaintMockMvc
            .perform(delete(ENTITY_API_URL_ID, paint.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Paint> paintList = paintRepository.findAll();
        assertThat(paintList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
