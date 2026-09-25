package com.campusconnect.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "complaint_number", nullable = false, unique = true)
    private String complaintNumber;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintPriority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintStatus status;

    @Column(name = "hostel_or_block")
    private String hostelOrBlock;

    @Column(name = "room_number")
    private String roomNumber;

    @Column(name = "location_details")
    private String locationDetails;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_staff_id")
    private User assignedStaff;

    @Column(name = "sla_breached")
    private Boolean slaBreached = false;

    @Column(name = "sla_due_date")
    private LocalDateTime slaDueDate;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Complaint() {}

    public Complaint(Long id, String complaintNumber, String title, String description, Category category, ComplaintPriority priority, ComplaintStatus status, String hostelOrBlock, String roomNumber, String locationDetails, String imageUrl, User student, User assignedStaff, Boolean slaBreached, LocalDateTime slaDueDate, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.complaintNumber = complaintNumber;
        this.title = title;
        this.description = description;
        this.category = category;
        this.priority = priority;
        this.status = status;
        this.hostelOrBlock = hostelOrBlock;
        this.roomNumber = roomNumber;
        this.locationDetails = locationDetails;
        this.imageUrl = imageUrl;
        this.student = student;
        this.assignedStaff = assignedStaff;
        this.slaBreached = slaBreached != null ? slaBreached : false;
        this.slaDueDate = slaDueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.slaBreached == null) {
            this.slaBreached = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComplaintNumber() { return complaintNumber; }
    public void setComplaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public ComplaintPriority getPriority() { return priority; }
    public void setPriority(ComplaintPriority priority) { this.priority = priority; }

    public ComplaintStatus getStatus() { return status; }
    public void setStatus(ComplaintStatus status) { this.status = status; }

    public String getHostelOrBlock() { return hostelOrBlock; }
    public void setHostelOrBlock(String hostelOrBlock) { this.hostelOrBlock = hostelOrBlock; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getLocationDetails() { return locationDetails; }
    public void setLocationDetails(String locationDetails) { this.locationDetails = locationDetails; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public User getStudent() { return student; }
    public void setStudent(User student) { this.student = student; }

    public User getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(User assignedStaff) { this.assignedStaff = assignedStaff; }

    public Boolean getSlaBreached() { return slaBreached; }
    public void setSlaBreached(Boolean slaBreached) { this.slaBreached = slaBreached; }

    public LocalDateTime getSlaDueDate() { return slaDueDate; }
    public void setSlaDueDate(LocalDateTime slaDueDate) { this.slaDueDate = slaDueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String complaintNumber;
        private String title;
        private String description;
        private Category category;
        private ComplaintPriority priority;
        private ComplaintStatus status;
        private String hostelOrBlock;
        private String roomNumber;
        private String locationDetails;
        private String imageUrl;
        private User student;
        private User assignedStaff;
        private Boolean slaBreached = false;
        private LocalDateTime slaDueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder complaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder category(Category category) { this.category = category; return this; }
        public Builder priority(ComplaintPriority priority) { this.priority = priority; return this; }
        public Builder status(ComplaintStatus status) { this.status = status; return this; }
        public Builder hostelOrBlock(String hostelOrBlock) { this.hostelOrBlock = hostelOrBlock; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder locationDetails(String locationDetails) { this.locationDetails = locationDetails; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder student(User student) { this.student = student; return this; }
        public Builder assignedStaff(User assignedStaff) { this.assignedStaff = assignedStaff; return this; }
        public Builder slaBreached(Boolean slaBreached) { this.slaBreached = slaBreached; return this; }
        public Builder slaDueDate(LocalDateTime slaDueDate) { this.slaDueDate = slaDueDate; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Complaint build() {
            return new Complaint(id, complaintNumber, title, description, category, priority, status, hostelOrBlock, roomNumber, locationDetails, imageUrl, student, assignedStaff, slaBreached, slaDueDate, createdAt, updatedAt);
        }
    }
}
