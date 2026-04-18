// src/services/api.js
import axios from 'axios';

const API_KEY = import.meta.env.VITE_JOTFORM_API_KEY || 'ad39735f1449a6dc28d60e0921352665';
const BASE_URL = 'https://api.jotform.com/form';

const ENDPOINTS = {
  checkins: '261065067494966',
  messages: '261065765723966',
  sightings: '261065244786967',
  notes: '261065509008958',
  tips: '261065875889981'
};

export const fetchAllData = async () => {
  const requests = Object.entries(ENDPOINTS).map(([key, id]) =>
    axios.get(`${BASE_URL}/${id}/submissions?apiKey=${API_KEY}`)
      .then(res => ({ type: key, data: res.data.content }))
  );

  const results = await Promise.all(requests);

  // Convert the array of results into a single object separated by type
  return results.reduce((acc, { type, data }) => ({ ...acc, [type]: data }), {});
};