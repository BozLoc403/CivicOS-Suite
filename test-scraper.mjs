import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

// Test real Canadian government data sources
async function testRealDataSources() {
  console.log("Testing real Canadian government data sources...");
  
  try {
    // Test Parliament of Canada members directory
    console.log("\n1. Testing Parliament members directory...");
    const membersResponse = await fetch("https://www.ourcommons.ca/Members/en/search");
    
    if (membersResponse.ok) {
      const html = await membersResponse.text();
      const $ = cheerio.load(html);
      
      // Look for MP data in various potential structures
      let memberCount = 0;
      const members = [];
      
      // Try different selectors for MP data
      $('.mp-card, .member-card, .member-item, tr').each((_, element) => {
        const $element = $(element);
        const text = $element.text();
        
        // Look for party names to identify MP rows
        if (text.includes('Liberal') || text.includes('Conservative') || text.includes('NDP') || text.includes('Bloc')) {
          memberCount++;
          
          // Extract name and party if possible
          const name = $element.find('a, .name, .member-name').first().text().trim();
          const party = text.match(/(Liberal|Conservative|NDP|Bloc|Green)/)?.[0] || '';
          
          if (name && party) {
            members.push({ name, party });
          }
        }
      });
      
      console.log(`✓ Found ${memberCount} potential MP entries`);
      if (members.length > 0) {
        console.log(`Sample: ${members[0].name} (${members[0].party})`);
      }
    } else {
      console.log(`✗ Members directory failed: ${membersResponse.status}`);
    }
    
    // Test Parliament bills page
    console.log("\n2. Testing Parliament LEGISinfo bills...");
    const billsResponse = await fetch("https://www.parl.ca/LegisInfo/en/bills");
    
    if (billsResponse.ok) {
      const html = await billsResponse.text();
      const $ = cheerio.load(html);
      
      let billCount = 0;
      const bills = [];
      
      // Look for bill numbers (C-##, S-##)
      $('*').each((_, element) => {
        const text = $(element).text();
        const billMatch = text.match(/([CS]-\d+)/g);
        
        if (billMatch) {
          billMatch.forEach(billNumber => {
            if (!bills.find(b => b.number === billNumber)) {
              billCount++;
              bills.push({
                number: billNumber,
                title: text.substring(text.indexOf(billNumber) + billNumber.length, text.indexOf(billNumber) + billNumber.length + 100).trim()
              });
            }
          });
        }
      });
      
      console.log(`✓ Found ${billCount} bill references`);
      if (bills.length > 0) {
        console.log(`Sample: ${bills[0].number} - ${bills[0].title.substring(0, 50)}...`);
      }
    } else {
      console.log(`✗ Bills page failed: ${billsResponse.status}`);
    }
    
    // Test Parliament RSS feed and parse content
    console.log("\n3. Testing Parliament RSS feed...");
    const rssResponse = await fetch("https://www.parl.ca/LegisInfo/en/rss/bills-government");
    
    if (rssResponse.ok) {
      const rssText = await rssResponse.text();
      
      // Basic RSS parsing
      const titleMatches = rssText.match(/<title>(.*?)<\/title>/g) || [];
      const linkMatches = rssText.match(/<link>(.*?)<\/link>/g) || [];
      
      console.log(`✓ Parliament RSS feed accessible with ${titleMatches.length} items`);
      
      if (titleMatches.length > 1) {
        const sampleTitle = titleMatches[1].replace(/<\/?title>/g, '');
        console.log(`Sample RSS item: ${sampleTitle}`);
      }
    } else {
      console.log(`✗ RSS feed failed: ${rssResponse.status}`);
    }
    
    // Test House of Commons voting records
    console.log("\n4. Testing House voting records...");
    const votesResponse = await fetch("https://www.ourcommons.ca/Members/en/votes");
    
    if (votesResponse.ok) {
      console.log("✓ House voting records accessible");
    } else {
      console.log(`✗ Voting records failed: ${votesResponse.status}`);
    }
    
  } catch (error) {
    console.error("Error testing data sources:", error);
  }
}

testRealDataSources();