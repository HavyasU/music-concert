# Music Concert Series - Setup & Installation Guide

## 📋 Overview

This is a full-stack MERN application for managing city-wide music concerts with artists, collaborations, ticketing, sponsors, playlists, and merchandise.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB Atlas account or local MongoDB
- Git

### Backend Setup

1. **Navigate to backend directory**

   ```bash
   cd backend
   npm install
   ```

2. **Update MongoDB connection**
   Edit `config/dbConfig.js` with your MongoDB URI:

   ```javascript
   const db = await mongoose.connect("your-mongodb-uri");
   ```

3. **Create default admin (optional)**

   ```bash
   # Use the admin routes POST /api/admin/register
   ```

4. **Start the server**
   ```bash
   npm start
   # Server runs on http://localhost:8000
   ```

### Frontend Setup

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   npm install
   ```

2. **Create .env file**

   ```bash
   cp .env.example .env
   # Update VITE_API_URL if backend runs on different port
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

## 📚 API Endpoints

### Admin Routes

- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Register new admin

### Concert Routes

- `GET /api/concerts` - Get all concerts
- `POST /api/concerts/create` - Create concert
- `GET /api/concerts/:id` - Get concert by ID
- `PUT /api/concerts/:id` - Update concert
- `DELETE /api/concerts/:id` - Delete concert
- `GET /api/concerts/:concertId/collaborations` - Get concert collaborations
- `POST /api/concerts/add-artist` - Add artist to concert
- `POST /api/concerts/add-sponsor` - Add sponsor to concert
- `POST /api/concerts/add-song` - Add song to concert

### Artist Routes

- `GET /api/artists` - Get all artists
- `POST /api/artists/create` - Create artist
- `GET /api/artists/:id` - Get artist by ID
- `PUT /api/artists/:id` - Update artist
- `DELETE /api/artists/:id` - Delete artist
- `GET /api/artists/search?query=...` - Search artists

### Attendee Routes

- `POST /api/attendees/register` - Register attendee
- `GET /api/attendees` - Get all attendees
- `GET /api/attendees/concert/:concertId` - Get attendees by concert

### Analytics Routes (12 Queries)

1. **Q1: Concerts with 1000+ Attendees**

   ```
   GET /api/analytics/q1/high-attendance
   ```

2. **Q2: Band with Most Ticket Sales**

   ```
   GET /api/analytics/q2/top-band-sales
   ```

3. **Q3: Venues with 5+ Concerts**

   ```
   GET /api/analytics/q3/top-venues
   ```

4. **Q4: Sold Out Merchandise**

   ```
   GET /api/analytics/q4/sold-out-merchandise
   ```

5. **Q5: Guest Artists in Multiple Concerts**

   ```
   GET /api/analytics/q5/multiple-concert-artists
   ```

6. **Q6: Average Ticket Sales per Venue**

   ```
   GET /api/analytics/q6/avg-ticket-sales-per-venue
   ```

7. **Q7: Concerts with Collaborations**

   ```
   GET /api/analytics/q7/collaboration-concerts
   ```

8. **Q8: Sponsors Supporting 3+ Concerts**

   ```
   GET /api/analytics/q8/sponsor-coverage
   ```

9. **Q9: Fans Attending 3+ Concerts**

   ```
   GET /api/analytics/q9/loyal-fans
   ```

10. **Q10: Most Popular Song**

    ```
    GET /api/analytics/q10/popular-song
    ```

11. **Q11: Concerts with Highest Merchandise Revenue**

    ```
    GET /api/analytics/q11/top-merchandise-revenue
    ```

12. **Q12: Artists in Multiple Venues**
    ```
    GET /api/analytics/q12/multi-venue-artists
    ```

## 🎨 Frontend Pages

### User Pages

- **Home** (`/`) - Landing page with hero section
- **Events** (`/events`) - Browse all concerts
- **Artists** (`/artists`) - View all artists
- **Collaborations** (`/collaborations`) - See artist collaborations
- **Register** (`/register`) - Register for concerts

### Admin Pages

- **Admin Login** (`/admin/login`) - Admin authentication
- **Admin Dashboard** (`/admin/dashboard`) - View all analytics with interactive tabs

