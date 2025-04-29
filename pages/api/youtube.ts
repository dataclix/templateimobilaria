// pages/api/youtube.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { videoId } = req.query;

  if (!videoId) {
    return res.status(400).json({ error: 'Video ID is required' });
  }

  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY; // Armazene a chave da API no arquivo .env.local
    const youtubeAPIUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${YOUTUBE_API_KEY}&part=snippet,contentDetails`;

    const response = await fetch(youtubeAPIUrl);
    const data = await response.json();

    if (data.items.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const videoData = data.items[0];
    res.status(200).json({ title: videoData.snippet.title, duration: videoData.contentDetails.duration });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch video data' });
  }
}