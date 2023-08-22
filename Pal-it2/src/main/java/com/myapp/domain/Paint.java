package com.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Paint.
 */
@Entity
@Table(name = "paint")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Paint implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "brand", nullable = false)
    private String brand;

    @NotNull
    @Column(name = "paint_name", nullable = false)
    private String paintName;

    @ManyToMany(mappedBy = "ownedPaints")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "internalUser", "formulaNames", "miniatureNames", "ownedPaints" }, allowSetters = true)
    private Set<ApplicationUser> users = new HashSet<>();

    @ManyToMany(mappedBy = "paintFormulas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "paintFormulas", "user" }, allowSetters = true)
    private Set<Formula> formulas = new HashSet<>();

    @ManyToMany(mappedBy = "miniatureFormulas")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "miniatureFormulas", "user" }, allowSetters = true)
    private Set<Miniature> minautures = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Paint id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBrand() {
        return this.brand;
    }

    public Paint brand(String brand) {
        this.setBrand(brand);
        return this;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getPaintName() {
        return this.paintName;
    }

    public Paint paintName(String paintName) {
        this.setPaintName(paintName);
        return this;
    }

    public void setPaintName(String paintName) {
        this.paintName = paintName;
    }

    public Set<ApplicationUser> getUsers() {
        return this.users;
    }

    public void setUsers(Set<ApplicationUser> applicationUsers) {
        if (this.users != null) {
            this.users.forEach(i -> i.removeOwnedPaint(this));
        }
        if (applicationUsers != null) {
            applicationUsers.forEach(i -> i.addOwnedPaint(this));
        }
        this.users = applicationUsers;
    }

    public Paint users(Set<ApplicationUser> applicationUsers) {
        this.setUsers(applicationUsers);
        return this;
    }

    public Paint addUser(ApplicationUser applicationUser) {
        this.users.add(applicationUser);
        applicationUser.getOwnedPaints().add(this);
        return this;
    }

    public Paint removeUser(ApplicationUser applicationUser) {
        this.users.remove(applicationUser);
        applicationUser.getOwnedPaints().remove(this);
        return this;
    }

    public Set<Formula> getFormulas() {
        return this.formulas;
    }

    public void setFormulas(Set<Formula> formulas) {
        if (this.formulas != null) {
            this.formulas.forEach(i -> i.removePaintFormula(this));
        }
        if (formulas != null) {
            formulas.forEach(i -> i.addPaintFormula(this));
        }
        this.formulas = formulas;
    }

    public Paint formulas(Set<Formula> formulas) {
        this.setFormulas(formulas);
        return this;
    }

    public Paint addFormulas(Formula formula) {
        this.formulas.add(formula);
        formula.getPaintFormulas().add(this);
        return this;
    }

    public Paint removeFormulas(Formula formula) {
        this.formulas.remove(formula);
        formula.getPaintFormulas().remove(this);
        return this;
    }

    public Set<Miniature> getMinautures() {
        return this.minautures;
    }

    public void setMinautures(Set<Miniature> miniatures) {
        if (this.minautures != null) {
            this.minautures.forEach(i -> i.removeMiniatureFormula(this));
        }
        if (miniatures != null) {
            miniatures.forEach(i -> i.addMiniatureFormula(this));
        }
        this.minautures = miniatures;
    }

    public Paint minautures(Set<Miniature> miniatures) {
        this.setMinautures(miniatures);
        return this;
    }

    public Paint addMinauture(Miniature miniature) {
        this.minautures.add(miniature);
        miniature.getMiniatureFormulas().add(this);
        return this;
    }

    public Paint removeMinauture(Miniature miniature) {
        this.minautures.remove(miniature);
        miniature.getMiniatureFormulas().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Paint)) {
            return false;
        }
        return id != null && id.equals(((Paint) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Paint{" +
            "id=" + getId() +
            ", brand='" + getBrand() + "'" +
            ", paintName='" + getPaintName() + "'" +
            "}";
    }
}
