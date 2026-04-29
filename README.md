#🎓 Smart Campus Operations Hub
IT3030 – Programming Applications and Frameworks (PAF) Assignment 2026

A full-stack enterprise-style web application designed to manage facility bookings, asset management, and incident handling within a university environment.

#📌 Project Overview

This system enables efficient campus operations through a centralized platform that supports:

Resource (facility & equipment) management
Booking workflows with approval processes
Maintenance and incident ticketing
Real-time notifications
Role-based secure access

The system is implemented using a Spring Boot REST API and a React client application, following modern software engineering practices and layered architecture.

#🏗️ System Architecture

The application follows a client-server architecture:

Frontend: React-based responsive web UI
Backend: Spring Boot REST API (layered architecture)
Database: MongoDB / MySQL (based on implementation)
Authentication: OAuth 2.0 (Google Sign-In)
##🚀 Core Modules
###🏢 Module A – Facilities & Assets Catalogue
Manage resources (rooms, labs, equipment)
Resource metadata: type, capacity, location, availability, status
Search and filter functionality
###📅 Module B – Booking Management
Request resource bookings
Booking workflow:
PENDING → APPROVED / REJECTED → CANCELLED
Conflict detection for overlapping bookings
Admin approval/rejection with reason
User-specific and admin-wide booking views
###🛠️ Module C – Maintenance & Incident Ticketing
Create incident tickets with priority and category
Upload image attachments (max 3)
Ticket lifecycle:
OPEN → IN_PROGRESS → RESOLVED → CLOSED / REJECTED
Technician assignment and resolution updates
Comment system with ownership control
###🔔 Module D – Notifications
Booking status updates
Ticket updates and comments
Accessible notification panel in UI
###🔐 Module E – Authentication & Authorization
OAuth 2.0 (Google login)
Role-based access control (RBAC):
USER
ADMIN
(Optional: TECHNICIAN)
Secured API endpoints and protected routes
#🛠️ Technology Stack
Layer	Technologies
Frontend	React.js, Tailwind CSS, Axios
Backend	Spring Boot, Java
Database	MongoDB / MySQL
Security	OAuth 2.0, Spring Security
Tools	Git, GitHub, Postman
CI/CD	GitHub Actions
#📁 Project Structure
it3030-paf-2026-smart-campus-groupXX/
│
├── frontend/                  # React Application
│   ├── components/
│   ├── pages/
│   ├── api/
│   └── App.js
│
├── backend/                  # Spring Boot API
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── application.properties
│
├── .github/workflows/        # GitHub Actions CI
└── README.md
#⚙️ Setup Instructions
##🔹 Clone Repository
git clone https://github.com/your-username/it3030-paf-2026-smart-campus-groupXX.git
cd it3030-paf-2026-smart-campus-groupXX
##🔹 Backend Setup (Spring Boot)
cd backend
mvn clean install
mvn spring-boot:run
##🔹 Frontend Setup (React)
cd frontend
npm install
npm start
#🔐 Environment Configuration

##Create an .env or update application.properties:
spring.data.mongodb.uri=your_database_url
server.port=8080

#🔌 API Endpoints (Sample)
Method	Endpoint	Description
GET	/api/resources	Get all resources
POST	/api/resources	Create resource
PUT	/api/resources/{id}	Update resource
DELETE	/api/resources/{id}	Delete resource
POST	/api/bookings	Create booking
PATCH	/api/bookings/{id}/status	Update booking
POST	/api/tickets	Create incident
PATCH	/api/tickets/{id}	Update ticket

#🧪 Testing & Quality Assurance
API tested using Postman collections
Input validation and error handling implemented
Status codes follow RESTful standards
Conflict handling for booking system
#🔄 CI/CD – GitHub Actions
Automated build and test workflow
Triggered on push and pull requests
Ensures code quality and consistency
#👥 Team Contribution
Member	Responsibility
Member 1	Resource Management
Member 2	Booking System
Member 3	Incident/Ticket System
Member 4	Notifications & Security
#📊 Key Highlights
Clean layered architecture (Controller → Service → Repository)
Role-based security implementation
Real-world workflow modeling
Scalable and maintainable code structure
Professional UI/UX design
#🚀 Optional Enhancements
QR Code booking verification
Analytics dashboard (usage trends)
SLA tracking for tickets
Notification preferences
