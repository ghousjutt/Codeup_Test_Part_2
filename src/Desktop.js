import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';

function App() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://65609c5083aba11d99d12eb3.mockapi.io/api/v1/users');
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const options = {
      keys: ['first_name', 'last_name', 'vehicle'],
      threshold: 0.3,
      includeScore: true,
    };
    const fuse = new Fuse(users, options);
    const results = fuse.search(searchTerm);
    setSearchResults(results.map((result) => result.item));
  };

  return (
    <div>
      <h1>User Search</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      {isLoading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={fetchUsers}>Retry</button>
        </div>
      ) : (
        <ul>
          {searchResults.map((user) => (
            <li key={user.id}>
              {user.first_name} {user.last_name} - {user.vehicle}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;