package com.campusconnect.repository;

import com.campusconnect.entity.Complaint;
import com.campusconnect.entity.ComplaintStatus;
import com.campusconnect.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    Optional<Complaint> findByComplaintNumber(String complaintNumber);

    List<Complaint> findByStudentOrderByCreatedAtDesc(User student);

    List<Complaint> findByAssignedStaffOrderByCreatedAtDesc(User staff);

    @Query("SELECT c FROM Complaint c WHERE c.hostelOrBlock = :hostelOrBlock ORDER BY c.createdAt DESC")
    List<Complaint> findByHostelOrBlockOrderByCreatedAtDesc(@Param("hostelOrBlock") String hostelOrBlock);

    List<Complaint> findAllByOrderByCreatedAtDesc();

    @Query("SELECT c FROM Complaint c WHERE c.status NOT IN ('RESOLVED', 'CLOSED') AND c.slaDueDate < :now AND c.slaBreached = false")
    List<Complaint> findOverdueComplaints(@Param("now") LocalDateTime now);

    long countByStatus(ComplaintStatus status);

    long countBySlaBreached(Boolean slaBreached);

    @Query("SELECT c.category.name, COUNT(c) FROM Complaint c GROUP BY c.category.name")
    List<Object[]> countComplaintsByCategory();

    @Query("SELECT c.hostelOrBlock, COUNT(c) FROM Complaint c GROUP BY c.hostelOrBlock")
    List<Object[]> countComplaintsByHostel();
}
