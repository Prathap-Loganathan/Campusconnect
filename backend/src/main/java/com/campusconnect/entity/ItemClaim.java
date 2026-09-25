package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "item_claims")
public class ItemClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    private LostFoundItem item;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "claimant_id", nullable = false)
    private User claimant;

    @Column(name = "proof_details", columnDefinition = "TEXT", nullable = false)
    private String proofDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ClaimStatus status;

    @Column(name = "reviewer_comments", columnDefinition = "TEXT")
    private String reviewerComments;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public ItemClaim() {}

    public ItemClaim(Long id, LostFoundItem item, User claimant, String proofDetails, ClaimStatus status, String reviewerComments, LocalDateTime createdAt, LocalDateTime reviewedAt) {
        this.id = id;
        this.item = item;
        this.claimant = claimant;
        this.proofDetails = proofDetails;
        this.status = status != null ? status : ClaimStatus.PENDING;
        this.reviewerComments = reviewerComments;
        this.createdAt = createdAt;
        this.reviewedAt = reviewedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ClaimStatus.PENDING;
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LostFoundItem getItem() { return item; }
    public void setItem(LostFoundItem item) { this.item = item; }

    public User getClaimant() { return claimant; }
    public void setClaimant(User claimant) { this.claimant = claimant; }

    public String getProofDetails() { return proofDetails; }
    public void setProofDetails(String proofDetails) { this.proofDetails = proofDetails; }

    public ClaimStatus getStatus() { return status; }
    public void setStatus(ClaimStatus status) { this.status = status; }

    public String getReviewerComments() { return reviewerComments; }
    public void setReviewerComments(String reviewerComments) { this.reviewerComments = reviewerComments; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private LostFoundItem item;
        private User claimant;
        private String proofDetails;
        private ClaimStatus status = ClaimStatus.PENDING;
        private String reviewerComments;
        private LocalDateTime createdAt;
        private LocalDateTime reviewedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder item(LostFoundItem item) { this.item = item; return this; }
        public Builder claimant(User claimant) { this.claimant = claimant; return this; }
        public Builder proofDetails(String proofDetails) { this.proofDetails = proofDetails; return this; }
        public Builder status(ClaimStatus status) { this.status = status; return this; }
        public Builder reviewerComments(String reviewerComments) { this.reviewerComments = reviewerComments; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder reviewedAt(LocalDateTime reviewedAt) { this.reviewedAt = reviewedAt; return this; }

        public ItemClaim build() {
            return new ItemClaim(id, item, claimant, proofDetails, status, reviewerComments, createdAt, reviewedAt);
        }
    }
}
