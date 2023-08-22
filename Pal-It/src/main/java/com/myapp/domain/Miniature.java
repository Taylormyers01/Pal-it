package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Miniature.
 */
@Entity
@Table(name = "miniature")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Miniature implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "miniature_name")
    private String miniatureName;

    @Lob
    @Column(name = "picture")
    private byte[] picture;

    @Column(name = "picture_content_type")
    private String pictureContentType;

    @ManyToMany
    @JoinTable(
        name = "rel_miniature__miniature_formula",
        joinColumns = @JoinColumn(name = "miniature_id"),
        inverseJoinColumns = @JoinColumn(name = "miniature_formula_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "users", "formulas", "minautures" }, allowSetters = true)
    private Set<Paint> miniatureFormulas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "formulaNames", "miniatureNames", "ownedPaints" }, allowSetters = true)
    private ApplicationUser applicationUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Miniature id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMiniatureName() {
        return this.miniatureName;
    }

    public Miniature miniatureName(String miniatureName) {
        this.setMiniatureName(miniatureName);
        return this;
    }

    public void setMiniatureName(String miniatureName) {
        this.miniatureName = miniatureName;
    }

    public byte[] getPicture() {
        return this.picture;
    }

    public Miniature picture(byte[] picture) {
        this.setPicture(picture);
        return this;
    }

    public void setPicture(byte[] picture) {
        this.picture = picture;
    }

    public String getPictureContentType() {
        return this.pictureContentType;
    }

    public Miniature pictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
        return this;
    }

    public void setPictureContentType(String pictureContentType) {
        this.pictureContentType = pictureContentType;
    }

    public Set<Paint> getMiniatureFormulas() {
        return this.miniatureFormulas;
    }

    public void setMiniatureFormulas(Set<Paint> paints) {
        this.miniatureFormulas = paints;
    }

    public Miniature miniatureFormulas(Set<Paint> paints) {
        this.setMiniatureFormulas(paints);
        return this;
    }

    public Miniature addMiniatureFormula(Paint paint) {
        this.miniatureFormulas.add(paint);
        paint.getMinautures().add(this);
        return this;
    }

    public Miniature removeMiniatureFormula(Paint paint) {
        this.miniatureFormulas.remove(paint);
        paint.getMinautures().remove(this);
        return this;
    }

    public ApplicationUser getApplicationUser() {
        return this.applicationUser;
    }

    public void setApplicationUser(ApplicationUser applicationUser) {
        this.applicationUser = applicationUser;
    }

    public Miniature applicationUser(ApplicationUser applicationUser) {
        this.setApplicationUser(applicationUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Miniature)) {
            return false;
        }
        return id != null && id.equals(((Miniature) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Miniature{" +
            "id=" + getId() +
            ", miniatureName='" + getMiniatureName() + "'" +
            ", picture='" + getPicture() + "'" +
            ", pictureContentType='" + getPictureContentType() + "'" +
            "}";
    }
}
