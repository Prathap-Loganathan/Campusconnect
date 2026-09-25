package com.campusconnect.controller;

import com.campusconnect.dto.*;
import com.campusconnect.entity.User;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.ComplaintService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_STUDENT') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ComplaintResponse> createComplaint(@Valid @RequestBody ComplaintRequest request, Authentication authentication) {
        User student = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(complaintService.createComplaint(request, student));
    }

    @GetMapping
    public ResponseEntity<List<ComplaintResponse>> getUserComplaints(Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(complaintService.getComplaintsForUser(currentUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ComplaintResponse> getComplaintById(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComplaintById(id));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAuthority('ROLE_WARDEN') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ComplaintResponse> assignStaff(
            @PathVariable Long id,
            @Valid @RequestBody AssignStaffRequest request,
            Authentication authentication) {
        User wardenOrAdmin = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(complaintService.assignStaff(id, request, wardenOrAdmin));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ComplaintResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequest request,
            Authentication authentication) {
        User currentUser = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(complaintService.updateStatus(id, request, currentUser));
    }
}
