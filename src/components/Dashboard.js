import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

const Dashboard = ({ token }) => {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [topGenres, setTopGenres] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [showAllTracks, setShowAllTracks] = useState(false);
  const [showAllAlbums, setShowAllAlbums] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData } = await axios.get(
          "https://api.spotify.com/v1/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data", error);
        setError("Failed to fetch user data");
      }
    };

    const fetchTopItems = async () => {
      try {
        // Fetch top artists
        const { data: topArtistsData } = await axios.get(
          "https://api.spotify.com/v1/me/top/artists",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopArtists(topArtistsData.items.slice(0, 5)); // Limit top artists to 5

        // Fetch top tracks
        const { data: topTracksData } = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks?limit=10",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTopTracks(topTracksData.items.slice(0, 5)); // Limit top tracks to 5 initially

        // Fetch genres for top artists
        const genresData = await Promise.all(
          topArtistsData.items.map(async (artist) => {
            const { data: artistData } = await axios.get(
              `https://api.spotify.com/v1/artists/${artist.id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            return artistData.genres;
          })
        );

        // Flatten and get unique genres
        const genres = genresData
          .flat()
          .reduce((acc, genre) => {
            if (!acc.includes(genre)) {
              acc.push(genre);
            }
            return acc;
          }, [])
          .slice(0, 5); // Limit to 5 genres

        setTopGenres(genres);
      } catch (error) {
        console.error("Error fetching top items", error);
        setError("Failed to fetch top items");
      }
    };

    fetchUserData();
    fetchTopItems();
  }, [token]);

  const handleShowMoreTracks = () => {
    setShowAllTracks(!showAllTracks);
  };

  const handleShowMoreAlbums = () => {
    setShowAllAlbums(!showAllAlbums);
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    setCurrentTrack(null);
    setIsPlaying(false);
  };

  const renderPlayPauseButton = (track) => {
    if (isPlaying && currentTrack && currentTrack.id === track.id) {
      return (
        <button className="play-button" onClick={pauseTrack}>
          Pause
        </button>
      );
    } else {
      return (
        <button className="play-button" onClick={() => playTrack(track)}>
          Play
        </button>
      );
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dashboard">
      <header className="header">
        <h1>
          {user
            ? `${user.display_name}'s Spotify Music History`
            : "Spotify Music History"}
        </h1>
      </header>
      <div className="content">
        <aside className="sidebar">
          <h2>Top Artists</h2>
          <ul>
            {topArtists.map((artist) => (
              <li key={artist.id}>
                <a
                  href={artist.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="artist-link"
                >
                  <img
                    src={artist.images[0]?.url}
                    alt={artist.name}
                    style={{ width: 100, height: 100, borderRadius: 5 }}
                  />
                </a>
                <div>
                  <span className="artist-name">{artist.name}</span>
                  <br />
                  <span className="artist-info">
                    Monthly Listeners: {artist.followers.total}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <h2>Top Genres</h2>
          <ul>
            {topGenres.map((genre, index) => (
              <li key={index}>{genre}</li>
            ))}
          </ul>
        </aside>
        <div className="main-content">
          <div className="albums-songs">
            <div className="albums">
              <h2>Top Albums</h2>
              <ul>
                {topTracks.map((track, index) => (
                  <li key={track.album.id}>
                    <a
                      href={track.album.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={track.album.images[0]?.url}
                        alt={track.album.name}
                        style={{ width: 50, height: 50, borderRadius: 5 }}
                      />
                      <span className="album-name">{track.album.name}</span>
                    </a>
                  </li>
                ))}
                {!showAllAlbums && topTracks.length > 5 && (
                  <li>
                    <button
                      onClick={handleShowMoreAlbums}
                      className="show-more-button"
                    >
                      Show More
                    </button>
                  </li>
                )}
              </ul>
            </div>
            <div className="songs">
              <h2>Top Tracks</h2>
              <ul>
                {topTracks.map((track, index) => (
                  <li key={track.id}>
                    <a
                      href={track.external_urls.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={track.album.images[0]?.url}
                        alt={track.name}
                        style={{ width: 50, height: 50, borderRadius: 5 }}
                      />
                      <span className="track-name">{track.name}</span>
                      <span className="track-artist">
                        {" "}
                        by {track.artists[0].name}
                      </span>
                      {renderPlayPauseButton(track)}
                    </a>
                  </li>
                ))}
                {!showAllTracks && topTracks.length > 5 && (
                  <li>
                    <button
                      onClick={handleShowMoreTracks}
                      className="show-more-button"
                    >
                      Show More
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
