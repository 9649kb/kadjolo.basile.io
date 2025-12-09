
import { YouTubeVideo } from '../types';

// Replace this with your Channel ID if known, or use the handle in API call
const CHANNEL_ID = 'UC_YOUR_CHANNEL_ID_HERE'; 
const API_KEY = process.env.API_KEY || ''; // Uses the same key available in env, or falls back

// FALLBACK DATA: The specific videos you requested
const FALLBACK_VIDEOS: YouTubeVideo[] = [
  {
    id: '21m45cKIcuA',
    title: 'Maîtrisez votre destin (Motivation)',
    thumbnail: 'https://img.youtube.com/vi/21m45cKIcuA/maxresdefault.jpg',
    views: '1.2k',
    publishedAt: 'Il y a 2 jours',
    url: 'https://youtu.be/21m45cKIcuA?si=f70LlESK-zHOquFr'
  },
  {
    id: 'tJp_YH70F3w',
    title: 'Stratégie Business pour 2024',
    thumbnail: 'https://img.youtube.com/vi/tJp_YH70F3w/maxresdefault.jpg',
    views: '850',
    publishedAt: 'Il y a 5 jours',
    url: 'https://youtu.be/tJp_YH70F3w?si=PsnHB9zyKUX3191A'
  },
  {
    id: 'iMj9zB16DTQ',
    title: 'Comment investir intelligemment',
    thumbnail: 'https://img.youtube.com/vi/iMj9zB16DTQ/maxresdefault.jpg',
    views: '2.1k',
    publishedAt: 'Il y a 1 semaine',
    url: 'https://youtu.be/iMj9zB16DTQ?si=f1BJ4vxqUvk6SZeK'
  },
  {
    id: 'TSMpf26Jmds',
    title: 'Les secrets du Leadership',
    thumbnail: 'https://img.youtube.com/vi/TSMpf26Jmds/maxresdefault.jpg',
    views: '3.4k',
    publishedAt: 'Il y a 2 semaines',
    url: 'https://youtu.be/TSMpf26Jmds?si=OY1EXe14zVxt71mb'
  },
  {
    id: 'CP83s4yNPh4',
    title: 'Développez votre marque personnelle',
    thumbnail: 'https://img.youtube.com/vi/CP83s4yNPh4/maxresdefault.jpg',
    views: '5k',
    publishedAt: 'Il y a 3 semaines',
    url: 'https://youtu.be/CP83s4yNPh4?si=gmb1jHIp6OS9Bg2N'
  }
];

export const fetchLatestVideos = async (): Promise<YouTubeVideo[]> => {
  // In a real production environment with a valid YouTube Data API Key, 
  // this code would automatically fetch the latest videos.
  
  if (!API_KEY || API_KEY === 'DEMO_KEY') {
    // console.log("Using Fallback YouTube Data (No API Key)");
    return FALLBACK_VIDEOS;
  }

  try {
    // Attempt to fetch from YouTube API
    // Note: This requires the API Key to have YouTube Data API v3 enabled.
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=10&type=video`
    );

    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();

    if (!data.items) return FALLBACK_VIDEOS;

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url,
      publishedAt: new Date(item.snippet.publishedAt).toLocaleDateString(),
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      views: 'N/A' // Search API doesn't return views, would need a second call, keeping N/A for live fetch or mock for fallback
    }));

  } catch (error) {
    console.error("Error fetching YouTube videos, using fallback:", error);
    return FALLBACK_VIDEOS;
  }
};
