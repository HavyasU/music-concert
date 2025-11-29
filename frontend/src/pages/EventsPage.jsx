import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { apiCall, formatDate, formatCurrency } from "../lib/api";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/concerts");
      const eventsList = response.data || response;
      setEvents(Array.isArray(eventsList) ? eventsList : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const filterEvents = () => {
    if (!searchTerm.trim()) {
      setFilteredEvents(events);
      return;
    }

    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredEvents(filtered);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-white min-h-screen">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">All Events</h1>
          <p className="text-slate-400 text-lg">
            Browse and register for upcoming concerts
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search events by name, venue, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-slate-900 text-white placeholder-slate-400 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              {searchTerm
                ? "No events found matching your search."
                : "No events available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-slate-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-blue-500 group"
              >
                <div className="p-6 bg-gradient-to-r from-blue-700 to-blue-600 group-hover:from-blue-600 group-hover:to-blue-500 transition-all">
                  <h3 className="text-xl font-bold text-white truncate">
                    {event.name}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {event.artists?.length || 0} Artist
                    {(event.artists?.length || 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="p-6 space-y-3">
                  <div className="space-y-2">
                    <p className="text-slate-300 font-semibold">
                      📅 {formatDate(event.concertDate)}
                    </p>
                    <p className="text-slate-300">🕐 {event.concertTime}</p>
                    {event.venue && (
                      <p className="text-slate-300 truncate">
                        📍 {event.venue.name || event.venue}
                      </p>
                    )}
                  </div>
                  <div className="border-t border-white/10 pt-3">
                    <p className="text-blue-400 font-bold text-lg">
                      {formatCurrency(event.ticketPrice)}
                    </p>
                  </div>
                  {event.description && (
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {event.description}
                    </p>
                  )}
                  <Link
                    to={`/events/${event._id}`}
                    className="block mt-4"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
