package com.campusconnect.repository;

import com.campusconnect.entity.ItemClaim;
import com.campusconnect.entity.LostFoundItem;
import com.campusconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ItemClaimRepository extends JpaRepository<ItemClaim, Long> {
    List<ItemClaim> findByItem(LostFoundItem item);
    List<ItemClaim> findByClaimantOrderByCreatedAtDesc(User claimant);
    List<ItemClaim> findAllByOrderByCreatedAtDesc();
}
