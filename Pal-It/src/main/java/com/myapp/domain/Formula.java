package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Formula.
 */
@Entity
@Table(name = "formula")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Formula implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "formula_name")
    private String formulaName;

    @ManyToMany
    @JoinTable(
        name = "rel_formula__paint_formula",
        joinColumns = @JoinColumn(name = "formula_id"),
        inverseJoinColumns = @JoinColumn(name = "paint_formula_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "users", "formulas", "minautures" }, allowSetters = true)
    private Set<Paint> paintFormulas = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "internalUser", "formulaNames", "miniatureNames", "ownedPaints" }, allowSetters = true)
    private ApplicationUser applicationUser;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Formula id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFormulaName() {
        return this.formulaName;
    }

    public Formula formulaName(String formulaName) {
        this.setFormulaName(formulaName);
        return this;
    }

    public void setFormulaName(String formulaName) {
        this.formulaName = formulaName;
    }

    public Set<Paint> getPaintFormulas() {
        return this.paintFormulas;
    }

    public void setPaintFormulas(Set<Paint> paints) {
        this.paintFormulas = paints;
    }

    public Formula paintFormulas(Set<Paint> paints) {
        this.setPaintFormulas(paints);
        return this;
    }

    public Formula addPaintFormula(Paint paint) {
        this.paintFormulas.add(paint);
        paint.getFormulas().add(this);
        return this;
    }

    public Formula removePaintFormula(Paint paint) {
        this.paintFormulas.remove(paint);
        paint.getFormulas().remove(this);
        return this;
    }

    public ApplicationUser getApplicationUser() {
        return this.applicationUser;
    }

    public void setApplicationUser(ApplicationUser applicationUser) {
        this.applicationUser = applicationUser;
    }

    public Formula applicationUser(ApplicationUser applicationUser) {
        this.setApplicationUser(applicationUser);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Formula)) {
            return false;
        }
        return id != null && id.equals(((Formula) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Formula{" +
            "id=" + getId() +
            ", formulaName='" + getFormulaName() + "'" +
            "}";
    }
}
