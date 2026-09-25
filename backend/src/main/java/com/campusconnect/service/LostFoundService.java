package com.campusconnect.service;

import com.campusconnect.dto.ClaimRequest;
import com.campusconnect.dto.LostFoundRequest;
import com.campusconnect.entity.*;
import com.campusconnect.repository.ItemClaimRepository;
import com.campusconnect.repository.LostFoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class LostFoundService {

    @Autowired
    private LostFoundItemRepository lostFoundItemRepository;

    @Autowired
    private ItemClaimRepository itemClaimRepository;

    @Autowired
    private NotificationService notificationService;

    public LostFoundItem createItem(LostFoundRequest request, User reporter) {
        LostFoundItem item = LostFoundItem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .itemType(request.getItemType())
                .location(request.getLocation())
                .itemDate(request.getItemDate())
                .imageUrl(request.getImageUrl())
                .reporter(reporter)
                .status("OPEN")
                .build();
        return lostFoundItemRepository.save(item);
    }

    public List<LostFoundItem> getAllItems() {
        return lostFoundItemRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<LostFoundItem> getItemsByType(ItemType itemType) {
        return lostFoundItemRepository.findByItemTypeOrderByCreatedAtDesc(itemType);
    }

    public List<LostFoundItem> searchItems(String query) {
        if (query == null || query.trim().isEmpty()) {
            return getAllItems();
        }
        return lostFoundItemRepository.findByCategoryContainingIgnoreCaseOrTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(
                query, query, query
        );
    }

    @Transactional
    public ItemClaim submitClaim(Long itemId, ClaimRequest request, User claimant) {
        LostFoundItem item = lostFoundItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (!"OPEN".equals(item.getStatus()) && !"CLAIM_PENDING".equals(item.getStatus())) {
            throw new RuntimeException("Item is not available for claim.");
        }

        ItemClaim claim = ItemClaim.builder()
                .item(item)
                .claimant(claimant)
                .proofDetails(request.getProofDetails())
                .status(ClaimStatus.PENDING)
                .build();

        item.setStatus("CLAIM_PENDING");
        lostFoundItemRepository.save(item);

        ItemClaim savedClaim = itemClaimRepository.save(claim);

        // Notify item reporter
        notificationService.createNotification(
                item.getReporter(),
                "New Claim Submitted",
                claimant.getName() + " has filed a claim for item: " + item.getTitle(),
                "CLAIM",
                savedClaim.getId()
        );

        return savedClaim;
    }

    @Transactional
    public ItemClaim reviewClaim(Long claimId, ClaimStatus newStatus, String comments, User reviewer) {
        ItemClaim claim = itemClaimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setStatus(newStatus);
        claim.setReviewerComments(comments);
        claim.setReviewedAt(LocalDateTime.now());

        LostFoundItem item = claim.getItem();

        if (newStatus == ClaimStatus.APPROVED) {
            item.setStatus("RETURNED");
            lostFoundItemRepository.save(item);

            notificationService.createNotification(
                    claim.getClaimant(),
                    "Claim Approved!",
                    "Your claim for '" + item.getTitle() + "' has been approved! Please contact campus office to retrieve it.",
                    "CLAIM",
                    claim.getId()
            );
        } else if (newStatus == ClaimStatus.REJECTED) {
            item.setStatus("OPEN");
            lostFoundItemRepository.save(item);

            notificationService.createNotification(
                    claim.getClaimant(),
                    "Claim Update",
                    "Your claim for '" + item.getTitle() + "' was not approved. Remarks: " + comments,
                    "CLAIM",
                    claim.getId()
            );
        }

        return itemClaimRepository.save(claim);
    }

    public List<ItemClaim> getAllClaims() {
        return itemClaimRepository.findAllByOrderByCreatedAtDesc();
    }
}
