// src/context/DataContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { fetchAllData } from '../services/api';
import { normalizeEvents } from '../utils/normalizer';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const rawData = await fetchAllData();
        const processedEvents = normalizeEvents(rawData);
        setEvents(processedEvents);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Could not load case files.");
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <DataContext.Provider value={{ events, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

