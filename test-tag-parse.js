const testCases = [
  '["team","fun","teambuilding"]',  // Valid JSON array
  'team, training, development',     // Plain string
  '[]',                              // Empty array
  null,                              // Null
  '',                                // Empty string
];

function parseTags(tags) {
  if (!tags) return [];
  
  try {
    // Probeer te parsen als JSON
    const parsed = JSON.parse(tags);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    // Als het geen JSON is, split de string op komma's
    if (typeof tags === 'string') {
      return tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }
    return [];
  }
}

testCases.forEach((tc, i) => {
  console.log(`Test ${i+1}: "${tc}" -> ${JSON.stringify(parseTags(tc))}`);
});
