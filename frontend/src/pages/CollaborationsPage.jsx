import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { apiCall, formatDate, formatCurrency } from "../lib/api";

const CollaborationsPage = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);

  useEffect(() => {
    fetchCollaborations();
  }, []);

  const fetchCollaborations = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/analytics/q7/collaboration-concerts");
      const collabList = response.data || response;
      setCollaborations(Array.isArray(collabList) ? collabList : []);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      setCollaborations([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-white min-h-screen">
        Loading collaborations...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">
            🤝 Artist Collaborations
          </h1>
          <p className="text-slate-400 text-lg">
            Experience unique partnerships and special performances between
            artists
          </p>
        </div>

        {collaborations.length === 0 ? (
          <div className="bg-slate-900 rounded-lg p-12 text-center border border-white/10">
            <p className="text-slate-400 text-lg">No collaborations found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {collaborations.map((collab) => (
              <div
                key={collab._id}
                className="bg-slate-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-indigo-500 group"
                onClick={() => setSelectedCollaboration(collab)}
              >
                <div className="p-6 bg-gradient-to-r from-indigo-700 to-blue-600 group-hover:from-indigo-600 group-hover:to-blue-500 transition-all">
                  <h3 className="text-2xl font-bold text-white">
                    {collab.name}
                  </h3>
                  <p className="text-blue-100 text-sm mt-1">
                    {collab.artistCount || collab.artistDetails?.length || 0}{" "}
                    Artist Collaboration
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  <p className="text-slate-300 font-semibold">
                    📅 {formatDate(collab.concertDate)}
                  </p>

                  {collab.concertTime && (
                    <p className="text-slate-300">🕐 {collab.concertTime}</p>
                  )}

                  {collab.ticketPrice && (
                    <p className="text-blue-400 font-bold">
                      {formatCurrency(collab.ticketPrice)}
                    </p>
                  )}

                  {collab.artistDetails && collab.artistDetails.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">
                        Collaborating Artists
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {collab.artistDetails.slice(0, 3).map((artist) => (
                          <span
                            key={artist._id}
                            className="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm"
                          >
                            {artist.name}
                          </span>
                        ))}
                        {collab.artistDetails.length > 3 && (
                          <span className="text-slate-400 text-sm px-3 py-1">
                            +{collab.artistDetails.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {collab.description && (
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {collab.description}
                    </p>
                  )}

                  <Button
                    className="w-full mt-4 bg-indigo-600 text-white hover:bg-indigo-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCollaboration(collab);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedCollaboration && (
          <CollaborationModal
            collaboration={selectedCollaboration}
            onClose={() => setSelectedCollaboration(null)}
          />
        )}
      </div>
    </div>
  );
};

const CollaborationModal = ({ collaboration, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg max-w-3xl w-full max-h-[80vh] overflow-y-auto border border-white/10">
        <div className="p-6 bg-gradient-to-r from-indigo-700 to-blue-600 flex justify-between items-center sticky top-0">
          <h2 className="text-2xl font-bold text-white">
            {collaboration.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:opacity-75"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Event Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/50 p-4 rounded-lg">
              <p className="text-slate-400 text-sm mb-1">📅 Date</p>
              <p className="text-white font-semibold">
                {formatDate(collaboration.concertDate)}
              </p>
            </div>

            {collaboration.concertTime && (
              <div className="bg-black/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">🕐 Time</p>
                <p className="text-white font-semibold">
                  {collaboration.concertTime}
                </p>
              </div>
            )}

            {collaboration.ticketPrice && (
              <div className="bg-black/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">🎫 Ticket Price</p>
                <p className="text-blue-400 font-bold">
                  {formatCurrency(collaboration.ticketPrice)}
                </p>
              </div>
            )}

            {collaboration.venue && (
              <div className="bg-black/50 p-4 rounded-lg">
                <p className="text-slate-400 text-sm mb-1">📍 Venue</p>
                <p className="text-white font-semibold">
                  {collaboration.venue.name || collaboration.venue}
                </p>
              </div>
            )}
          </div>

          {/* Collaborating Artists */}
          {collaboration.artistDetails &&
            collaboration.artistDetails.length > 0 && (
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  🎤 Collaborating Artists ({collaboration.artistDetails.length}
                  )
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {collaboration.artistDetails.map((artist) => (
                    <div
                      key={artist._id}
                      className="bg-black/50 p-4 rounded-lg border border-white/10 hover:border-indigo-500 transition-colors"
                    >
                      <h4 className="text-white font-bold text-lg">
                        {artist.name}
                      </h4>
                      <p className="text-slate-400 text-sm mt-1">
                        {artist.type || "Solo Artist"}
                      </p>
                      {artist.genres && artist.genres.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {artist.genres.slice(0, 3).map((genre, idx) => (
                            <span
                              key={idx}
                              className="bg-indigo-600 text-white px-2 py-1 rounded text-xs"
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

          {/* Description */}
          {collaboration.description && (
            <div className="border-t border-white/10 pt-6">
              <h3 className="text-xl font-bold text-white mb-2">About</h3>
              <p className="text-slate-300">{collaboration.description}</p>
            </div>
          )}

          {/* Call to Action */}
          <div className="border-t border-white/10 pt-6">
            <Button
              onClick={() => {
                window.location.href = `/register?eventId=${collaboration._id}`;
              }}
              className="w-full bg-indigo-600 text-white hover:bg-indigo-700 text-lg py-3 font-bold"
            >
              Register for This Collaboration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborationsPage;
