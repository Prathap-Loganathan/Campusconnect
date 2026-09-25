package com.campusconnect.service;

import com.campusconnect.entity.Complaint;
import com.campusconnect.entity.Role;
import com.campusconnect.entity.User;
import com.campusconnect.repository.ComplaintRepository;
import com.campusconnect.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SlaSchedulerService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    // Run every 60 seconds to check for SLA breaches
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkSlaBreaches() {
        LocalDateTime now = LocalDateTime.now();
        List<Complaint> overdueComplaints = complaintRepository.findOverdueComplaints(now);

        if (overdueComplaints.isEmpty()) {
            return;
        }

        List<User> wardens = userRepository.findByRole(Role.ROLE_WARDEN);
        List<User> admins = userRepository.findByRole(Role.ROLE_ADMIN);

        for (Complaint complaint : overdueComplaints) {
            complaint.setSlaBreached(true);
            complaintRepository.save(complaint);

            String title = "SLA BREACH ALERT!";
            String message = "Complaint " + complaint.getComplaintNumber() + " (" + complaint.getTitle() + 
                             ") in " + complaint.getHostelOrBlock() + " has exceeded its SLA resolution period!";

            // Notify Wardens of that block
            wardens.stream()
                    .filter(w -> complaint.getHostelOrBlock() == null || complaint.getHostelOrBlock().equalsIgnoreCase(w.getHostelOrBlock()))
                    .forEach(w -> notificationService.createNotification(w, title, message, "COMPLAINT", complaint.getId()));

            // Notify Admins
            admins.forEach(a -> notificationService.createNotification(a, title, message, "COMPLAINT", complaint.getId()));

            System.out.println("[SLA SCHEDULER] Marked SLA Breach for Complaint: " + complaint.getComplaintNumber());
        }
    }
}
