import ZAI from 'z-ai-web-dev-sdk';

async function main() {
  const zai = await ZAI.create();
  
  const queries = [
    "Internet Court blockchain crypto disputes resolution 2024 2025",
    "Internet Court tokenomics token utility",
    "blockchain dispute resolution comparison Kleros Aragon",
    "Internet Court crypto statistics metrics TVL users"
  ];
  
  const results: Record<string, any> = {};
  
  for (let i = 0; i < queries.length; i++) {
    console.log(`\n=== SEARCH ${i + 1}: ${queries[i]} ===\n`);
    try {
      const searchResults = await zai.functions.invoke('web_search', {
        query: queries[i],
        num: 10
      });
      
      results[`search_${i + 1}`] = searchResults;
      
      searchResults.slice(0, 5).forEach((r: any, idx: number) => {
        console.log(`${idx + 1}. ${r.name}`);
        console.log(`   URL: ${r.url}`);
        console.log(`   Snippet: ${r.snippet?.substring(0, 200)}...`);
        console.log('');
      });
    } catch (e: any) {
      console.error(`Search ${i + 1} failed:`, e.message);
    }
  }
  
  // Save to file
  const fs = await import('fs');
  fs.writeFileSync('/home/z/my-project/download/v86_research.json', JSON.stringify(results, null, 2));
  console.log('\nResults saved to /home/z/my-project/download/v86_research.json');
}

main().catch(console.error);
