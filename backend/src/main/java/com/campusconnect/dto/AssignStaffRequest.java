package com.campusconnect.dto;

import jakarta.validation.constraints.NotNull;

public class AssignStaffRequest {
    @NotNull(message = "Staff ID is required")
    private Long staffId;
    private String comment;

    public AssignStaffRequest() {}

    public Long getStaffId() { return staffId; }
    public void setStaffId(Long staffId) { this.staffId = staffId; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
