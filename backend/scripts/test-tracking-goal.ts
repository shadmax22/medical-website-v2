async function testTrackingGoal() {
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

    console.log("1. Registering Patient...");
    const patient = await registerUser("user");
    console.log("Patient Register Status:", patient.status);
    if (patient.status !== 201) {
        console.error("Patient registration failed", patient.data);
        return;
    }
    const patientToken = patient.token;
    const patientId = patient.data.data.id;

    console.log("\n2. Registering Doctor...");
    const doctor = await registerUser("doctor");
    console.log("Doctor Register Status:", doctor.status);
    if (doctor.status !== 201) {
        console.error("Doctor registration failed", doctor.data);
        return;
    }
    const doctorToken = doctor.token;

    console.log("\n3. Testing Tracking (Patient)...");
    // Create Tracking
    const createTrackingRes = await fetch(`${baseUrl}/tracking`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${patientToken}`
        },
        body: JSON.stringify({ value: "75", tracking_type_unit: "kg" })
    });
    const createTrackingJson = await createTrackingRes.json();
    console.log("Create Tracking Status:", createTrackingRes.status);

    // List Tracking
    const listTrackingRes = await fetch(`${baseUrl}/tracking`, {
        headers: { "Authorization": `Bearer ${patientToken}` }
    });
    const listTrackingJson = await listTrackingRes.json();
    console.log("List Tracking Status:", listTrackingRes.status);
    console.log("Tracking Count:", listTrackingJson.length);

    console.log("\n4. Testing Goal (Doctor)...");
    // Create Goal
    const createGoalRes = await fetch(`${baseUrl}/doctors/goals`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${doctorToken}`
        },
        body: JSON.stringify({
            user_id: patientId,
            goal_target_value: "70",
            target_type: "weight",
            frequency: 1
        })
    });
    const createGoalJson = await createGoalRes.json();
    console.log("Create Goal Status:", createGoalRes.status);
    console.log("Goal Response:", createGoalJson);
}

testTrackingGoal().catch(console.error);
