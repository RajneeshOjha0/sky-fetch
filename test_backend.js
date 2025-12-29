const API_URL = 'http://localhost:3000';
const TEST_USER = {
    name: 'Test Verify',
    email: `verify_${Date.now()}@test.com`,
    password: 'password123',
    organization: 'Test Org',
    project: 'Test Project'
};

async function testBackend() {
    console.log('--- Starting Backend Verification ---');

    // 1. Health Check
    try {
        const res = await fetch(`${API_URL}/health`);
        const data = await res.json();
        console.log('1. Health Check:', res.status === 200 ? 'PASS' : 'FAIL', data);
    } catch (e) {
        console.error('1. Health Check: FAIL (Connection Error)', e.message);
        return;
    }

    let token = '';

    // 2. Register
    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        const data = await res.json();
        console.log('2. Register:', res.status === 201 ? 'PASS' : 'FAIL', res.status);
        if (data.token) {
            token = data.token;
            console.log('   Token received');
        } else {
            console.log('   No token in response:', data);
        }
    } catch (e) {
        console.error('2. Register: FAIL', e.message);
    }

    if (!token) return;

    // 3. Login (Optional if register returns token, but good to test)
    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
        });
        const data = await res.json();
        console.log('3. Login:', res.status === 200 ? 'PASS' : 'FAIL');
        // Ensure token is valid/same (ignoring rotation for now)
    } catch (e) {
        console.error('3. Login: FAIL', e.message);
    }

    // 4. Get Profile ( Protected )
    try {
        const res = await fetch(`${API_URL}/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log('4. Get Profile:', res.status === 200 ? 'PASS' : 'FAIL', data?.data?.user?.email);
    } catch (e) {
        console.error('4. Get Profile: FAIL', e.message);
    }

    // 5. Search Logs ( Protected )
    try {
        const res = await fetch(`${API_URL}/logs/search?q=test`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        console.log('5. Search Logs:', res.status === 200 ? 'PASS' : 'FAIL');
        if (res.status === 401) console.log('   Search Logs Authentication: FAIL');
    } catch (e) {
        console.error('5. Search Logs: FAIL', e.message);
    }

    console.log('--- Verification Complete ---');
}

testBackend();
