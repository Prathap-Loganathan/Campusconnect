package com.campusconnect.controller;

import com.campusconnect.dto.ClaimRequest;
import com.campusconnect.dto.LostFoundRequest;
import com.campusconnect.entity.ClaimStatus;
import com.campusconnect.entity.ItemClaim;
import com.campusconnect.entity.ItemType;
import com.campusconnect.entity.LostFoundItem;
import com.campusconnect.entity.User;
import com.campusconnect.repository.UserRepository;
import com.campusconnect.service.LostFoundService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lost-found")
public class LostFoundController {

    @Autowired
    private LostFoundService lostFoundService;

    @Autowired
    private UserRepository userRepository;

    private User getAuthenticatedUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found"));
    }

    @PostMapping
    public ResponseEntity<LostFoundItem> createItem(@Valid @RequestBody LostFoundRequest request, Authentication authentication) {
        User reporter = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(lostFoundService.createItem(request, reporter));
    }

    @GetMapping
    public ResponseEntity<List<LostFoundItem>> getAllItems(@RequestParam(required = false) String search, @RequestParam(required = false) ItemType type) {
        if (type != null) {
            return ResponseEntity.ok(lostFoundService.getItemsByType(type));
        }
        return ResponseEntity.ok(lostFoundService.searchItems(search));
    }

    @PostMapping("/{itemId}/claims")
    public ResponseEntity<ItemClaim> submitClaim(@PathVariable Long itemId, @Valid @RequestBody ClaimRequest request, Authentication authentication) {
        User claimant = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(lostFoundService.submitClaim(itemId, request, claimant));
    }

    @GetMapping("/claims")
    @PreAuthorize("hasAuthority('ROLE_STAFF') or hasAuthority('ROLE_WARDEN') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<ItemClaim>> getAllClaims() {
        return ResponseEntity.ok(lostFoundService.getAllClaims());
    }

    @PutMapping("/claims/{claimId}/review")
    @PreAuthorize("hasAuthority('ROLE_STAFF') or hasAuthority('ROLE_WARDEN') or hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ItemClaim> reviewClaim(
            @PathVariable Long claimId,
            @RequestParam ClaimStatus status,
            @RequestParam(required = false) String comments,
            Authentication authentication) {
        User reviewer = getAuthenticatedUser(authentication);
        return ResponseEntity.ok(lostFoundService.reviewClaim(claimId, status, comments, reviewer));
    }
}
