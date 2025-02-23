import type { LaunchesResponse } from '@/types/launches';

// Use the free tier endpoint which has a higher rate limit
const API_URL = 'https://lldev.thespacedevs.com/2.2.0';

export async function getUpcomingLaunches(page: number = 1, limit: number = 25, month?: string): Promise<LaunchesResponse> {
  let url = `${API_URL}/launch/upcoming/?limit=${limit}&offset=${(page - 1) * limit}&ordering=net&mode=detailed`;

  // Add month filter if provided
  if (month) {
    const [year, monthNum] = month.split('-');
    // Create start and end dates for the selected month
    const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1).toISOString();
    const endDate = new Date(parseInt(year), parseInt(monthNum), 0, 23, 59, 59).toISOString();
    url += `&net__gte=${startDate}&net__lte=${endDate}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch launches');
    }

    const data = await response.json();

    // Log raw API response for debugging
    console.log('Raw API response for first launch:', {
      name: data.results[0]?.name,
      vidURLs: data.results[0]?.vidURLs,
      video_url: data.results[0]?.video_url,
      webcast_live: data.results[0]?.webcast_live,
    });

    // Transform video URLs if they exist
    const transformedResults = data.results.map((launch: {
      name: string;
      vidURLs?: string[];
      video_url?: string | null;
    }) => {
      let youtube_id = null;
      let twitter_id = null;

      // Check for video_url field
      if (launch.video_url) {
        const url = launch.video_url;
        console.log('Processing video_url:', url);

        if (url.includes('youtube.com') || url.includes('youtu.be')) {
          youtube_id = url.includes('watch?v=')
            ? url.split('watch?v=')[1]?.split('&')[0]
            : url.split('youtu.be/')[1]?.split('?')[0];
        } else if (url.includes('twitter.com')) {
          twitter_id = url.split('/status/')[1]?.split('?')[0];
        }
      }

      // Check for vidURLs array
      if (!youtube_id && !twitter_id && launch.vidURLs && Array.isArray(launch.vidURLs)) {
        console.log('Processing vidURLs array:', launch.vidURLs);

        for (const url of launch.vidURLs) {
          if (typeof url === 'string') {
            if (url.includes('youtube.com') || url.includes('youtu.be')) {
              youtube_id = url.includes('watch?v=')
                ? url.split('watch?v=')[1]?.split('&')[0]
                : url.split('youtu.be/')[1]?.split('?')[0];
            } else if (url.includes('twitter.com')) {
              twitter_id = url.split('/status/')[1]?.split('?')[0];
            }
          }
        }
      }

      console.log('Extracted video IDs:', {
        name: launch.name,
        youtube_id,
        twitter_id
      });

      return {
        ...launch,
        vidURLs: {
          youtube_id,
          twitter_id
        }
      };
    });

    return {
      ...data,
      results: transformedResults
    };
  } catch (error) {
    console.error('Error fetching launches:', error);
    throw error;
  }
}