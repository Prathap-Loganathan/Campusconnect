package com.campusconnect.service;

import com.campusconnect.dto.*;
import com.campusconnect.entity.*;
import com.campusconnect.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private ComplaintUpdateRepository complaintUpdateRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private AuthService authService;

    @Transactional
    public ComplaintResponse createComplaint(ComplaintRequest request, User student) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));

        int slaHours = category.getDefaultSlaHours() != null ? category.getDefaultSlaHours() : 24;
        LocalDateTime slaDueDate = LocalDateTime.now().plusHours(slaHours);

        String complaintNumber = generateComplaintNumber();

        Complaint complaint = Complaint.builder()
                .complaintNumber(complaintNumber)
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .priority(request.getPriority())
                .status(ComplaintStatus.SUBMITTED)
                .hostelOrBlock(request.getHostelOrBlock() != null ? request.getHostelOrBlock() : student.getHostelOrBlock())
                .roomNumber(request.getRoomNumber() != null ? request.getRoomNumber() : student.getRoomNumber())
                .locationDetails(request.getLocationDetails())
                .imageUrl(request.getImageUrl())
                .student(student)
                .slaBreached(false)
                .slaDueDate(slaDueDate)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);

        // Record initial history
        ComplaintUpdate update = ComplaintUpdate.builder()
                .complaint(savedComplaint)
                .status(ComplaintStatus.SUBMITTED)
                .comment("Complaint submitted by student.")
                .updatedBy(student)
                .build();
        complaintUpdateRepository.save(update);

        // Notify student
        notificationService.createNotification(
                student,
                "Complaint Submitted",
                "Your complaint " + complaintNumber + " has been registered successfully.",
                "COMPLAINT",
                savedComplaint.getId()
        );

        return mapToResponse(savedComplaint);
    }

    public List<ComplaintResponse> getComplaintsForUser(User user) {
        List<Complaint> complaints;
        if (user.getRole() == Role.ROLE_STUDENT) {
            complaints = complaintRepository.findByStudentOrderByCreatedAtDesc(user);
        } else if (user.getRole() == Role.ROLE_STAFF) {
            complaints = complaintRepository.findByAssignedStaffOrderByCreatedAtDesc(user);
        } else if (user.getRole() == Role.ROLE_WARDEN) {
            complaints = complaintRepository.findByHostelOrBlockOrderByCreatedAtDesc(user.getHostelOrBlock());
        } else { // ROLE_ADMIN
            complaints = complaintRepository.findAllByOrderByCreatedAtDesc();
        }
        return complaints.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ComplaintResponse getComplaintById(Long id) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + id));
        return mapToResponse(complaint);
    }

    @Transactional
    public ComplaintResponse assignStaff(Long complaintId, AssignStaffRequest request, User wardenOrAdmin) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        User staff = userRepository.findById(request.getStaffId())
                .orElseThrow(() -> new RuntimeException("Staff user not found"));

        if (staff.getRole() != Role.ROLE_STAFF && staff.getRole() != Role.ROLE_ADMIN) {
            throw new RuntimeException("Assigned user must be a staff member or admin.");
        }

        complaint.setAssignedStaff(staff);
        complaint.setStatus(ComplaintStatus.ASSIGNED);
        Complaint updatedComplaint = complaintRepository.save(complaint);

        String comment = request.getComment() != null ? request.getComment() : "Assigned to " + staff.getName();
        ComplaintUpdate update = ComplaintUpdate.builder()
                .complaint(updatedComplaint)
                .status(ComplaintStatus.ASSIGNED)
                .comment(comment)
                .updatedBy(wardenOrAdmin)
                .build();
        complaintUpdateRepository.save(update);

        // Notify Staff and Student
        notificationService.createNotification(
                staff,
                "New Task Assigned",
                "You have been assigned complaint " + complaint.getComplaintNumber() + ": " + complaint.getTitle(),
                "COMPLAINT",
                complaint.getId()
        );
        notificationService.createNotification(
                complaint.getStudent(),
                "Complaint Assigned",
                "Your complaint " + complaint.getComplaintNumber() + " has been assigned to " + staff.getName() + ".",
                "COMPLAINT",
                complaint.getId()
        );

        return mapToResponse(updatedComplaint);
    }

    @Transactional
    public ComplaintResponse updateStatus(Long complaintId, StatusUpdateRequest request, User currentUser) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        complaint.setStatus(request.getStatus());
        Complaint updatedComplaint = complaintRepository.save(complaint);

        ComplaintUpdate update = ComplaintUpdate.builder()
                .complaint(updatedComplaint)
                .status(request.getStatus())
                .comment(request.getComment())
                .imageUrl(request.getImageUrl())
                .updatedBy(currentUser)
                .build();
        complaintUpdateRepository.save(update);

        // Notify Student
        notificationService.createNotification(
                complaint.getStudent(),
                "Complaint Status Updated",
                "Status for complaint " + complaint.getComplaintNumber() + " changed to " + request.getStatus().name() + ".",
                "COMPLAINT",
                complaint.getId()
        );

        return mapToResponse(updatedComplaint);
    }

    private String generateComplaintNumber() {
        int randomNum = 1000 + new Random().nextInt(9000);
        return "CMP-" + LocalDateTime.now().getYear() + "-" + randomNum;
    }

    public ComplaintResponse mapToResponse(Complaint complaint) {
        List<ComplaintUpdate> updates = complaintUpdateRepository.findByComplaintOrderByCreatedAtAsc(complaint);
        List<ComplaintUpdateDto> history = updates.stream().map(u -> ComplaintUpdateDto.builder()
                .id(u.getId())
                .status(u.getStatus())
                .comment(u.getComment())
                .imageUrl(u.getImageUrl())
                .updatedBy(authService.mapToUserDto(u.getUpdatedBy()))
                .createdAt(u.getCreatedAt())
                .build()).collect(Collectors.toList());

        return ComplaintResponse.builder()
                .id(complaint.getId())
                .complaintNumber(complaint.getComplaintNumber())
                .title(complaint.getTitle())
                .description(complaint.getDescription())
                .categoryName(complaint.getCategory().getName())
                .categoryId(complaint.getCategory().getId())
                .priority(complaint.getPriority())
                .status(complaint.getStatus())
                .hostelOrBlock(complaint.getHostelOrBlock())
                .roomNumber(complaint.getRoomNumber())
                .locationDetails(complaint.getLocationDetails())
                .imageUrl(complaint.getImageUrl())
                .student(authService.mapToUserDto(complaint.getStudent()))
                .assignedStaff(complaint.getAssignedStaff() != null ? authService.mapToUserDto(complaint.getAssignedStaff()) : null)
                .slaBreached(complaint.getSlaBreached())
                .slaDueDate(complaint.getSlaDueDate())
                .createdAt(complaint.getCreatedAt())
                .updatedAt(complaint.getUpdatedAt())
                .history(history)
                .build();
    }
}
