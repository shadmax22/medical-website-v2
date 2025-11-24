async function testDashboardApis() {
    const baseUrl = "http://localhost:3000";

    // 1. Test Admin Dashboard API
    console.log("\n--- Testing Admin Dashboard API ---");
    const adminLogin = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email_id: "admin@hcl.com", password: "admin123" })
    });
    const adminToken = (await adminLogin.json()).token;

    const adminRes = await fetch(`${baseUrl}/admin/dashboard-data`, {
        headers: { "Authorization": `Bearer ${adminToken}` }
    });
    console.log("Admin Dashboard Status:", adminRes.status);
    const adminData = await adminRes.json();
    if (adminRes.status === 200) {
        console.log("Admin Data Keys:", Object.keys(adminData));
        console.log("Stats:", adminData.stats);
        console.log("Doctors Count:", adminData.doctors.length);
        console.log("Patients Count:", adminData.patients.length);
    } else {
        console.error("Admin API Failed:", adminData);
    }

    // 2. Test Doctor Dashboard API
    console.log("\n--- Testing Doctor Dashboard API ---");
    const docEmail = `doc_dash_${Date.now()}@test.com`;
    const docReg = await fetch(`${baseUrl}/doctors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Dr. Dashboard",
            email_id: docEmail,
            password: "password123",
            specialization: "General",
            medical_license: "LIC-12345", // Added missing field
            education: "MBBS", // Added missing field (might be required too)
            experience_years: 5, // Corrected field name
            phone_no: "1234567890", // Corrected field name
            dob: "1980-01-01" // Added missing field
        })
    });
    const docRegJson = await docReg.json();
    console.log("Doctor Registration Status:", docReg.status);
    if (docReg.status !== 201) {
        console.error("Doctor Registration Failed:", docRegJson);
        return;
    }
    const docToken = docRegJson.token;

    const docRes = await fetch(`${baseUrl}/doctors/dashboard-data`, {
        headers: { "Authorization": `Bearer ${docToken}` }
    });
    console.log("Doctor Dashboard Status:", docRes.status);
    const docData = await docRes.json();
    if (docRes.status === 200) {
        console.log("Doctor Data Keys:", Object.keys(docData));
        console.log("Stats:", docData.stats);
    } else {
        console.error("Doctor API Failed:", docData);
    }

    // 3. Test Patient Dashboard API
    console.log("\n--- Testing Patient Dashboard API ---");
    const patEmail = `pat_dash_${Date.now()}@test.com`;
    const patReg = await fetch(`${baseUrl}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: "Patient Dashboard",
            email_id: patEmail,
            password: "password123",
            dob: "1990-01-01",
            phone_no: "0987654321", // Corrected field name
            gender: "Male"
        })
    });
    const patRegJson = await patReg.json();
    console.log("Patient Registration Status:", patReg.status);
    if (patReg.status !== 201) {
        console.error("Patient Registration Failed:", patRegJson);
        return;
    }
    const patToken = patRegJson.token;

    const patRes = await fetch(`${baseUrl}/patient/dashboard-data`, {
        headers: { "Authorization": `Bearer ${patToken}` }
    });
    console.log("Patient Dashboard Status:", patRes.status);
    const patData = await patRes.json();
    if (patRes.status === 200) {
        console.log("Patient Data Keys:", Object.keys(patData));
        console.log("Stats:", patData.stats);
    } else {
        console.error("Patient API Failed:", patData);
    }
}

testDashboardApis().catch(console.error);
