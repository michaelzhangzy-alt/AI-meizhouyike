# Changelog

All notable changes to this project will be documented in this file.

## [1.0.0] - 2025-01-19

**Milestone: Operational Efficiency (Phase 2)**
Introduced comprehensive backend management and content systems to automate operations.

### ✨ New Features
- **Admin Dashboard**: Centralized dashboard for data overview and lead tracking.
- **Content Management System (CMS)**:
  - **Articles**: Rich text editor for news/articles with cover upload and SEO settings.
  - **Courses**: Management interface for publishing and editing course details.
- **Teacher Management**: Dedicated interface for managing teacher profiles, including avatar cropping and sorting.
- **Site Configuration**:
  - Dynamic "About Us" and "Member Benefits" content configuration.
  - WeChat Share configuration per page path.
- **Data Export**: Excel export functionality for leads/registrations.

### ⚡ Improvements
- **WeChat Integration**: Full JS-SDK integration for custom share cards.
- **Analytics**: Added view counting for articles.
- **UI/UX**: Enhanced admin interface with responsive sidebar and consistent design language.

## [0.8.0] - 2025-01-19

**Milestone: Architecture Upgrade**
Infrastructure preparation for Phase 2 features.

### ♻️ Refactor
- **Database Schema**: Major schema migration (`phase2_schema`) to support articles, courses, teachers, and config tables.
- **Storage**: Initialized Supabase Storage buckets for `avatars`, `covers`, and `shares`.

## [0.4.0] - 2024-01-17

**Milestone: MVP (Minimum Viable Product)**
Core loop validation: "Traffic -> Lead Generation".

### 🚀 Launched
- **Public Website**:
  - `Home`: Landing page with featured course and teacher sections.
  - `About`: Static agency introduction page.
- **Lead Capture**:
  - Minimalist modal form for quick user registration.
  - Integration with `leads` database table.
- **Mobile Adaptation**: Fully responsive design for mobile visitors.
- **Basic SEO**: Metadata configuration for core pages.
