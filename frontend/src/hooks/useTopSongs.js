import { useEffect, useState } from 'react';
import { API_URL } from '../config';

export default function useTopSongs() {
  const [topSongs, setTopSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopSongs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/stats/home`);
        if (!response.ok) throw new Error('stats unavailable');
        const data = await response.json();
        setTopSongs(data.topSongs || []);
      } catch (err) {
        console.warn('Erreur chargement stats :', err.message);
        setTopSongs([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopSongs();
  }, []);

  return { topSongs, loading };
}
