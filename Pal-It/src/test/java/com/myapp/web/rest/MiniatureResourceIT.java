package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Miniature;
import com.myapp.repository.MiniatureRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link MiniatureResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class MiniatureResourceIT {

    private static final String DEFAULT_MINIATURE_NAME = "AAAAAAAAAA";
    private static final String UPDATED_MINIATURE_NAME = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PICTURE = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PICTURE = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PICTURE_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PICTURE_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/miniatures";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private MiniatureRepository miniatureRepository;

    @Mock
    private MiniatureRepository miniatureRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restMiniatureMockMvc;

    private Miniature miniature;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Miniature createEntity(EntityManager em) {
        Miniature miniature = new Miniature()
            .miniatureName(DEFAULT_MINIATURE_NAME)
            .picture(DEFAULT_PICTURE)
            .pictureContentType(DEFAULT_PICTURE_CONTENT_TYPE);
        return miniature;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Miniature createUpdatedEntity(EntityManager em) {
        Miniature miniature = new Miniature()
            .miniatureName(UPDATED_MINIATURE_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);
        return miniature;
    }

    @BeforeEach
    public void initTest() {
        miniature = createEntity(em);
    }

    @Test
    @Transactional
    void createMiniature() throws Exception {
        int databaseSizeBeforeCreate = miniatureRepository.findAll().size();
        // Create the Miniature
        restMiniatureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(miniature)))
            .andExpect(status().isCreated());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeCreate + 1);
        Miniature testMiniature = miniatureList.get(miniatureList.size() - 1);
        assertThat(testMiniature.getMiniatureName()).isEqualTo(DEFAULT_MINIATURE_NAME);
        assertThat(testMiniature.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testMiniature.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createMiniatureWithExistingId() throws Exception {
        // Create the Miniature with an existing ID
        miniature.setId(1L);

        int databaseSizeBeforeCreate = miniatureRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restMiniatureMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(miniature)))
            .andExpect(status().isBadRequest());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllMiniatures() throws Exception {
        // Initialize the database
        miniatureRepository.saveAndFlush(miniature);

        // Get all the miniatureList
        restMiniatureMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(miniature.getId().intValue())))
            .andExpect(jsonPath("$.[*].miniatureName").value(hasItem(DEFAULT_MINIATURE_NAME)))
            .andExpect(jsonPath("$.[*].pictureContentType").value(hasItem(DEFAULT_PICTURE_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].picture").value(hasItem(Base64Utils.encodeToString(DEFAULT_PICTURE))));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMiniaturesWithEagerRelationshipsIsEnabled() throws Exception {
        when(miniatureRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMiniatureMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(miniatureRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllMiniaturesWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(miniatureRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restMiniatureMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(miniatureRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getMiniature() throws Exception {
        // Initialize the database
        miniatureRepository.saveAndFlush(miniature);

        // Get the miniature
        restMiniatureMockMvc
            .perform(get(ENTITY_API_URL_ID, miniature.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(miniature.getId().intValue()))
            .andExpect(jsonPath("$.miniatureName").value(DEFAULT_MINIATURE_NAME))
            .andExpect(jsonPath("$.pictureContentType").value(DEFAULT_PICTURE_CONTENT_TYPE))
            .andExpect(jsonPath("$.picture").value(Base64Utils.encodeToString(DEFAULT_PICTURE)));
    }

    @Test
    @Transactional
    void getNonExistingMiniature() throws Exception {
        // Get the miniature
        restMiniatureMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingMiniature() throws Exception {
        // Initialize the database
        miniatureRepository.saveAndFlush(miniature);

        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();

        // Update the miniature
        Miniature updatedMiniature = miniatureRepository.findById(miniature.getId()).get();
        // Disconnect from session so that the updates on updatedMiniature are not directly saved in db
        em.detach(updatedMiniature);
        updatedMiniature.miniatureName(UPDATED_MINIATURE_NAME).picture(UPDATED_PICTURE).pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restMiniatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedMiniature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedMiniature))
            )
            .andExpect(status().isOk());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
        Miniature testMiniature = miniatureList.get(miniatureList.size() - 1);
        assertThat(testMiniature.getMiniatureName()).isEqualTo(UPDATED_MINIATURE_NAME);
        assertThat(testMiniature.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testMiniature.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingMiniature() throws Exception {
        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();
        miniature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMiniatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, miniature.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(miniature))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchMiniature() throws Exception {
        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();
        miniature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiniatureMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(miniature))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamMiniature() throws Exception {
        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();
        miniature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiniatureMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(miniature)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateMiniatureWithPatch() throws Exception {
        // Initialize the database
        miniatureRepository.saveAndFlush(miniature);

        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();

        // Update the miniature using partial update
        Miniature partialUpdatedMiniature = new Miniature();
        partialUpdatedMiniature.setId(miniature.getId());

        restMiniatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMiniature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMiniature))
            )
            .andExpect(status().isOk());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
        Miniature testMiniature = miniatureList.get(miniatureList.size() - 1);
        assertThat(testMiniature.getMiniatureName()).isEqualTo(DEFAULT_MINIATURE_NAME);
        assertThat(testMiniature.getPicture()).isEqualTo(DEFAULT_PICTURE);
        assertThat(testMiniature.getPictureContentType()).isEqualTo(DEFAULT_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateMiniatureWithPatch() throws Exception {
        // Initialize the database
        miniatureRepository.saveAndFlush(miniature);

        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();

        // Update the miniature using partial update
        Miniature partialUpdatedMiniature = new Miniature();
        partialUpdatedMiniature.setId(miniature.getId());

        partialUpdatedMiniature
            .miniatureName(UPDATED_MINIATURE_NAME)
            .picture(UPDATED_PICTURE)
            .pictureContentType(UPDATED_PICTURE_CONTENT_TYPE);

        restMiniatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedMiniature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedMiniature))
            )
            .andExpect(status().isOk());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
        Miniature testMiniature = miniatureList.get(miniatureList.size() - 1);
        assertThat(testMiniature.getMiniatureName()).isEqualTo(UPDATED_MINIATURE_NAME);
        assertThat(testMiniature.getPicture()).isEqualTo(UPDATED_PICTURE);
        assertThat(testMiniature.getPictureContentType()).isEqualTo(UPDATED_PICTURE_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingMiniature() throws Exception {
        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();
        miniature.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restMiniatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, miniature.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(miniature))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchMiniature() throws Exception {
        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();
        miniature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiniatureMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(miniature))
            )
            .andExpect(status().isBadRequest());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamMiniature() throws Exception {
        int databaseSizeBeforeUpdate = miniatureRepository.findAll().size();
        miniature.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restMiniatureMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(miniature))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Miniature in the database
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteMiniature() throws Exception {
        // Initialize the database
        miniatureRepository.saveAndFlush(miniature);

        int databaseSizeBeforeDelete = miniatureRepository.findAll().size();

        // Delete the miniature
        restMiniatureMockMvc
            .perform(delete(ENTITY_API_URL_ID, miniature.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Miniature> miniatureList = miniatureRepository.findAll();
        assertThat(miniatureList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
