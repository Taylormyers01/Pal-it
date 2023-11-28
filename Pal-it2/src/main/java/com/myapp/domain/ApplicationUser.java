package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

/**
 * A ApplicationUser.
 */
@Entity
@Table(name = "application_user")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class ApplicationUser implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "application_user_name", nullable = false)
    private String applicationUserName;

    @OneToOne
    @JoinColumn(unique = true)
    private User internalUser;

    @OneToMany(mappedBy = "user")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "paintFormulas", "user" }, allowSetters = true)
    private Set<Formula> formulaNames = new HashSet<>();

    @OneToMany(mappedBy = "user")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "miniatureFormulas", "user" }, allowSetters = true)
    private Set<Miniature> miniatureNames = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_application_user__owned_paint",
        joinColumns = @JoinColumn(name = "application_user_id"),
        inverseJoinColumns = @JoinColumn(name = "owned_paint_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "users", "formulas", "minautures" }, allowSetters = true)
    private Set<Paint> ownedPaints = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public ApplicationUser id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicationUserName() {
        return this.applicationUserName;
    }

    public ApplicationUser applicationUserName(String applicationUserName) {
        this.setApplicationUserName(applicationUserName);
        return this;
    }

    public void setApplicationUserName(String applicationUserName) {
        this.applicationUserName = applicationUserName;
    }

    public User getInternalUser() {
        return this.internalUser;
    }

    public void setInternalUser(User user) {
        this.internalUser = user;
    }

    public ApplicationUser internalUser(User user) {
        this.setInternalUser(user);
        return this;
    }

    public Set<Formula> getFormulaNames() {
        return this.formulaNames;
    }

    public void setFormulaNames(Set<Formula> formulas) {
        if (this.formulaNames != null) {
            this.formulaNames.forEach(i -> i.setUser(null));
        }
        if (formulas != null) {
            formulas.forEach(i -> i.setUser(this));
        }
        this.formulaNames = formulas;
    }

    public ApplicationUser formulaNames(Set<Formula> formulas) {
        this.setFormulaNames(formulas);
        return this;
    }

    public ApplicationUser addFormulaName(Formula formula) {
        this.formulaNames.add(formula);
        formula.setUser(this);
        return this;
    }

    public ApplicationUser removeFormulaName(Formula formula) {
        this.formulaNames.remove(formula);
        formula.setUser(null);
        return this;
    }

    public Set<Miniature> getMiniatureNames() {
        return this.miniatureNames;
    }

    public void setMiniatureNames(Set<Miniature> miniatures) {
        if (this.miniatureNames != null) {
            this.miniatureNames.forEach(i -> i.setUser(null));
        }
        if (miniatures != null) {
            miniatures.forEach(i -> i.setUser(this));
        }
        this.miniatureNames = miniatures;
    }

    public ApplicationUser miniatureNames(Set<Miniature> miniatures) {
        this.setMiniatureNames(miniatures);
        return this;
    }

    public ApplicationUser addMiniatureName(Miniature miniature) {
        this.miniatureNames.add(miniature);
        miniature.setUser(this);
        return this;
    }

    public ApplicationUser removeMiniatureName(Miniature miniature) {
        this.miniatureNames.remove(miniature);
        miniature.setUser(null);
        return this;
    }

    public Set<Paint> getOwnedPaints() {
        return this.ownedPaints;
    }

    public void setOwnedPaints(Set<Paint> paints) {
        this.ownedPaints = paints;
    }

    public ApplicationUser ownedPaints(Set<Paint> paints) {
        this.setOwnedPaints(paints);
        return this;
    }

    public ApplicationUser addOwnedPaint(Paint paint) {
        this.ownedPaints.add(paint);
        paint.getUsers().add(this);
        return this;
    }

    public ApplicationUser removeOwnedPaint(Paint paint) {
        this.ownedPaints.remove(paint);
        paint.getUsers().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof ApplicationUser)) {
            return false;
        }
        return id != null && id.equals(((ApplicationUser) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "ApplicationUser{" +
            "id=" + getId() +
            ", applicationUserName='" + getApplicationUserName() + "'" +
            "}";
    }
}
