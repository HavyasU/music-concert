import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { apiCall } from "../lib/api";

const ArtistsPage = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredArtists, setFilteredArtists] = useState([]);
  const [filterGenre, setFilterGenre] = useState("");
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    filterArtists();
  }, [searchTerm, filterGenre, artists]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const response = await apiCall("/artists");
      const artistsList = response.data || response;
      const artistsArray = Array.isArray(artistsList) ? artistsList : [];
      setArtists(artistsArray);

      // Extract unique genres
      const uniqueGenres = new Set();
      artistsArray.forEach((artist) => {
        if (artist.genres && Array.isArray(artist.genres)) {
          artist.genres.forEach((genre) => uniqueGenres.add(genre));
        }
      });
      setGenres(Array.from(uniqueGenres).sort());
    } catch (error) {
      console.error("Error fetching artists:", error);
      setArtists([]);
    } finally {
      setLoading(false);
    }
  };

  const filterArtists = () => {
    let filtered = artists;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (artist) =>
          artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          artist.type?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterGenre) {
      filtered = filtered.filter(
        (artist) => artist.genres && artist.genres.includes(filterGenre)
      );
    }

    setFilteredArtists(filtered);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-white min-h-screen">
        Loading artists...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">All Artists</h1>
          <p className="text-slate-400 text-lg">
            Discover amazing musicians performing at our events
          </p>
        </div>

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input
            type="text"
            placeholder="Search artists by name or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-3 rounded-lg bg-slate-900 text-white placeholder-slate-400 border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
          />
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
            className="px-4 py-3 rounded-lg bg-slate-900 text-white border border-white/10 focus:border-blue-500 focus:outline-none transition-colors"
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        {/* Artists Grid */}
        {filteredArtists.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg">
              {searchTerm || filterGenre
                ? "No artists found matching your filters."
                : "No artists available."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtists.map((artist) => (
              <div
                key={artist._id}
                className="bg-slate-900 rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer border border-white/10 hover:border-purple-500 group"
                onClick={() => setSelectedArtist(artist)}
              >
                <div className="p-6 bg-gradient-to-r from-purple-700 to-purple-600 group-hover:from-purple-600 group-hover:to-purple-500 transition-all">
                  <h3 className="text-xl font-bold text-white">
                    {artist.name}
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    {artist.type || "Solo Artist"}
                  </p>
                </div>
                <div className="p-6 space-y-4">
                  {artist.genres && artist.genres.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-sm mb-2">Genres</p>
                      <div className="flex flex-wrap gap-2">
                        {artist.genres.slice(0, 3).map((genre, idx) => (
                          <span
                            key={idx}
                            className="bg-purple-600 text-white px-2 py-1 rounded text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                        {artist.genres.length > 3 && (
                          <span className="text-slate-400 text-xs px-2 py-1">
                            +{artist.genres.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {artist.bio && (
                    <p className="text-slate-400 text-sm line-clamp-3">
                      {artist.bio}
                    </p>
                  )}
                  <Button
                    className="w-full mt-4 bg-purple-600 text-white hover:bg-purple-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedArtist(artist);
                    }}
                  >
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Artist Detail Modal */}
        {selectedArtist && (
          <ArtistModal
            artist={selectedArtist}
            onClose={() => setSelectedArtist(null)}
          />
        )}
      </div>
    </div>
  );
};

const ArtistModal = ({ artist, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto border border-white/10">
        <div className="p-6 bg-gradient-to-r from-purple-700 to-purple-600 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">{artist.name}</h2>
          <button
            onClick={onClose}
            className="text-white text-xl hover:opacity-75"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <p className="text-slate-400 text-sm mb-1">Type</p>
            <p className="text-white font-semibold">
              {artist.type || "Solo Artist"}
            </p>
          </div>

          {artist.genres && artist.genres.length > 0 && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Genres</p>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((genre, idx) => (
                  <span
                    key={idx}
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {artist.bio && (
            <div>
              <p className="text-slate-400 text-sm mb-2">Biography</p>
              <p className="text-slate-300">{artist.bio}</p>
            </div>
          )}

          <div className="border-t border-white/10 pt-4">
            <Button
              className="w-full bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => {
                window.location.href = "/events";
              }}
            >
              View Events with This Artist
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistsPage;
