package com.campusconnect.dto;

import com.campusconnect.entity.Role;

public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String identifierId;
    private String hostelOrBlock;
    private String roomNumber;
    private String phone;

    public UserDto() {}

    public UserDto(Long id, String name, String email, Role role, String identifierId, String hostelOrBlock, String roomNumber, String phone) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.identifierId = identifierId;
        this.hostelOrBlock = hostelOrBlock;
        this.roomNumber = roomNumber;
        this.phone = phone;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public String getIdentifierId() { return identifierId; }
    public void setIdentifierId(String identifierId) { this.identifierId = identifierId; }

    public String getHostelOrBlock() { return hostelOrBlock; }
    public void setHostelOrBlock(String hostelOrBlock) { this.hostelOrBlock = hostelOrBlock; }

    public String getRoomNumber() { return roomNumber; }
    public void setRoomNumber(String roomNumber) { this.roomNumber = roomNumber; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String email;
        private Role role;
        private String identifierId;
        private String hostelOrBlock;
        private String roomNumber;
        private String phone;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(Role role) { this.role = role; return this; }
        public Builder identifierId(String identifierId) { this.identifierId = identifierId; return this; }
        public Builder hostelOrBlock(String hostelOrBlock) { this.hostelOrBlock = hostelOrBlock; return this; }
        public Builder roomNumber(String roomNumber) { this.roomNumber = roomNumber; return this; }
        public Builder phone(String phone) { this.phone = phone; return this; }

        public UserDto build() {
            return new UserDto(id, name, email, role, identifierId, hostelOrBlock, roomNumber, phone);
        }
    }
}
