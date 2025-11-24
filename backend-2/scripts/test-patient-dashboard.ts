async function testPatientDashboard() {
    const baseUrl = "http://localhost:3000";

    console.log("\n--- Testing Patient Dashboard API ---");

    // Register a new patient
    const patEmail = `patient_test_${Date.now()}@test.com`;
    const patReg = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Test Patient",
            email_id: patEmail,
            password: "password123",
            dob: "1990-01-01",
            phone_no: "9876543210",
            role: "user"
        })
    });

    const patRegJson = await patReg.json();
    console.log("Patient Registration Status:", patReg.status);

    if (patReg.status !== 201) {
        console.error("Patient Registration Failed:", patRegJson);
        return;
    }

    const patToken = patRegJson.token;
    console.log("Patient Token:", patToken ? "Present" : "Missing");

    // Fetch patient dashboard data
    const dashboardRes = await fetch(`${baseUrl}/patient/dashboard-data`, {
        headers: { "Authorization": `Bearer ${patToken}` }
    });

    console.log("Patient Dashboard Status:", dashboardRes.status);
    const dashboardData = await dashboardRes.json();

    if (dashboardRes.status === 200) {
        console.log("\n✅ Dashboard Data Retrieved Successfully!");
        console.log("\nPatient Info:", dashboardData.patient);
        console.log("\nStats:", dashboardData.stats);
        console.log("\nUpcoming Appointments:", dashboardData.upcoming_appointments.length);
        console.log("\nDoctor Responses:", dashboardData.doctor_responses.length);
        console.log("\nGoals from Doctors:", dashboardData.goals_from_doctors.length);
    } else {
        console.error("❌ Patient Dashboard API Failed:", dashboardData);
    }
}

testPatientDashboard().catch(console.error);
