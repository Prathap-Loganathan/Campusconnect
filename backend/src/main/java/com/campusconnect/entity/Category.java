package com.campusconnect.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    @Column(name = "default_sla_hours")
    private Integer defaultSlaHours;

    public Category() {}

    public Category(Long id, String name, String description, Integer defaultSlaHours) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.defaultSlaHours = defaultSlaHours;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getDefaultSlaHours() { return defaultSlaHours; }
    public void setDefaultSlaHours(Integer defaultSlaHours) { this.defaultSlaHours = defaultSlaHours; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private Integer defaultSlaHours;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder defaultSlaHours(Integer defaultSlaHours) { this.defaultSlaHours = defaultSlaHours; return this; }

        public Category build() {
            return new Category(id, name, description, defaultSlaHours);
        }
    }
}
