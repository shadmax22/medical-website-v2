async function testAdminStats() {
    const baseUrl = "http://localhost:3000";

    // Login as admin
    console.log("1. Logging in as Admin...");
    const loginRes = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email_id: "admin@hcl.com",
            password: "admin123"
        })
    });

    const loginJson = await loginRes.json();
    console.log("Login Status:", loginRes.status);

    if (loginRes.status !== 200) {
        console.error("Login failed:", loginJson);
        return;
    }

    const token = loginJson.token;

    // Get Stats
    console.log("\n2. Fetching Stats...");
    const statsRes = await fetch(`${baseUrl}/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const statsJson = await statsRes.json();
    console.log("Stats Status:", statsRes.status);
    console.log("Stats Data:", statsJson);
}

testAdminStats().catch(console.error);