## 📝 Data Models

### Concert

```javascript
{
  name: String,
  venue: ObjectId (ref: Venue),
  concertDate: Date,
  concertTime: String,
  description: String,
  artists: [ObjectId] (ref: Artist),
  sponsors: [ObjectId] (ref: Sponsor),
  playlist: [ObjectId] (ref: Song),
  ticketPrice: Number,
  capacity: Number
}
```

### Artist

```javascript
{
  name: String,
  type: String (solo|band|guest),
  genres: [String],
  bio: String
}
```

### Venue

```javascript
{
  name: String,
  capacity: Number,
  address: {
    city: String,
    state: String,
    pin_code: Number
  }
}
```

### Ticket

```javascript
{
  attendeeName: String,
  attendeeEmail: String,
  attendeePhone: String,
  concert: ObjectId (ref: Concert),
  venue: ObjectId (ref: Venue),
  price: Number,
  ticketDate: Date
}
```

### Merchandise

```javascript
{
  name: String,
  price: Number,
  stockQuantity: Number,
  itemsSold: Number,
  isSoldOut: Boolean,
  concert: ObjectId (ref: Concert)
}
```

### Sponsor

```javascript
{
  name: String,
  category: String,
  website: String,
  logo: String
}
```

### Song

```javascript
{
  name: String,
  artist: ObjectId (ref: Artist),
  duration: Number,
  genre: String,
  songUrl: String,
  playCount: Number
}
```

## 🔑 Default Admin Credentials

For demo purposes (change in production):

- **Username**: admin
- **Password**: admin@123

To create a new admin, use the register endpoint:

```bash
POST /api/admin/register
{
  "username": "your-username",
  "password": "your-password",
  "phone": "1234567890"
}
```

## 🎯 Features

✅ Browse all concerts with detailed information
✅ View artist profiles and their concert history
✅ See artist collaborations
✅ Register for concerts as an attendee
✅ Admin panel with comprehensive analytics
✅ 12 powerful analytics queries
✅ Responsive design with Tailwind CSS
✅ Interactive UI components with shadcn

## 🛠️ Technology Stack

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Shadcn/ui Components

## 📧 Sample API Requests

### Register Attendee

```bash
POST http://localhost:8000/api/attendees/register
Content-Type: application/json

{
  "attendeeName": "John Doe",
  "attendeeEmail": "john@example.com",
  "attendeePhone": "9876543210",
  "concert": "concert-id-here",
  "venue": "venue-id-here",
  "price": 50
}
```

### Create Concert

```bash
POST http://localhost:8000/api/concerts/create
Content-Type: application/json

{
  "name": "Summer Festival 2024",
  "venue": "venue-id",
  "concertDate": "2024-06-15",
  "concertTime": "19:00",
  "ticketPrice": 99,
  "capacity": 5000,
  "description": "Amazing summer festival"
}
```

### Create Artist

```bash
POST http://localhost:8000/api/artists/create
Content-Type: application/json

{
  "name": "The Beatles",
  "type": "band",
  "genres": ["Rock", "Pop"],
  "bio": "Legendary band from Liverpool"
}
```

## 🐛 Troubleshooting

### Backend Connection Issues

- Verify MongoDB connection string in `config/dbConfig.js`
- Ensure MongoDB is running
- Check firewall settings for port 8000

### Frontend API Connection Issues

- Verify backend is running on port 8000
- Check `.env` file has correct `VITE_API_URL`
- Open browser console for error messages
- Check CORS is enabled in backend

### Port Already in Use

```bash
# Kill process on port 8000 (backend)
# Windows: netstat -ano | findstr :8000
# Kill: taskkill /PID <PID> /F

# Kill process on port 5173 (frontend)
# Windows: netstat -ano | findstr :5173
```

## 📈 Future Enhancements

- User authentication and profiles
- Booking history
- Payment integration
- Email notifications
- Review and ratings
- Advanced search filters
- Video tickets
- Social media integration

## 📄 License

ISC

## 👥 Contributors

- Music Concert Team

---

For questions or issues, please check the documentation or create an issue in the repository.
