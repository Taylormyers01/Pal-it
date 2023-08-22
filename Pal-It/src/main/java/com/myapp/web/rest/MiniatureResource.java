package com.myapp.web.rest;

import com.myapp.domain.Miniature;
import com.myapp.repository.MiniatureRepository;
import com.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.myapp.domain.Miniature}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MiniatureResource {

    private final Logger log = LoggerFactory.getLogger(MiniatureResource.class);

    private static final String ENTITY_NAME = "miniature";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final MiniatureRepository miniatureRepository;

    public MiniatureResource(MiniatureRepository miniatureRepository) {
        this.miniatureRepository = miniatureRepository;
    }

    /**
     * {@code POST  /miniatures} : Create a new miniature.
     *
     * @param miniature the miniature to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new miniature, or with status {@code 400 (Bad Request)} if the miniature has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/miniatures")
    public ResponseEntity<Miniature> createMiniature(@RequestBody Miniature miniature) throws URISyntaxException {
        log.debug("REST request to save Miniature : {}", miniature);
        if (miniature.getId() != null) {
            throw new BadRequestAlertException("A new miniature cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Miniature result = miniatureRepository.save(miniature);
        return ResponseEntity
            .created(new URI("/api/miniatures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /miniatures/:id} : Updates an existing miniature.
     *
     * @param id the id of the miniature to save.
     * @param miniature the miniature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated miniature,
     * or with status {@code 400 (Bad Request)} if the miniature is not valid,
     * or with status {@code 500 (Internal Server Error)} if the miniature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/miniatures/{id}")
    public ResponseEntity<Miniature> updateMiniature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Miniature miniature
    ) throws URISyntaxException {
        log.debug("REST request to update Miniature : {}, {}", id, miniature);
        if (miniature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, miniature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!miniatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Miniature result = miniatureRepository.save(miniature);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, miniature.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /miniatures/:id} : Partial updates given fields of an existing miniature, field will ignore if it is null
     *
     * @param id the id of the miniature to save.
     * @param miniature the miniature to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated miniature,
     * or with status {@code 400 (Bad Request)} if the miniature is not valid,
     * or with status {@code 404 (Not Found)} if the miniature is not found,
     * or with status {@code 500 (Internal Server Error)} if the miniature couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/miniatures/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Miniature> partialUpdateMiniature(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Miniature miniature
    ) throws URISyntaxException {
        log.debug("REST request to partial update Miniature partially : {}, {}", id, miniature);
        if (miniature.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, miniature.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!miniatureRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Miniature> result = miniatureRepository
            .findById(miniature.getId())
            .map(existingMiniature -> {
                if (miniature.getMiniatureName() != null) {
                    existingMiniature.setMiniatureName(miniature.getMiniatureName());
                }
                if (miniature.getPicture() != null) {
                    existingMiniature.setPicture(miniature.getPicture());
                }
                if (miniature.getPictureContentType() != null) {
                    existingMiniature.setPictureContentType(miniature.getPictureContentType());
                }

                return existingMiniature;
            })
            .map(miniatureRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, miniature.getId().toString())
        );
    }

    /**
     * {@code GET  /miniatures} : get all the miniatures.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of miniatures in body.
     */
    @GetMapping("/miniatures")
    public List<Miniature> getAllMiniatures(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Miniatures");
        if (eagerload) {
            return miniatureRepository.findAllWithEagerRelationships();
        } else {
            return miniatureRepository.findAll();
        }
    }

    /**
     * {@code GET  /miniatures/:id} : get the "id" miniature.
     *
     * @param id the id of the miniature to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the miniature, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/miniatures/{id}")
    public ResponseEntity<Miniature> getMiniature(@PathVariable Long id) {
        log.debug("REST request to get Miniature : {}", id);
        Optional<Miniature> miniature = miniatureRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(miniature);
    }

    /**
     * {@code DELETE  /miniatures/:id} : delete the "id" miniature.
     *
     * @param id the id of the miniature to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/miniatures/{id}")
    public ResponseEntity<Void> deleteMiniature(@PathVariable Long id) {
        log.debug("REST request to delete Miniature : {}", id);
        miniatureRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
