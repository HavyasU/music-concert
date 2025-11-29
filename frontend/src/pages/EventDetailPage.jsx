import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { apiCall, formatDate, formatCurrency } from "../lib/api";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEventDetails();
  }, [id]);

  const fetchEventDetails = async () => {
    try {
      setLoading(true);
      const response = await apiCall(`/concerts/${id}`);
      setEvent(response.data || response);
    } catch (error) {
      console.error("Error fetching event:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-center text-white">
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-white mb-4">
            Event Not Found
          </h1>
          <Button
            onClick={() => navigate("/events")}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-400 hover:text-blue-300 flex items-center gap-2"
        >
          ← Back
        </button>

        {/* Main Event Card */}
        <div className="bg-slate-900 rounded-lg overflow-hidden border border-white/10 mb-8">
          {/* Event Banner */}
          <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-8 text-white">
            <h1 className="text-5xl font-bold mb-2">{event.name}</h1>
            <p className="text-blue-100 text-lg">
              {event.artists?.length || 0} Artist
              {(event.artists?.length || 0) !== 1 ? "s" : ""} Performing
            </p>
          </div>

          {/* Event Details */}
          <div className="p-8 space-y-8">
            {/* Key Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-black/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">📅 Date</p>
                  <p className="text-white font-semibold text-lg">
                    {formatDate(event.concertDate)}
                  </p>
                </div>

                <div className="bg-black/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">🕐 Time</p>
                  <p className="text-white font-semibold text-lg">
                    {event.concertTime}
                  </p>
                </div>

                <div className="bg-black/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">🎫 Ticket Price</p>
                  <p className="text-blue-400 font-bold text-2xl">
                    {formatCurrency(event.ticketPrice)}
                  </p>
                </div>

                <div className="bg-black/50 p-4 rounded-lg">
                  <p className="text-slate-400 text-sm mb-1">👥 Capacity</p>
                  <p className="text-white font-semibold text-lg">
                    {event.capacity} People
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {event.venue && (
                  <div className="bg-black/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-1">📍 Venue</p>
                    <p className="text-white font-semibold text-lg">
                      {event.venue.name || event.venue}
                    </p>
                    {event.venue.address && (
                      <p className="text-slate-300 text-sm mt-2">
                        {event.venue.address}
                      </p>
                    )}
                    {event.venue.capacity && (
                      <p className="text-slate-300 text-sm">
                        Capacity: {event.venue.capacity}
                      </p>
                    )}
                  </div>
                )}

                {event.description && (
                  <div className="bg-black/50 p-4 rounded-lg">
                    <p className="text-slate-400 text-sm mb-2">
                      📝 Description
                    </p>
                    <p className="text-slate-300">{event.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Artists Section */}
            {event.artists && event.artists.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🎤 Performing Artists ({event.artists.length})
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.artists.map((artist) => (
                    <div
                      key={artist._id}
                      className="bg-black/50 p-4 rounded-lg border border-white/10 hover:border-blue-500 transition-colors"
                    >
                      <h3 className="text-white font-bold text-lg">
                        {artist.name}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">
                        {artist.type || "Solo Artist"}
                      </p>
                      {artist.genres && artist.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {artist.genres.slice(0, 3).map((genre, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      )}
                      {artist.bio && (
                        <p className="text-slate-300 text-sm mt-3">
                          {artist.bio}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sponsors Section */}
            {event.sponsors && event.sponsors.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  💼 Sponsors
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.sponsors.map((sponsor) => (
                    <div
                      key={sponsor._id}
                      className="bg-black/50 p-4 rounded-lg border border-white/10"
                    >
                      <h3 className="text-white font-bold">{sponsor.name}</h3>
                      {sponsor.website && (
                        <a
                          href={sponsor.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm mt-1"
                        >
                          Visit Website
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Playlist Section */}
            {event.playlist && event.playlist.length > 0 && (
              <div className="border-t border-white/10 pt-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  🎵 Playlist ({event.playlist.length} Songs)
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {event.playlist.map((song, idx) => (
                    <div
                      key={song._id || idx}
                      className="bg-black/50 p-3 rounded-lg flex items-center justify-between hover:bg-black/70 transition-colors"
                    >
                      <div>
                        <p className="text-white font-semibold">
                          {idx + 1}. {song.name}
                        </p>
                        {song.artist && (
                          <p className="text-slate-400 text-sm">
                            by {song.artist.name || song.artist}
                          </p>
                        )}
                      </div>
                      {song.duration && (
                        <span className="text-slate-400 text-sm">
                          {song.duration}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Register Button */}
            <div className="border-t border-white/10 pt-8">
              <Button
                onClick={() => {
                  window.location.href = `/register?eventId=${event._id}`;
                }}
                className="w-full bg-blue-600 text-white hover:bg-blue-700 text-lg py-6 font-bold"
              >
                Register for This Event
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
