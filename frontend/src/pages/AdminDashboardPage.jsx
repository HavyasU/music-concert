import React, { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/button";
import { apiCall, formatCurrency, formatDate } from "../lib/api";
import ManageTab from "./admin/ManageTab";

const AdminDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [data, setData] = useState({
    overview: {},
    q1: [],
    q2: null,
    q3: [],
    q4: [],
    q5: [],
    q6: [],
    q7: [],
    q8: [],
    q9: [],
    q10: null,
    q11: [],
    q12: [],
  });
  const [loading, setLoading] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);

  const fetchOverviewData = useCallback(async () => {
    try {
      setLoading(true);
      // Only fetch overview stats
      const [concerts, artists, attendees] = await Promise.allSettled([
        apiCall("/concerts"),
        apiCall("/artists"),
        apiCall("/attendees"),
      ]);

      const overviewData = {};
      if (concerts.status === "fulfilled") {
        const data = concerts.value.data || concerts.value;
        overviewData.concerts = Array.isArray(data) ? data.length : 0;
      }
      if (artists.status === "fulfilled") {
        const data = artists.value.data || artists.value;
        overviewData.artists = Array.isArray(data) ? data.length : 0;
      }
      if (attendees.status === "fulfilled") {
        const data = attendees.value.data || attendees.value;
        overviewData.attendees = Array.isArray(data) ? data.length : 0;
      }

      setData((prev) => ({ ...prev, overview: overviewData }));
    } catch (error) {
      console.error("Error fetching overview:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTabData = useCallback(async (tab) => {
    try {
      setTabLoading(true);
      const urlMap = {
        q1: "/analytics/q1/high-attendance",
        q2: "/analytics/q2/top-band-sales",
        q3: "/analytics/q3/top-venues",
        q4: "/analytics/q4/sold-out-merchandise",
        q5: "/analytics/q5/multiple-concert-artists",
        q6: "/analytics/q6/avg-ticket-sales-per-venue",
        q7: "/analytics/q7/collaboration-concerts",
        q8: "/analytics/q8/sponsor-coverage",
        q9: "/analytics/q9/loyal-fans",
        q10: "/analytics/q10/popular-song",
        q11: "/analytics/q11/top-merchandise-revenue",
        q12: "/analytics/q12/multi-venue-artists",
      };

      const url = urlMap[tab];
      if (!url) return;

      const response = await apiCall(url);
      const result = response.data || response;

      setData((prev) => ({
        ...prev,
        [tab]:
          tab === "q2" || tab === "q10"
            ? result
            : Array.isArray(result)
            ? result
            : [],
      }));
    } catch (error) {
      console.error(`Error fetching ${tab}:`, error);
      setData((prev) => ({
        ...prev,
        [tab]: ["q2", "q10"].includes(tab) ? null : [],
      }));
    } finally {
      setTabLoading(false);
    }
  }, []);

  // Check if user is logged in and load overview initially
  useEffect(() => {
    const adminUser = localStorage.getItem("adminUser");
    if (!adminUser) {
      window.location.href = "/admin/login";
      return;
    }

    fetchOverviewData();
  }, [fetchOverviewData]);

  // Lazy load tab data when tab changes
  useEffect(() => {
    if (activeTab !== "overview" && activeTab !== "manage") {
      fetchTabData(activeTab);
    }
  }, [activeTab, fetchTabData]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    window.location.href = "/admin/login";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 p-6 bg-white shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">Manage your platform</p>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 text-white hover:bg-red-700 px-6 py-2 rounded-lg font-semibold"
          >
            Logout
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex overflow-x-auto gap-2 mb-6 bg-white p-2 rounded-lg border border-gray-200">
          {[
            { id: "overview", label: "Overview" },
            { id: "q1", label: "Q1: High Attendance" },
            { id: "q2", label: "Q2: Top Band" },
            { id: "q3", label: "Q3: Top Venues" },
            { id: "q4", label: "Q4: Sold Out" },
            { id: "q5", label: "Q5: Multi-Concert Artists" },
            { id: "q6", label: "Q6: Avg Ticket Sales" },
            { id: "q7", label: "Q7: Collaborations" },
            { id: "q8", label: "Q8: Sponsors" },
            { id: "q9", label: "Q9: Loyal Fans" },
            { id: "q10", label: "Q10: Popular Song" },
            { id: "q11", label: "Q11: Merchandise Revenue" },
            { id: "q12", label: "Q12: Multi-Venue Artists" },
            { id: "manage", label: "Manage" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          {tabLoading && (
            <div className="mb-4 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-700 text-sm mt-2">Loading data...</p>
            </div>
          )}
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "q1" && (
            <DataTable
              title="Concerts with 1000+ Attendees"
              data={data.q1}
              columns={["name", "attendeeCount", "concertDate"]}
            />
          )}
          {activeTab === "q2" && (
            <SingleDataView
              title="Band with Most Ticket Sales"
              data={data.q2}
            />
          )}
          {activeTab === "q3" && (
            <DataTable
              title="Venues with 5+ Concerts"
              data={data.q3}
              columns={["name", "concertCount"]}
            />
          )}
          {activeTab === "q4" && (
            <DataTable
              title="Sold Out Merchandise"
              data={data.q4}
              columns={["name", "price", "itemsSold"]}
            />
          )}
          {activeTab === "q5" && (
            <DataTable
              title="Multi-Concert Artists"
              data={data.q5}
              columns={["artistName", "concertCount"]}
            />
          )}
          {activeTab === "q6" && (
            <DataTable
              title="Average Ticket Sales per Venue"
              data={data.q6}
              columns={[
                "venueName",
                "averageTicketsPerConcert",
                "averageRevenuePerConcert",
              ]}
            />
          )}
          {activeTab === "q7" && (
            <DataTable
              title="Concerts with Collaborations"
              data={data.q7}
              columns={["name", "artistCount", "concertDate"]}
            />
          )}
          {activeTab === "q8" && (
            <DataTable
              title="Sponsors with 3+ Concerts"
              data={data.q8}
              columns={["name", "concertCount"]}
            />
          )}
          {activeTab === "q9" && (
            <DataTable
              title="Fans Attending 3+ Concerts"
              data={data.q9}
              columns={["_id", "concertCount", "totalSpent"]}
            />
          )}
          {activeTab === "q10" && (
            <SingleDataView title="Most Popular Song" data={data.q10} />
          )}
          {activeTab === "q11" && (
            <DataTable
              title="Concerts with Highest Merchandise Revenue"
              data={data.q11}
              columns={["concertName", "totalMerchandiseRevenue"]}
            />
          )}
          {activeTab === "q12" && (
            <DataTable
              title="Artists in Multiple Venues"
              data={data.q12}
              columns={["artistName", "uniqueVenueCount"]}
            />
          )}
          {activeTab === "manage" && <ManageTab />}
        </div>
      </div>
    </div>
  );
};

const OverviewTab = () => {
  const [stats, setStats] = useState({
    concerts: 0,
    artists: 0,
    venues: 0,
    attendees: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const concerts = await apiCall("/concerts");
        const artists = await apiCall("/artists");
        const attendees = await apiCall("/attendees");

        setStats({
          concerts: Array.isArray(concerts.data)
            ? concerts.data.length
            : concerts.length || 0,
          artists: Array.isArray(artists.data)
            ? artists.data.length
            : artists.length || 0,
          venues: 0,
          attendees: Array.isArray(attendees.data)
            ? attendees.data.length
            : attendees.length || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { label: "Total Concerts", value: stats.concerts },
        { label: "Total Artists", value: stats.artists },
        { label: "Total Attendees", value: stats.attendees },
        { label: "Total Venues", value: stats.venues },
      ].map((stat, idx) => (
        <div
          key={idx}
          className={`p-6 rounded-lg bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200`}
        >
          <p className="text-sm font-medium text-gray-600">{stat.label}</p>
          <p className="text-3xl font-bold mt-2 text-indigo-700">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
};

const DataTable = ({ title, data, columns }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      {data && data.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                {columns.map((col) => (
                  <th
                    key={col}
                    className="px-4 py-2 text-gray-700 text-sm font-semibold"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.slice(0, 10).map((row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  {columns.map((col) => (
                    <td key={col} className="px-4 py-3 text-gray-700">
                      {row[col] instanceof Date
                        ? formatDate(row[col])
                        : typeof row[col] === "number" &&
                          col.includes("Revenue")
                        ? formatCurrency(row[col])
                        : row[col]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600">No data available</p>
      )}
    </div>
  );
};

const SingleDataView = ({ title, data }) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      {data ? (
        <div className="bg-gray-50 p-6 rounded-lg space-y-2 border border-gray-200">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-600 font-medium">{key}:</span>
              <span className="text-gray-900 font-semibold">
                {value instanceof Date ? formatDate(value) : value}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No data available</p>
      )}
    </div>
  );
};

// ManageTab moved to separate file: ./admin/ManageTab.jsx

export default AdminDashboardPage;
