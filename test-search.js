// test-search.js
async function testSearch() {
  const query = "John" // Remplacez par un nom qui existe
  
  try {
    const response = await fetch(`http://localhost:3000/api/stagiaires/search?q=${query}`)
    const data = await response.json()
    
    console.log('Status:', response.status)
    console.log('Results:', JSON.stringify(data, null, 2))
    
  } catch (error) {
    console.error('Error:', error.message)
  }
}

testSearch()