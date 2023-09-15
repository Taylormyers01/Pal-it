package com.myapp.web.rest;

import com.myapp.domain.Paint;
import com.myapp.repository.PaintRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Paint}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PaintResource {

    private final Logger log = LoggerFactory.getLogger(PaintResource.class);

    private static final String ENTITY_NAME = "paint";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PaintRepository paintRepository;

    public PaintResource(PaintRepository paintRepository) {
        this.paintRepository = paintRepository;
    }

    /**
     * {@code POST  /paints} : Create a new paint.
     *
     * @param paint the paint to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new paint, or with status {@code 400 (Bad Request)} if the paint has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/paints")
    public ResponseEntity<Paint> createPaint(@Valid @RequestBody Paint paint) throws URISyntaxException {
        log.debug("REST request to save Paint : {}", paint);
        if (paint.getId() != null) {
            throw new BadRequestAlertException("A new paint cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Paint result = paintRepository.save(paint);
        return ResponseEntity
            .created(new URI("/api/paints/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /paints/:id} : Updates an existing paint.
     *
     * @param id the id of the paint to save.
     * @param paint the paint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paint,
     * or with status {@code 400 (Bad Request)} if the paint is not valid,
     * or with status {@code 500 (Internal Server Error)} if the paint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/paints/{id}")
    public ResponseEntity<Paint> updatePaint(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Paint paint)
        throws URISyntaxException {
        log.debug("REST request to update Paint : {}, {}", id, paint);
        if (paint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paintRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Paint result = paintRepository.save(paint);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paint.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /paints/:id} : Partial updates given fields of an existing paint, field will ignore if it is null
     *
     * @param id the id of the paint to save.
     * @param paint the paint to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated paint,
     * or with status {@code 400 (Bad Request)} if the paint is not valid,
     * or with status {@code 404 (Not Found)} if the paint is not found,
     * or with status {@code 500 (Internal Server Error)} if the paint couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/paints/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Paint> partialUpdatePaint(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Paint paint
    ) throws URISyntaxException {
        log.debug("REST request to partial update Paint partially : {}, {}", id, paint);
        if (paint.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, paint.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!paintRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Paint> result = paintRepository
            .findById(paint.getId())
            .map(existingPaint -> {
                if (paint.getBrand() != null) {
                    existingPaint.setBrand(paint.getBrand());
                }
                if (paint.getPaintName() != null) {
                    existingPaint.setPaintName(paint.getPaintName());
                }

                return existingPaint;
            })
            .map(paintRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, paint.getId().toString())
        );
    }

    /**
     * {@code GET  /paints} : get all the paints.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of paints in body.
     */
    @GetMapping("/paints")
    public List<Paint> getAllPaints() {
        log.debug("REST request to get all Paints");
        return paintRepository.findAll();
    }

    /**
     * {@code GET  /paints/:id} : get the "id" paint.
     *
     * @param id the id of the paint to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the paint, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/paints/{id}")
    public ResponseEntity<Paint> getPaint(@PathVariable Long id) {
        log.debug("REST request to get Paint : {}", id);
        Optional<Paint> paint = paintRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(paint);
    }

    /**
     * {@code DELETE  /paints/:id} : delete the "id" paint.
     *
     * @param id the id of the paint to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/paints/{id}")
    public ResponseEntity<Void> deletePaint(@PathVariable Long id) {
        log.debug("REST request to delete Paint : {}", id);
        paintRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
    @PostMapping("/paintslist")
    public ResponseEntity<Paint> createListPaint(@Valid @RequestBody ArrayList<Paint> paints) throws URISyntaxException {
//        log.debug("REST request to save Paint : {}", paint);
        List<Paint> result = paintRepository.saveAll(paints);
        return new ResponseEntity (result, HttpStatus.OK);
    }
}
