async function testAssignment() {
    const baseUrl = "http://localhost:3000";

    // Helper to register user
    async function registerUser(role: string) {
        const timestamp = Date.now();
        const userData = {
            name: `${role} User`,
            email_id: `${role.toLowerCase()}.${timestamp}@example.com`,
            phone_no: "1234567890",
            dob: "1990-01-01",
            password: "password123",
            role: role
        };

        let url = `${baseUrl}/signup`;
        let body: any = userData;

        if (role === "doctor") {
            url = `${baseUrl}/doctors/register`;
            body = {
                ...userData,
                specialization: "General",
                medical_license: "LIC" + timestamp,
                education: "MD",
                experience_years: 5,
                bio: "Bio",
                portfolio_url: "http://example.com"
            };
        }

        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const json = await res.json();
        return { status: res.status, data: json, token: json.token };
    }

    console.log("1. Registering Patient 1...");
    const patient1 = await registerUser("user");
    const patient1Id = patient1.data.data.id;

    console.log("2. Registering Patient 2...");
    const patient2 = await registerUser("user");
    const patient2Id = patient2.data.data.id;

    console.log("3. Registering Doctor 1...");
    const doctor1 = await registerUser("doctor");
    const doctor1Token = doctor1.token;

    console.log("4. Registering Doctor 2...");
    const doctor2 = await registerUser("doctor");
    const doctor2Token = doctor2.token;

    console.log("\n5. Assigning Patient 1 to Doctor 1...");
    const assign1 = await fetch(`${baseUrl}/doctors/assign-patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${doctor1Token}`
        },
        body: JSON.stringify({ patient_id: patient1Id })
    });
    console.log("Assign 1 Status:", assign1.status);

    console.log("6. Assigning Patient 1 to Doctor 2 (M:N check)...");
    const assign2 = await fetch(`${baseUrl}/doctors/assign-patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${doctor2Token}`
        },
        body: JSON.stringify({ patient_id: patient1Id })
    });
    console.log("Assign 2 Status:", assign2.status);

    console.log("7. Assigning Patient 2 to Doctor 1 (M:N check)...");
    const assign3 = await fetch(`${baseUrl}/doctors/assign-patient`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${doctor1Token}`
        },
        body: JSON.stringify({ patient_id: patient2Id })
    });
    console.log("Assign 3 Status:", assign3.status);
}

testAssignment().catch(console.error);
