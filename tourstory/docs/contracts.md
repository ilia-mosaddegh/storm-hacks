# Screen/Data Contracts (Front-end)

## Result payload (what Result screen needs)
- landmarkId: string
- title: string
- location: string
- summary: string
- story: string
- imageUrl: string (https or file:// uri)
- durationSec: number
- language: string (e.g., "en")

Example:
{
  "landmarkId": "gastown_steam_clock",
  "title": "Gastown Steam Clock",
  "location": "Vancouver, BC",
  "summary": "Built in 1977 by Raymond Saunders...",
  "story": "In the heart of Gastown...",
  "imageUrl": "https://example.com/steamclock.jpg",
  "durationSec": 75,
  "language": "en"
}

## NowPlaying state (what the player needs)
- title: string
- audioUrl: string
- durationSec: number
- positionSec: number
- isPlaying: boolean

Example:
{
  "title": "Gastown Steam Clock",
  "audioUrl": "https://example.com/story.mp3",
  "durationSec": 75,
  "positionSec": 0,
  "isPlaying": false
}

## Playlist item
- id: string
- title: string
- artist: string
- previewUrl: string
- externalUrl: string

Example:
{
  "id": "t1",
  "title": "Clockwork Alley",
  "artist": "The Brass",
  "previewUrl": "https://example.com/t1-preview.mp3",
  "externalUrl": "https://spotify.example/track/t1"
}
