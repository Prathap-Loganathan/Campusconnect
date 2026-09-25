package com.campusconnect.dto;

import com.campusconnect.entity.ComplaintStatus;
import java.time.LocalDateTime;

public class ComplaintUpdateDto {
    private Long id;
    private ComplaintStatus status;
    private String comment;
    private String imageUrl;
    private UserDto updatedBy;
    private LocalDateTime createdAt;

    public ComplaintUpdateDto() {}

    public ComplaintUpdateDto(Long id, ComplaintStatus status, String comment, String imageUrl, UserDto updatedBy, LocalDateTime createdAt) {
        this.id = id;
        this.status = status;
        this.comment = comment;
        this.imageUrl = imageUrl;
        this.updatedBy = updatedBy;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public UserDto getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(UserDto updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private ComplaintStatus status;
        private String comment;
        private String imageUrl;
        private UserDto updatedBy;
        private LocalDateTime createdAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder status(ComplaintStatus status) { this.status = status; return this; }
        public Builder comment(String comment) { this.comment = comment; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder updatedBy(UserDto updatedBy) { this.updatedBy = updatedBy; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }

        public ComplaintUpdateDto build() {
            return new ComplaintUpdateDto(id, status, comment, imageUrl, updatedBy, createdAt);
        }
    }
}
