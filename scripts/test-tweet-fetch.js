const https = require('https');
const cheerio = require('cheerio');

function fetch(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ data, status: res.statusCode }));
    }).on('error', reject);
  });
}

async function test() {
  // Get submissions to get tweetId
  const campaignAddress = '0xAF5a5B459F4371c1781E3B8456214CDD063EeBA7';
  const submissionsUrl = 'https://app.rally.fun/api/submissions?campaignAddress=' + campaignAddress + '&limit=5';
  
  console.log('1. Fetching submissions...');
  const submissionsResult = await fetch(submissionsUrl);
  const submissions = JSON.parse(submissionsResult.data);
  
  // Get first submission tweet
  const first = submissions[0];
  const tweetId = first.tweetId;
  const username = first.xUsername;
  
  console.log('Tweet ID:', tweetId);
  console.log('Username:', username);
  console.log('');
  
  // Try to fetch tweet
  const tweetUrl = 'https://x.com/' + username + '/status/' + tweetId;
  console.log('2. Fetching tweet:', tweetUrl);
  
  const tweetResult = await fetch(tweetUrl);
  console.log('Status:', tweetResult.status);
  console.log('Content length:', tweetResult.data.length);
  
  // Try to extract tweet text
  const $ = cheerio.load(tweetResult.data);
  
  // X uses various meta tags
  const ogTitle = $('meta[property="og:title"]').attr('content');
  const ogDesc = $('meta[property="og:description"]').attr('content');
  const twitterTitle = $('meta[name="twitter:title"]').attr('content');
  const twitterDesc = $('meta[name="twitter:description"]').attr('content');
  
  console.log('');
  console.log('Meta extraction:');
  console.log('og:title:', ogTitle);
  console.log('og:description:', ogDesc);
  console.log('twitter:title:', twitterTitle);
  console.log('twitter:description:', twitterDesc);
}

test().catch(console.error);
