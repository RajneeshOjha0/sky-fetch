const baseUrl = 'http://localhost:3000/logs/search';

const queries = [
    { name: 'All Logs (Default Limit)', params: '' },
    { name: 'Search "Verification"', params: '?q=Verification' },
    { name: 'Level "info"', params: '?level=info' },
    { name: 'Source "terminal"', params: '?source=terminal' },
    { name: 'Combined Filter', params: '?level=info&source=terminal' },
    { name: 'Date Range (Last 24h)', params: `?startDate=${new Date(Date.now() - 86400000).toISOString()}&endDate=${new Date().toISOString()}` },
    { name: 'Pagination (Page 1, Limit 2)', params: '?page=1&limit=2' }
];

async function runQueries() {
    console.log('Running Search Queries against SkyFetch API...\n');

    for (const query of queries) {
        const url = `${baseUrl}${query.params}`;
        console.log(`--- ${query.name} ---`);
        console.log(`URL: ${url}`);
        try {
            const res = await fetch(url);
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            if (data.data) {
                console.log(`Found: ${data.data.length} logs`);
                if (data.data.length > 0) {
                    console.log(`Sample: ${data.data[0].message}`);
                }
            } else {
                console.log('Response:', data);
            }
        } catch (err) {
            console.error('Error:', err.message);
        }
        console.log('');
    }
}

runQueries();
