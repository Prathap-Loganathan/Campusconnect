package com.campusconnect.repository;

import com.campusconnect.entity.ItemType;
import com.campusconnect.entity.LostFoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostFoundItemRepository extends JpaRepository<LostFoundItem, Long> {
    List<LostFoundItem> findByItemTypeOrderByCreatedAtDesc(ItemType itemType);
    List<LostFoundItem> findAllByOrderByCreatedAtDesc();
    List<LostFoundItem> findByCategoryContainingIgnoreCaseOrTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String category, String title, String location);
}
