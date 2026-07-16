const KEY = import.meta.env.VITE_LASTFM_KEY;
const BASE = "https://ws.audioscrobbler.com/2.0/";

export async function getTracksByTag(tag, limit = 8) {
  try {
    console.log("Last.fm key:", KEY);
    console.log("Requested tag:", tag);

    const url = `${BASE}?method=tag.gettoptracks&tag=${encodeURIComponent(tag)}&api_key=${KEY}&format=json&limit=${limit}`;

    console.log("Last.fm URL:", url);

    const res = await fetch(url);
    const data = await res.json();

    console.log("Last.fm response:", data);

    return data.tracks?.track?.map(t => ({
      title: t.name,
      artist: t.artist.name,
      url: t.url,
      image: t.image?.[2]?.["#text"] || null
    })) || [];
  } catch (error) {
    console.error("Last.fm error:", error);
    return [];
  }
}


