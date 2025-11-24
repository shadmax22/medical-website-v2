async function testDoctorFlow() {
    const baseUrl = "http://localhost:3000";
    const doctorData = {
        name: "Dr. Test",
        email_id: `dr.test.${Date.now()}@example.com`,
        phone_no: "1234567890",
        dob: "1980-01-01",
        password: "password123",
        specialization: "Cardiology",
        medical_license: "LIC123456",
        education: "MBBS, MD",
        experience_years: 10,
        bio: "Experienced cardiologist",
        portfolio_url: "http://example.com"
    };

    console.log("1. Registering Doctor...");
    const registerRes = await fetch(`${baseUrl}/doctors/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(doctorData)
    });
    const registerJson = await registerRes.json();
    console.log("Register Status:", registerRes.status);
    console.log("Register Response:", JSON.stringify(registerJson, null, 2));

    if (registerRes.status !== 201) {
        console.error("Registration failed");
        return;
    }

    const doctorId = registerJson.data.doctor.id;
    console.log("Doctor ID:", doctorId);

    console.log("\n2. Listing Doctors...");
    const listRes = await fetch(`${baseUrl}/doctors`);
    const listJson = await listRes.json();
    console.log("List Status:", listRes.status);
    console.log("Number of doctors:", listJson.length);

    console.log("\n3. Getting Doctor Details...");
    const getRes = await fetch(`${baseUrl}/doctors/${doctorId}`);
    const getJson = await getRes.json();
    console.log("Get Status:", getRes.status);
    console.log("Doctor Name:", getJson.user.name);

    console.log("\n4. Updating Doctor...");
    const updateRes = await fetch(`${baseUrl}/doctors/${doctorId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: "Updated bio" })
    });
    const updateJson = await updateRes.json();
    console.log("Update Status:", updateRes.status);
    console.log("Updated Bio:", updateJson.doctor.bio);

    console.log("\n5. Deleting Doctor...");
    const deleteRes = await fetch(`${baseUrl}/doctors/${doctorId}`, {
        method: "DELETE"
    });
    const deleteJson = await deleteRes.json();
    console.log("Delete Status:", deleteRes.status);
    console.log("Delete Response:", deleteJson);
}

testDoctorFlow().catch(console.error);
