package com.campusconnect.service;

import com.campusconnect.dto.DashboardStatsDto;
import com.campusconnect.entity.ClaimStatus;
import com.campusconnect.entity.ComplaintStatus;
import com.campusconnect.entity.ItemType;
import com.campusconnect.repository.ComplaintRepository;
import com.campusconnect.repository.ItemClaimRepository;
import com.campusconnect.repository.LostFoundItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private LostFoundItemRepository lostFoundItemRepository;

    @Autowired
    private ItemClaimRepository itemClaimRepository;

    public DashboardStatsDto getDashboardStats() {
        long totalComplaints = complaintRepository.count();
        long openComplaints = complaintRepository.countByStatus(ComplaintStatus.SUBMITTED);
        long inProgressComplaints = complaintRepository.countByStatus(ComplaintStatus.IN_PROGRESS) + complaintRepository.countByStatus(ComplaintStatus.ASSIGNED);
        long resolvedComplaints = complaintRepository.countByStatus(ComplaintStatus.RESOLVED);
        long closedComplaints = complaintRepository.countByStatus(ComplaintStatus.CLOSED);
        long slaBreaches = complaintRepository.countBySlaBreached(true);

        long totalLostItems = lostFoundItemRepository.findByItemTypeOrderByCreatedAtDesc(ItemType.LOST).size();
        long totalFoundItems = lostFoundItemRepository.findByItemTypeOrderByCreatedAtDesc(ItemType.FOUND).size();
        long totalReturnedItems = lostFoundItemRepository.findAll().stream().filter(i -> "RETURNED".equalsIgnoreCase(i.getStatus())).count();
        long pendingClaims = itemClaimRepository.findAll().stream().filter(c -> c.getStatus() == ClaimStatus.PENDING).count();

        Map<String, Long> categoryMap = new HashMap<>();
        List<Object[]> categoryData = complaintRepository.countComplaintsByCategory();
        for (Object[] obj : categoryData) {
            categoryMap.put((String) obj[0], (Long) obj[1]);
        }

        Map<String, Long> hostelMap = new HashMap<>();
        List<Object[]> hostelData = complaintRepository.countComplaintsByHostel();
        for (Object[] obj : hostelData) {
            String hostel = obj[0] != null ? (String) obj[0] : "General";
            hostelMap.put(hostel, (Long) obj[1]);
        }

        return DashboardStatsDto.builder()
                .totalComplaints(totalComplaints)
                .openComplaints(openComplaints)
                .inProgressComplaints(inProgressComplaints)
                .resolvedComplaints(resolvedComplaints)
                .closedComplaints(closedComplaints)
                .slaBreaches(slaBreaches)
                .totalLostItems(totalLostItems)
                .totalFoundItems(totalFoundItems)
                .totalReturnedItems(totalReturnedItems)
                .pendingClaims(pendingClaims)
                .complaintsByCategory(categoryMap)
                .complaintsByHostel(hostelMap)
                .build();
    }
}
