import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { apiCall, formatDate, formatCurrency } from "../lib/api";
import Hero from "../components/Home/Hero";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HomePage = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [collaborations, setCollaborations] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const sectionRefs = useRef({});

  useEffect(() => {
    fetchHomepageData();
  }, []);

  useEffect(() => {
    if (!loading) {
      animateSections();
    }
  }, [loading]);

  const animateSections = () => {
    // Only animate on larger screens to reduce overhead
    if (window.innerWidth < 768) return;

    // Animate section headings and cards on scroll
    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.fromTo(
        title,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: title,
            start: "top 80%",
            end: "top 60%",
            scrub: false,
            once: true,
          },
        }
      );
    });

    let cardIndex = 0;
    gsap.utils
      .toArray(".event-card, .artist-card, .collab-card")
      .forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            delay: (cardIndex++ % 6) * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 65%",
              scrub: false,
              once: true,
            },
          }
        );
      });

    // Hover animations for cards
    gsap.utils
      .toArray(".event-card, .artist-card, .collab-card")
      .forEach((card) => {
        card.addEventListener("mouseenter", () => {
          gsap.to(card, {
            y: -8,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
        card.addEventListener("mouseleave", () => {
          gsap.to(card, {
            y: 0,
            duration: 0.2,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });
  };

  const fetchHomepageData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel for better performance
      const [eventsRes, collabRes, artistsRes] = await Promise.allSettled([
        apiCall("/concerts"),
        apiCall("/analytics/q7/collaboration-concerts"),
        apiCall("/artists"),
      ]);

      // Handle events
      if (eventsRes.status === "fulfilled") {
        const eventsList = eventsRes.value.data || eventsRes.value;
        setUpcomingEvents(
          Array.isArray(eventsList) ? eventsList.slice(0, 6) : []
        );
      }

      // Handle collaborations
      if (collabRes.status === "fulfilled") {
        const collabList = collabRes.value.data || collabRes.value;
        setCollaborations(
          Array.isArray(collabList) ? collabList.slice(0, 4) : []
        );
      }

      // Handle artists
      if (artistsRes.status === "fulfilled") {
        const artistsList = artistsRes.value.data || artistsRes.value;
        setArtists(Array.isArray(artistsList) ? artistsList.slice(0, 6) : []);
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-b from-black via-slate-950 to-black px-8 section-title">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "1000+", label: "Live Events" },
              { number: "5000+", label: "Featured Artists" },
              { number: "100K+", label: "Happy Fans" },
              { number: "24/7", label: "Support" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-6 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500 transition-all duration-300"
              >
                <h3 className="text-4xl font-bold text-blue-400 mb-2">
                  {stat.number}
                </h3>
                <p className="text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section
        className="py-20 bg-black px-8"
        ref={(el) => (sectionRefs.current.events = el)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16 section-title">
            <div>
              <h2 className="text-5xl font-bold text-white mb-3">
                🎵 Upcoming Events
              </h2>
              <p className="text-slate-400 text-lg">
                Don't miss out on the hottest concerts happening near you
              </p>
            </div>
            <Link to="/events">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2 text-lg">
                View All Events →
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="text-center text-slate-400 py-12">
              Loading events...
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No upcoming events
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <Link key={event._id} to={`/events/${event._id}`}>
                  <div className="event-card bg-gradient-to-br from-slate-900 to-black rounded-xl overflow-hidden border border-white/10 hover:border-blue-500 h-full shadow-lg hover:shadow-2xl transition-all duration-300">
                    <div className="p-6 bg-gradient-to-r from-blue-700 to-blue-600 relative">
                      <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        {event.artists?.length || 0} Artist
                        {(event.artists?.length || 0) !== 1 ? "s" : ""}
                      </div>
                      <h3 className="text-2xl font-bold text-white pr-20">
                        {event.name}
                      </h3>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center text-slate-300 font-semibold">
                        <span className="text-blue-400 mr-2">📅</span>
                        {formatDate(event.concertDate)}
                      </div>
                      <div className="flex items-center text-slate-300">
                        <span className="text-blue-400 mr-2">🕐</span>
                        {event.concertTime}
                      </div>
                      {event.venue && (
                        <div className="flex items-center text-slate-300 truncate">
                          <span className="text-blue-400 mr-2">📍</span>
                          {event.venue.name || event.venue}
                        </div>
                      )}
                      <div className="pt-2 border-t border-white/10">
                        <p className="text-blue-400 font-bold text-xl mb-3">
                          {formatCurrency(event.ticketPrice)}
                        </p>
                        {event.description && (
                          <p className="text-slate-400 text-sm line-clamp-2 mb-4">
                            {event.description}
                          </p>
                        )}
                        <Button className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-all">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Artists Section */}
      <section
        className="py-20 bg-gradient-to-b from-slate-950 to-black px-8"
        ref={(el) => (sectionRefs.current.artists = el)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16 section-title">
            <div>
              <h2 className="text-5xl font-bold text-white mb-3">
                🎤 Featured Artists
              </h2>
              <p className="text-slate-400 text-lg">
                Discover the incredible talents performing at our events
              </p>
            </div>
            <Link to="/artists">
              <Button className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 text-lg">
                View All Artists →
              </Button>
            </Link>
          </div>

          {artists.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No artists available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {artists.map((artist) => (
                <div
                  key={artist._id}
                  className="artist-card bg-gradient-to-br from-slate-900 to-black rounded-xl overflow-hidden border border-white/10 hover:border-purple-500 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-6 bg-gradient-to-r from-purple-700 to-purple-600">
                    <h3 className="text-2xl font-bold text-white">
                      {artist.name}
                    </h3>
                    <p className="text-purple-100 text-sm mt-2">
                      {artist.type || "Solo Artist"}
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    {artist.genres && artist.genres.length > 0 && (
                      <div>
                        <p className="text-slate-400 text-sm mb-3 font-semibold">
                          Genres
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {artist.genres.slice(0, 3).map((genre, idx) => (
                            <span
                              key={idx}
                              className="bg-purple-600/50 text-white px-3 py-1 rounded-full text-xs font-semibold border border-purple-500"
                            >
                              {genre}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {artist.bio && (
                      <p className="text-slate-400 text-sm line-clamp-3">
                        {artist.bio}
                      </p>
                    )}
                    <Link to="/artists">
                      <Button className="w-full mt-4 bg-purple-600 text-white hover:bg-purple-700 transition-all">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Collaborations Section */}
      <section
        className="py-20 bg-black px-8"
        ref={(el) => (sectionRefs.current.collabs = el)}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-16 section-title">
            <div>
              <h2 className="text-5xl font-bold text-white mb-3">
                🤝 Artist Collaborations
              </h2>
              <p className="text-slate-400 text-lg">
                Experience unique partnerships and special performances
              </p>
            </div>
            <Link to="/collaborations">
              <Button className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 text-lg">
                View All →
              </Button>
            </Link>
          </div>

          {collaborations.length === 0 ? (
            <div className="text-center text-slate-400 py-12">
              No collaborations available
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collaborations.map((collab) => (
                <div
                  key={collab._id}
                  className="collab-card bg-gradient-to-br from-slate-900 to-black rounded-xl overflow-hidden border border-white/10 hover:border-indigo-500 shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-6 bg-gradient-to-r from-indigo-700 to-blue-600">
                    <h3 className="text-2xl font-bold text-white">
                      {collab.name}
                    </h3>
                    <p className="text-blue-100 text-sm mt-2">
                      {collab.artistCount || collab.artistDetails?.length || 0}{" "}
                      Artist Collaboration
                    </p>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center text-slate-300 font-semibold">
                      <span className="text-indigo-400 mr-2">📅</span>
                      {formatDate(collab.concertDate)}
                    </div>
                    {collab.artistDetails &&
                      collab.artistDetails.length > 0 && (
                        <div>
                          <p className="text-slate-400 text-sm mb-3 font-semibold">
                            Featured Artists
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {collab.artistDetails.slice(0, 4).map((artist) => (
                              <span
                                key={artist._id}
                                className="bg-indigo-600/50 text-white px-3 py-1 rounded-full text-sm border border-indigo-500 font-semibold"
                              >
                                {artist.name}
                              </span>
                            ))}
                            {collab.artistDetails.length > 4 && (
                              <span className="text-slate-400 text-sm px-3 py-1 font-semibold">
                                +{collab.artistDetails.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    <Link to="/collaborations">
                      <Button className="w-full mt-4 bg-indigo-600 text-white hover:bg-indigo-700 transition-all">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-black px-8 section-title">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold text-white mb-4 text-center">
            Why Choose MusicLive?
          </h2>
          <p className="text-slate-400 text-center mb-16 text-lg">
            Your ultimate destination for unforgettable concert experiences
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "🎟️",
                title: "Easy Booking",
                desc: "Simple and secure ticket purchases",
              },
              {
                icon: "🎵",
                title: "Top Artists",
                desc: "Access to premium performers",
              },
              {
                icon: "💰",
                title: "Best Prices",
                desc: "Competitive pricing on all events",
              },
              {
                icon: "📱",
                title: "Mobile App",
                desc: "Manage bookings on the go",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500 text-center transition-all duration-300 hover:scale-105"
              >
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 via-purple-700 to-blue-600 px-8 section-title">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-4">
            Stay Updated on New Events
          </h2>
          <p className="text-blue-100 mb-8 text-lg">
            Subscribe to our newsletter and never miss exclusive previews and
            early-bird offers
          </p>
          <div className="flex gap-3 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:outline-none focus:border-white transition-all"
            />
            <Button className="bg-black text-white hover:bg-slate-900 font-bold px-8 py-3 rounded-lg transition-all">
              Subscribe
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20 bg-black px-8 section-title">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-4">
            Ready for an Unforgettable Experience?
          </h2>
          <p className="text-slate-400 mb-8 text-lg">
            Register now to get exclusive access to early ticket sales and
            special event updates
          </p>
          <Link to="/register">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-3 font-bold transition-all">
              Register Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-white/10 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-4">About MusicLive</h3>
              <p className="text-slate-400 text-sm">
                Your ultimate destination for concert experiences
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <Link to="/events" className="hover:text-white">
                    Events
                  </Link>
                </li>
                <li>
                  <Link to="/artists" className="hover:text-white">
                    Artists
                  </Link>
                </li>
                <li>
                  <Link to="/collaborations" className="hover:text-white">
                    Collaborations
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Follow Us</h3>
              <div className="flex gap-4 text-slate-400">
                <a href="#" className="hover:text-white text-xl">
                  f
                </a>
                <a href="#" className="hover:text-white text-xl">
                  𝕏
                </a>
                <a href="#" className="hover:text-white text-xl">
                  📷
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-slate-400">
            <p>&copy; 2024 MusicLive. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
