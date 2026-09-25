# CampusConnect - Production Deployment Guide

This guide details step-by-step instructions for deploying the **CampusConnect** full-stack web application (React frontend, Spring Boot backend, MySQL database).

---

## 🏗️ Architecture Overview

```
[ Browser Client ] ──> [ React Frontend (Vercel / Netlify / Render) ]
                              │
                              ▼ (HTTPS / REST API + JWT)
                       [ Spring Boot Backend (Render / Railway / AWS / Docker) ]
                              │
                              ▼ (JDBC)
                       [ MySQL Database (AWS RDS / Railway / Aiven) ]
```

---

## Step 1: Deploy MySQL Database

### Option A: Railway / Render / Aiven / PlanetScale (Free / Cloud Tier)
1. Create a MySQL database instance on your cloud provider.
2. Note down your database credentials:
   - **Host**: e.g., `mysql.railway.internal` or `aws-rds-endpoint.com`
   - **Database Name**: `campusconnect_db`
   - **Username**: `root` or custom DB user
   - **Password**: `your_secure_password`
   - **Port**: `3306`

---

## Step 2: Deploy Spring Boot Backend

### 1. Build Production Executable JAR
In your local terminal, compile and package the Spring Boot backend:
```bash
cd backend
.\mvnw.cmd clean package -DskipTests
```
This generates `target/campusconnect-backend-1.0.0.jar`.

### 2. Configure Environment Variables
Set the following environment variables on your hosting server (Render, Railway, AWS, Docker):

| Environment Variable | Description / Value |
|---|---|
| `SPRING_PROFILES_ACTIVE` | `mysql` |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<your-db-host>:3306/campusconnect_db?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC` |
| `SPRING_DATASOURCE_USERNAME` | `<your-db-user>` |
| `SPRING_DATASOURCE_PASSWORD` | `<your-db-password>` |
| `APP_JWT_SECRET` | `<random-64-character-secret-key>` |

### 3. Start Command
If deploying via jar or Docker:
```bash
java -jar target/campusconnect-backend-1.0.0.jar --spring.profiles.active=mysql
```

---

## Step 3: Deploy React Frontend

### 1. Update API Endpoint URL
In `frontend/src/services/api.js`, update the Axios base URL to point to your deployed backend domain:

```javascript
const API = axios.create({
  baseURL: process.env.VITE_API_URL || 'https://your-backend-domain.onrender.com/api',
});
```

### 2. Build Production Static Assets
Run Vite build command:
```bash
cd frontend
npm run build
```
This generates optimized static HTML/JS/CSS files in `frontend/dist/`.

### 3. Deploy to Vercel or Netlify
- **Vercel**:
  1. Push code to GitHub repository.
  2. Connect repository on [Vercel](https://vercel.com).
  3. Set Root Directory to `frontend`.
  4. Build command: `npm run build`, Output directory: `dist`.
- **Netlify**:
  1. Drag and drop `frontend/dist` directory to [Netlify Drop](https://app.netlify.com/drop).

---

## Step 4: CORS Configuration Check

Ensure your Spring Boot backend permits requests from your deployed frontend domain. In `SecurityConfig.java`:

```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of(
        "https://your-app.vercel.app",
        "http://localhost:3000"
    ));
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

## Quick Deployment Platform Recommendations

| Component | Free / Cheap Recommended Hosts |
|---|---|
| **Frontend (React)** | Vercel, Netlify, Cloudflare Pages |
| **Backend (Spring Boot)** | Render, Railway, AWS Elastic Beanstalk |
| **Database (MySQL)** | Railway, Aiven, AWS RDS |
