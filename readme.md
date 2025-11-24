# 🎵 Music Concert Series – MERN Stack Project

**Code:** NU25MCA43 to 48

City-wide music concerts with bands, solo artists, guest collaborations, ticketing, sponsors, playlists, and merchandise — built as a full-stack MERN application.

---

## 📚 Table of Contents

1. [Overview](#overview)
2. [Core Features](#core-features)
3. [Tech Stack](#tech-stack)
4. [System Architecture](#system-architecture)
5. [Data Model (High-Level)](#data-model-high-level)
6. [Key Use Cases / Queries](#key-use-cases--queries)
7. [Setup & Installation](#setup--installation)
8. [Environment Variables](#environment-variables)
9. [Running the App](#running-the-app)
10. [API Design (Sample Endpoints)](#api-design-sample-endpoints)
11. [Testing & Validation](#testing--validation)
12. [Future Enhancements](#future-enhancements)
13. [Notes & Assumptions](#notes--assumptions)

---

## 📝 Overview

**Music Concert Series** is a MERN stack application that manages:

- City-wide concerts across multiple venues
- Bands, solo artists, and guest collaborators
- Ticket sales, sponsors, and merchandise
- Fans and their attendance history
- Playlists and songs played in each concert

The backend exposes APIs to answer analytical queries like:

- Which concerts had more than 1000 attendees?
- Who is the band with the most ticket sales overall?
- Which venues are most active?
- Which sponsors, artists, or songs are the most popular?

---

## ⭐ Core Features

Each feature maps to one or more of the questions in the description.

1. **Concert Management**

   - Create, update, and view concerts with:
     - Date, time, venue, band/artist lineup
     - Ticket info and capacity
     - Sponsors and guest artists
   - ✅ Supports: Q1, Q2, Q3, Q5, Q7, Q11, Q12

2. **Venue Management**

   - Create and manage venues with capacity and location
   - View the number of concerts per venue
   - ✅ Supports: Q3, Q6, Q12

3. **Ticketing & Attendance**

   - Track ticket sales per concert
   - Store which fans attended which concerts
   - ✅ Supports: Q1, Q2, Q6, Q9

4. **Merchandise & Sales**

   - Manage merchandise items per concert (T-shirts, posters, etc.)
   - Track stock, sales, and sold-out status
   - ✅ Supports: Q4, Q11

5. **Artist & Band Management**

   - Store bands, solo artists, and guest artists
   - Link artists to concerts and venues they perform at
   - Detect collaborations (multiple artists in the same concert)
   - ✅ Supports: Q2, Q5, Q7, Q12

6. **Sponsors**

   - Track sponsors per concert
   - View which sponsors supported the most concerts
   - ✅ Supports: Q8

7. **Playlists & Songs**

   - Store playlists per concert
   - Track how many times each song is played across concerts
   - ✅ Supports: Q10

8. **Fan Management**
   - Register fans and track concerts attended
   - Identify loyal fans attending multiple concerts
   - ✅ Supports: Q9

---

## 🛠 Tech Stack

**Frontend:**

- React
- React Router
- Axios / Fetch for API calls
- Tailwind CSS / CSS Modules / Styled Components (choose one as per implementation)

**Backend:**

- Node.js
- Express.js
- Mongoose (MongoDB ODM)

**Database:**

- MongoDB (local or Atlas)

**Tooling:**

- npm / yarn
- nodemon for backend dev
- ESLint / Prettier (optional)

---

## 🏛 System Architecture

- **Client (React)**

  - Views for concerts, venues, artists, sponsors, fans
  - Filters and dashboards to display analytics (attendees, ticket sales, popular songs, etc.)

- **Server (Node + Express)**

  - RESTful API endpoints for CRUD operations
  - Aggregation queries for analytics (attendee count, top-selling bands, etc.)

- **Database (MongoDB)**
  - Collections for concerts, venues, artists, songs, sponsors, merchandise, fans, etc.
  - Uses references (ObjectId) and embedded subdocuments where appropriate.

---

## 🗂 Data Model (High-Level)

> Note: Field names are suggestions; adjust them to match your actual implementation.

- **Concert**

  - `_id`
  - `name`
  - `date`
  - `venue` → `venueId`
  - `mainBand` → `bandId`
  - `artists` → `[artistId]`
  - `guestArtists` → `[artistId]`
  - `ticketSales` (number)
  - `attendeesCount` (number)
  - `sponsors` → `[sponsorId]`
  - `playlist` → `[songId]`
  - `merchandise` → `[merchItemId]`
  - `totalMerchRevenue` (number)

- **Venue**

  - `_id`
  - `name`
  - `location`
  - `capacity`

- **Band / Artist**

  - `_id`
  - `name`
  - `type` (`"band"` or `"solo"`)
  - `genres` (array)
  - `concertsPerformed` → `[concertId]`

- **Song**

  - `_id`
  - `title`
  - `artist` → `artistId`
  - `playCount` (aggregated across concerts)

- **Sponsor**

  - `_id`
  - `name`
  - `concerts` → `[concertId]`

- **Merchandise**

  - `_id`
  - `concert` → `concertId`
  - `itemName`
  - `price`
  - `stock`
  - `sold` (number)
  - `isSoldOut` (boolean)

- **Fan**
  - `_id`
  - `name`
  - `email`
  - `attendedConcerts` → `[concertId]`

---

## 📊 Key Use Cases / Queries

These correspond to the questions in the prompt:

1. **List concerts with more than 1000 attendees**
2. **Find the band with the most ticket sales overall**
3. **Retrieve venues that hosted more than 5 concerts**
4. **Show merchandise items that sold out**
5. **Identify guest artists who performed in multiple concerts**
6. **Calculate average ticket sales per venue**
7. **Find concerts where collaborations between two or more artists happened**
8. **Show sponsors who supported more than 3 concerts**
9. **Retrieve fans who attended at least 3 concerts**
10. **Find the most popular song played across all concerts**
11. **List concerts with the highest merchandise revenue**
12. **Identify artists who performed in multiple venues**

> In the backend, these will typically be implemented using MongoDB aggregation pipelines or filtered queries. The frontend can expose them via dashboards, filters, or reports pages.

---

## ⚙️ Setup & Installation

### 1. Prerequisites

- Node.js (LTS)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas)

### 2. Clone the Repository

```bash
git clone https://github.com/<your-username>/music-concert-series.git
cd music-concert-series
```
