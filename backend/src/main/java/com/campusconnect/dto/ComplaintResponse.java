package com.campusconnect.dto;

import com.campusconnect.entity.ComplaintPriority;
import com.campusconnect.entity.ComplaintStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ComplaintResponse {
    private Long id;
    private String complaintNumber;
    private String title;
    private String description;
    private String categoryName;
    private Long categoryId;
    private ComplaintPriority priority;
    private ComplaintStatus status;
    private String hostelOrBlock;
    private String roomNumber;
    private String locationDetails;
    private String imageUrl;
    private UserDto student;
    private UserDto assignedStaff;
    private Boolean slaBreached;
    private LocalDateTime slaDueDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ComplaintUpdateDto> history;

    public ComplaintResponse() {}

    public ComplaintResponse(Long id, String complaintNumber, String title, String description, String categoryName, Long categoryId, ComplaintPriority priority, ComplaintStatus status, String hostelOrBlock, String roomNumber, String locationDetails, String imageUrl, UserDto student, UserDto assignedStaff, Boolean slaBreached, LocalDateTime slaDueDate, LocalDateTime createdAt, LocalDateTime updatedAt, List<ComplaintUpdateDto> history) {
        this.id = id;
        this.complaintNumber = complaintNumber;
        this.title = title;
        this.description = description;
        this.categoryName = categoryName;
        this.categoryId = categoryId;
        this.priority = priority;
        this.status = status;
        this.hostelOrBlock = hostelOrBlock;
        this.roomNumber = roomNumber;
        this.locationDetails = locationDetails;
        this.imageUrl = imageUrl;
        this.student = student;
        this.assignedStaff = assignedStaff;
        this.slaBreached = slaBreached;
        this.slaDueDate = slaDueDate;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.history = history;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getComplaintNumber() { return complaintNumber; }
    public void setComplaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

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

    public UserDto getStudent() { return student; }
    public void setStudent(UserDto student) { this.student = student; }

    public UserDto getAssignedStaff() { return assignedStaff; }
    public void setAssignedStaff(UserDto assignedStaff) { this.assignedStaff = assignedStaff; }

    public Boolean getSlaBreached() { return slaBreached; }
    public void setSlaBreached(Boolean slaBreached) { this.slaBreached = slaBreached; }

    public LocalDateTime getSlaDueDate() { return slaDueDate; }
    public void setSlaDueDate(LocalDateTime slaDueDate) { this.slaDueDate = slaDueDate; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<ComplaintUpdateDto> getHistory() { return history; }
    public void setHistory(List<ComplaintUpdateDto> history) { this.history = history; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String complaintNumber;
        private String title;
        private String description;
        private String categoryName;
        private Long categoryId;
        private ComplaintPriority priority;
        private ComplaintStatus status;
        private String hostelOrBlock;
        private String roomNumber;
        private String locationDetails;
        private String imageUrl;
        private UserDto student;
        private UserDto assignedStaff;
        private Boolean slaBreached;
        private LocalDateTime slaDueDate;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<ComplaintUpdateDto> history;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder complaintNumber(String complaintNumber) { this.complaintNumber = complaintNumber; return this; }
        public Builder title(String title) { this.title = title; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder categoryName(String categoryName) { this.categoryName = categoryName; return this; }
        public Builder categoryId(Long categoryId) { this.categoryId = categoryId; return this; }
        public Builder priority(ComplaintPriority priority) { this.priority = priority; return this; }
        public Builder status(ComplaintStatus status) { this.status = status; return this; }
        public Builder hostelOrBlock(String hostelOrBlock) { this.hostelOrBlock = hostelOrBlock; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder locationDetails(String locationDetails) { this.locationDetails = locationDetails; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder student(UserDto student) { this.student = student; return this; }
        public Builder assignedStaff(UserDto assignedStaff) { this.assignedStaff = assignedStaff; return this; }
        public Builder slaBreached(Boolean slaBreached) { this.slaBreached = slaBreached; return this; }
        public Builder slaDueDate(LocalDateTime slaDueDate) { this.slaDueDate = slaDueDate; return this; }
        public Builder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public Builder history(List<ComplaintUpdateDto> history) { this.history = history; return this; }

        public ComplaintResponse build() {
            return new ComplaintResponse(id, complaintNumber, title, description, categoryName, categoryId, priority, status, hostelOrBlock, roomNumber, locationDetails, imageUrl, student, assignedStaff, slaBreached, slaDueDate, createdAt, updatedAt, history);
        }
    }
}
