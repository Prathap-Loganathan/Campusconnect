-- Initial Complaint Categories (INSERT IGNORE prevents duplicate PK errors on restart)
INSERT IGNORE INTO categories (id, name, description, default_sla_hours) VALUES 
(1, 'Electrical', 'Fan, light, socket, switchboard, AC issues', 24),
(2, 'Plumbing', 'Water leakage, tap repair, flush, drainage issues', 12),
(3, 'Wi-Fi & Network', 'Wi-Fi connectivity, LAN port, internet access problems', 12),
(4, 'Hostel Maintenance', 'Door lock, window glass, cupboard, bed repair', 48),
(5, 'Mess & Food', 'Food quality, hygiene, mess equipment issues', 12),
(6, 'Cleaning & Hygiene', 'Washroom cleaning, corridor, room cleaning request', 24),
(7, 'Security', 'Unauthorized entry, safety concerns, gate pass', 6),
(8, 'Infrastructure', 'Elevator, wall paint, civil repair, building issues', 72),
(9, 'Other', 'General campus and hostel queries', 48);

-- Demo Seed Users (Password for all demo users is: password123)
-- BCrypt hash for 'password123': $2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2

INSERT IGNORE INTO users (id, name, email, password, role, identifier_id, hostel_or_block, room_number, phone, created_at) VALUES
(1, 'System Admin', 'admin@campusconnect.com', '$2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2', 'ROLE_ADMIN', 'ADM-001', 'Admin Block', '101', '9876543210', CURRENT_TIMESTAMP),
(2, 'Hostel Warden John', 'warden@campusconnect.com', '$2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2', 'ROLE_WARDEN', 'WRD-102', 'Block A', '201', '9876543211', CURRENT_TIMESTAMP),
(3, 'Electrician Sam (Staff)', 'staff.elec@campusconnect.com', '$2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2', 'ROLE_STAFF', 'STF-501', 'Maintenance Hub', '005', '9876543212', CURRENT_TIMESTAMP),
(4, 'Plumber Alex (Staff)', 'staff.plumb@campusconnect.com', '$2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2', 'ROLE_STAFF', 'STF-502', 'Maintenance Hub', '006', '9876543213', CURRENT_TIMESTAMP),
(5, 'IT Specialist Dave (Staff)', 'staff.wifi@campusconnect.com', '$2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2', 'ROLE_STAFF', 'STF-503', 'IT Hub', '102', '9876543214', CURRENT_TIMESTAMP),
(6, 'Student Alice Vance', 'alice@student.com', '$2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2', 'ROLE_STUDENT', 'STU-2024-001', 'Block A', '304', '9876543215', CURRENT_TIMESTAMP),
(7, 'Student Bob Smith', 'bob@student.com', '$2a$10$WhJcsbQwR3IeOKikbJjI4.NnI6YP.Qj1SgppB/Qfv3lJ4lZ9Rd5L2', 'ROLE_STUDENT', 'STU-2024-002', 'Block B', '112', '9876543216', CURRENT_TIMESTAMP);

-- Sample Complaints (MySQL DATE_ADD syntax)
INSERT IGNORE INTO complaints (id, complaint_number, title, description, category_id, priority, status, hostel_or_block, room_number, location_details, student_id, assigned_staff_id, sla_breached, sla_due_date, created_at, updated_at) VALUES
(1, 'CMP-2026-0001', 'Ceiling Fan Not Working', 'The ceiling fan in room 304 stopped rotating yesterday night and makes a buzzing sound.', 1, 'HIGH', 'ASSIGNED', 'Block A', '304', 'Near balcony window', 6, 3, FALSE, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 1 DAY), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'CMP-2026-0002', 'Wi-Fi Connection Dropping', 'Wi-Fi signal drops frequently every 10 minutes in Block A 3rd floor corridor.', 3, 'MEDIUM', 'IN_PROGRESS', 'Block A', '304', '3rd Floor Corridor', 6, 5, FALSE, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 HOUR), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'CMP-2026-0003', 'Bathroom Tap Leakage', 'Water is continuously dripping from the sink tap in room 112.', 2, 'LOW', 'SUBMITTED', 'Block B', '112', 'Attached Washroom', 7, NULL, FALSE, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 12 HOUR), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Sample Complaint Updates
INSERT IGNORE INTO complaint_updates (id, complaint_id, status, comment, updated_by_id, created_at) VALUES
(1, 1, 'SUBMITTED', 'Complaint lodged by student.', 6, CURRENT_TIMESTAMP),
(2, 1, 'ASSIGNED', 'Assigned to Electrician Sam by Warden.', 2, CURRENT_TIMESTAMP),
(3, 2, 'SUBMITTED', 'Wi-Fi issue logged.', 6, CURRENT_TIMESTAMP),
(4, 2, 'ASSIGNED', 'Assigned to IT Specialist Dave.', 2, CURRENT_TIMESTAMP),
(5, 2, 'IN_PROGRESS', 'Replaced access point router on 3rd floor. Testing connectivity.', 5, CURRENT_TIMESTAMP);

-- Sample Lost & Found Items
INSERT IGNORE INTO lost_found_items (id, title, description, category, item_type, location, item_date, image_url, reporter_id, status, created_at) VALUES
(1, 'Blue Water Bottle (Hydro Flask)', 'Dark blue stainless steel water bottle with stickers on it.', 'Personal Belongings', 'LOST', 'Central Library Reading Hall', '2026-09-20', NULL, 6, 'OPEN', CURRENT_TIMESTAMP),
(2, 'Student ID Card - CS Dept', 'Found an ID card belonging to Computer Science department student.', 'Documents', 'FOUND', 'Campus Canteen Table 4', '2026-09-21', NULL, 7, 'OPEN', CURRENT_TIMESTAMP);

-- Sample Notification
INSERT IGNORE INTO notifications (id, user_id, title, message, read_status, target_type, target_id, created_at) VALUES
(1, 6, 'Complaint Assigned', 'Your complaint CMP-2026-0001 has been assigned to Electrician Sam.', FALSE, 'COMPLAINT', 1, CURRENT_TIMESTAMP),
(2, 6, 'Status Update', 'Your complaint CMP-2026-0002 is now IN_PROGRESS.', FALSE, 'COMPLAINT', 2, CURRENT_TIMESTAMP);

-- Reset auto-increment sequences past pre-seeded IDs in MySQL
ALTER TABLE users AUTO_INCREMENT = 100;
ALTER TABLE categories AUTO_INCREMENT = 100;
ALTER TABLE complaints AUTO_INCREMENT = 100;
ALTER TABLE complaint_updates AUTO_INCREMENT = 100;
ALTER TABLE lost_found_items AUTO_INCREMENT = 100;
ALTER TABLE notifications AUTO_INCREMENT = 100;
