import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { apiCall, formatDate, formatCurrency } from "../lib/api";

const AttendeeRegistrationPage = () => {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get("eventId");

  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    attendeeName: "",
    attendeeEmail: "",
    attendeePhone: "",
    concertId: eventId || "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (eventId && events.length > 0) {
      const event = events.find((e) => e._id === eventId);
      if (event) {
        setSelectedEvent(event);
        setFormData((prev) => ({ ...prev, concertId: eventId }));
      }
    }
  }, [eventId, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/concerts");
      const eventsList = response.data || response;
      setEvents(Array.isArray(eventsList) ? eventsList : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setMessage("Error loading events");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEventChange = (e) => {
    const concertId = e.target.value;
    const event = events.find((evt) => evt._id === concertId);
    setSelectedEvent(event || null);
    setFormData((prev) => ({
      ...prev,
      concertId: concertId,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.attendeeName ||
      !formData.attendeeEmail ||
      !formData.attendeePhone ||
      !formData.concertId
    ) {
      setMessage("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      setMessage("");

      const payload = {
        attendeeName: formData.attendeeName,
        attendeeEmail: formData.attendeeEmail,
        attendeePhone: formData.attendeePhone,
        concertId: formData.concertId,
      };

      await apiCall("/attendees/register", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setMessage("✅ Registration successful! Thank you for registering.");
      setFormData({
        attendeeName: "",
        attendeeEmail: "",
        attendeePhone: "",
        concertId: eventId || "",
      });
    } catch (error) {
      setMessage(`❌ Registration failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-center text-white">
        Loading events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            Register for an Event
          </h1>
          <p className="text-slate-400 text-lg">
            Book your tickets and secure your spot at the concert
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Registration Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900 rounded-lg p-8 border border-white/10"
            >
              <h2 className="text-2xl font-bold text-white mb-6">
                Your Information
              </h2>

              {/* Message */}
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg ${
                    message.includes("✅")
                      ? "bg-green-900/30 text-green-300 border border-green-500"
                      : "bg-red-900/30 text-red-300 border border-red-500"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Full Name */}
              <div className="mb-6">
                <label className="block text-slate-300 font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="attendeeName"
                  value={formData.attendeeName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-black text-white placeholder-slate-400 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-slate-300 font-semibold mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="attendeeEmail"
                  value={formData.attendeeEmail}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-black text-white placeholder-slate-400 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-slate-300 font-semibold mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="attendeePhone"
                  value={formData.attendeePhone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 rounded-lg bg-black text-white placeholder-slate-400 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* Event Selection */}
              <div className="mb-8">
                <label className="block text-slate-300 font-semibold mb-2">
                  Select Event *
                </label>
                <select
                  name="concertId"
                  value={formData.concertId}
                  onChange={handleEventChange}
                  className="w-full px-4 py-3 rounded-lg bg-black text-white border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
                  required
                >
                  <option value="">-- Choose an Event --</option>
                  {events.map((event) => (
                    <option key={event._id} value={event._id}>
                      {event.name} - {formatDate(event.concertDate)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={submitting || !formData.concertId}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-lg py-3 font-bold"
              >
                {submitting ? "Registering..." : "Register Now"}
              </Button>
            </form>
          </div>

          {/* Event Details Sidebar */}
          <div>
            {selectedEvent ? (
              <div className="bg-slate-900 rounded-lg p-6 border border-white/10 sticky top-20">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Selected Event
                </h2>

                <div className="space-y-6">
                  <div className="pb-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">
                      {selectedEvent.name}
                    </h3>
                  </div>

                  <div>
                    <p className="text-slate-400 text-sm mb-1">📅 Date</p>
                    <p className="text-white font-semibold">
                      {formatDate(selectedEvent.concertDate)}
                    </p>
                  </div>

                  {selectedEvent.concertTime && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">🕐 Time</p>
                      <p className="text-white font-semibold">
                        {selectedEvent.concertTime}
                      </p>
                    </div>
                  )}

                  {selectedEvent.venue && (
                    <div>
                      <p className="text-slate-400 text-sm mb-1">📍 Venue</p>
                      <p className="text-white font-semibold">
                        {selectedEvent.venue.name || selectedEvent.venue}
                      </p>
                    </div>
                  )}

                  <div className="pt-6 border-t border-white/10">
                    <p className="text-slate-400 text-sm mb-1">
                      🎫 Price per Ticket
                    </p>
                    <p className="text-blue-400 font-bold text-2xl">
                      {formatCurrency(selectedEvent.ticketPrice)}
                    </p>
                  </div>

                  {selectedEvent.artists &&
                    selectedEvent.artists.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-sm mb-2">
                          🎤 Artists
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedEvent.artists.slice(0, 2).map((artist) => (
                            <span
                              key={artist._id}
                              className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs"
                            >
                              {artist.name}
                            </span>
                          ))}
                          {selectedEvent.artists.length > 2 && (
                            <span className="text-slate-400 text-xs px-3 py-1">
                              +{selectedEvent.artists.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-900 rounded-lg p-6 border border-white/10 text-center">
                <p className="text-slate-400">Select an event to see details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeRegistrationPage;
