# CampusConnect - Campus Complaint & Lost-Found Portal

CampusConnect is a centralized full-stack enterprise web application for managing campus issues, hostel maintenance requests, SLA escalations, lost-and-found items, and admin analytics.

## Tech Stack

- **Frontend**: React.js, React Router DOM, Axios, Tailwind CSS, Lucide Icons, Vite
- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT (JSON Web Tokens), Spring Data JPA, Hibernate, Bean Validation, Springdoc OpenAPI
- **Database**: MySQL (Production profile) / H2 In-Memory Database (Development profile with auto seed data)
- **Security**: BCrypt password hashing, Stateless JWT Bearer Authentication Filter, Role-Based Access Control (RBAC)

---

## Roles & Access Control

1. **Student (`ROLE_STUDENT`)**: Lodge complaints, view status timeline, confirm resolution / reopen issues, report lost/found items, file ownership claims.
2. **Staff (`ROLE_STAFF`)**: View assigned work queue, update progress status (`IN_PROGRESS`, `RESOLVED`), upload resolution proof photos.
3. **Warden (`ROLE_WARDEN`)**: Monitor hostel/block complaints, assign maintenance staff, handle SLA breach alerts.
4. **Admin (`ROLE_ADMIN`)**: Comprehensive system control, dashboard stats, user role management, category SLA rules configuration.

---

## Getting Started & Execution

### Option 1: Backend Execution (Spring Boot)
1. Open terminal in `./backend`
2. Run Maven wrapper build or start:
   ```bash
   # Build
   ./mvnw clean package
   # Run
   ./mvnw spring-boot:run
   ```
3. API Base URL: `http://localhost:8080`
4. Swagger UI: `http://localhost:8080/swagger-ui.html`
5. H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:campusconnect`, User: `sa`, Password: empty)

### Option 2: Frontend Execution (React + Vite)
1. Open terminal in `./frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run development server:
   ```bash
   npm run dev
   ```
4. Access web application at: `http://localhost:3000`

---

## Pre-configured Demo Accounts (Password: `password123`)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@campusconnect.com` | `password123` |
| Warden | `warden@campusconnect.com` | `password123` |
| Staff (Electrician) | `staff.elec@campusconnect.com` | `password123` |
| Staff (IT Specialist) | `staff.wifi@campusconnect.com` | `password123` |
| Student (Alice) | `alice@student.com` | `password123` |
| Student (Bob) | `bob@student.com` | `password123` |
