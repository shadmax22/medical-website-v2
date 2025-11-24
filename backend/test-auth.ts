// Using global fetch

// Actually, let's use global fetch, assuming Node 18+

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
    const email = `test${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Testing with email: ${email}`);

    // 1. Signup
    console.log('\n1. Testing Signup...');
    const signupRes = await fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: 'Test User',
            email_id: email,
            phone_no: '1234567890',
            dob: '1990-01-01',
            password: password,
            role: 'user'
        })
    });
    const signupData = await signupRes.json();
    console.log('Signup Status:', signupRes.status);
    console.log('Signup Response:', signupData);

    if (signupRes.status !== 201) {
        console.error('Signup failed!');
        return;
    }

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email_id: email,
            password: password
        })
    });
    const loginData = await loginRes.json() as any;
    console.log('Login Status:', loginRes.status);
    console.log('Login Response:', loginData);

    if (loginRes.status !== 200 || !loginData.token) {
        console.error('Login failed!');
        return;
    }

    const token = loginData.token;

    // 3. Private Route (With Token)
    console.log('\n3. Testing Private Route (With Token)...');
    const privateRes = await fetch(`${BASE_URL}/private`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const privateData = await privateRes.json();
    console.log('Private Route Status:', privateRes.status);
    console.log('Private Route Response:', privateData);

    if (privateRes.status !== 200) {
        console.error('Private route access failed!');
    }

    // 4. Private Route (Without Token)
    console.log('\n4. Testing Private Route (Without Token)...');
    const noTokenRes = await fetch(`${BASE_URL}/private`);
    console.log('Private Route (No Token) Status:', noTokenRes.status);

    if (noTokenRes.status === 401) {
        console.log('Success: Access denied as expected.');
    } else {
        console.error('Failure: Should have been 401');
    }
}

testAuth().catch(console.error);
