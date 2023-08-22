package com.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.myapp.IntegrationTest;
import com.myapp.domain.Formula;
import com.myapp.repository.FormulaRepository;
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

/**
 * Integration tests for the {@link FormulaResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class FormulaResourceIT {

    private static final String DEFAULT_FORMULA_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FORMULA_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/formulas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private FormulaRepository formulaRepository;

    @Mock
    private FormulaRepository formulaRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restFormulaMockMvc;

    private Formula formula;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Formula createEntity(EntityManager em) {
        Formula formula = new Formula().formulaName(DEFAULT_FORMULA_NAME);
        return formula;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Formula createUpdatedEntity(EntityManager em) {
        Formula formula = new Formula().formulaName(UPDATED_FORMULA_NAME);
        return formula;
    }

    @BeforeEach
    public void initTest() {
        formula = createEntity(em);
    }

    @Test
    @Transactional
    void createFormula() throws Exception {
        int databaseSizeBeforeCreate = formulaRepository.findAll().size();
        // Create the Formula
        restFormulaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formula)))
            .andExpect(status().isCreated());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeCreate + 1);
        Formula testFormula = formulaList.get(formulaList.size() - 1);
        assertThat(testFormula.getFormulaName()).isEqualTo(DEFAULT_FORMULA_NAME);
    }

    @Test
    @Transactional
    void createFormulaWithExistingId() throws Exception {
        // Create the Formula with an existing ID
        formula.setId(1L);

        int databaseSizeBeforeCreate = formulaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restFormulaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formula)))
            .andExpect(status().isBadRequest());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkFormulaNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = formulaRepository.findAll().size();
        // set the field null
        formula.setFormulaName(null);

        // Create the Formula, which fails.

        restFormulaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formula)))
            .andExpect(status().isBadRequest());

        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllFormulas() throws Exception {
        // Initialize the database
        formulaRepository.saveAndFlush(formula);

        // Get all the formulaList
        restFormulaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(formula.getId().intValue())))
            .andExpect(jsonPath("$.[*].formulaName").value(hasItem(DEFAULT_FORMULA_NAME)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFormulasWithEagerRelationshipsIsEnabled() throws Exception {
        when(formulaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFormulaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(formulaRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllFormulasWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(formulaRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restFormulaMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(formulaRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getFormula() throws Exception {
        // Initialize the database
        formulaRepository.saveAndFlush(formula);

        // Get the formula
        restFormulaMockMvc
            .perform(get(ENTITY_API_URL_ID, formula.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(formula.getId().intValue()))
            .andExpect(jsonPath("$.formulaName").value(DEFAULT_FORMULA_NAME));
    }

    @Test
    @Transactional
    void getNonExistingFormula() throws Exception {
        // Get the formula
        restFormulaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingFormula() throws Exception {
        // Initialize the database
        formulaRepository.saveAndFlush(formula);

        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();

        // Update the formula
        Formula updatedFormula = formulaRepository.findById(formula.getId()).get();
        // Disconnect from session so that the updates on updatedFormula are not directly saved in db
        em.detach(updatedFormula);
        updatedFormula.formulaName(UPDATED_FORMULA_NAME);

        restFormulaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedFormula.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedFormula))
            )
            .andExpect(status().isOk());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
        Formula testFormula = formulaList.get(formulaList.size() - 1);
        assertThat(testFormula.getFormulaName()).isEqualTo(UPDATED_FORMULA_NAME);
    }

    @Test
    @Transactional
    void putNonExistingFormula() throws Exception {
        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();
        formula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormulaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, formula.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchFormula() throws Exception {
        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();
        formula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(formula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamFormula() throws Exception {
        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();
        formula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(formula)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateFormulaWithPatch() throws Exception {
        // Initialize the database
        formulaRepository.saveAndFlush(formula);

        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();

        // Update the formula using partial update
        Formula partialUpdatedFormula = new Formula();
        partialUpdatedFormula.setId(formula.getId());

        partialUpdatedFormula.formulaName(UPDATED_FORMULA_NAME);

        restFormulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormula))
            )
            .andExpect(status().isOk());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
        Formula testFormula = formulaList.get(formulaList.size() - 1);
        assertThat(testFormula.getFormulaName()).isEqualTo(UPDATED_FORMULA_NAME);
    }

    @Test
    @Transactional
    void fullUpdateFormulaWithPatch() throws Exception {
        // Initialize the database
        formulaRepository.saveAndFlush(formula);

        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();

        // Update the formula using partial update
        Formula partialUpdatedFormula = new Formula();
        partialUpdatedFormula.setId(formula.getId());

        partialUpdatedFormula.formulaName(UPDATED_FORMULA_NAME);

        restFormulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedFormula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedFormula))
            )
            .andExpect(status().isOk());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
        Formula testFormula = formulaList.get(formulaList.size() - 1);
        assertThat(testFormula.getFormulaName()).isEqualTo(UPDATED_FORMULA_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingFormula() throws Exception {
        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();
        formula.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restFormulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, formula.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchFormula() throws Exception {
        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();
        formula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(formula))
            )
            .andExpect(status().isBadRequest());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamFormula() throws Exception {
        int databaseSizeBeforeUpdate = formulaRepository.findAll().size();
        formula.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restFormulaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(formula)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Formula in the database
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteFormula() throws Exception {
        // Initialize the database
        formulaRepository.saveAndFlush(formula);

        int databaseSizeBeforeDelete = formulaRepository.findAll().size();

        // Delete the formula
        restFormulaMockMvc
            .perform(delete(ENTITY_API_URL_ID, formula.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Formula> formulaList = formulaRepository.findAll();
        assertThat(formulaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
