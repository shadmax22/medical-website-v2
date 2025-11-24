import { PrismaClient, Doctor, User, Goal } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

const chartTemplates = [
  {
    title: "Daily Steps",
    unit: "steps",
    values: [3500, 4200, 6100, 9000, 7600, 10500, 12000],
  },
  {
    title: "Heartbeat",
    unit: "bpm",
    values: [72, 76, 73, 70, 74, 72, 71],
  },
];

async function main() {
  const password = await bcrypt.hash("Password123!", 10);

  await prisma.$transaction([
    prisma.tracking.deleteMany(),
    prisma.goalTracking.deleteMany(),
    prisma.goal.deleteMany(),
    prisma.appointment.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.prescription.deleteMany(),
  ]);

  const admin = await prisma.user.upsert({
    where: { email_id: "admin@hcl.com" },
    update: {},
    create: {
      name: "Admin User",
      email_id: "admin@hcl.com",
      phone_no: "0000000000",
      dob: new Date("1990-01-01"),
      password,
      stat: "active",
      role: "admin",
    },
  });

  const doctorSeedData = [
    {
      name: "Dr. Alice Morton",
      email: "alice.morton@hcl.com",
      phone: "1111111111",
      dob: "1975-02-10",
      specialization: "Cardiology",
      medical_license: "LIC-1001",
      education: "MD Cardiology, Johns Hopkins",
      experience_years: 15,
      bio: "Focused on preventive cardiology.",
      portfolio_url: "https://example.com/dr-alice",
    },
    {
      name: "Dr. Brian Singh",
      email: "brian.singh@hcl.com",
      phone: "2222222222",
      dob: "1978-07-14",
      specialization: "Endocrinology",
      medical_license: "LIC-1002",
      education: "MD Endocrinology, AIIMS",
      experience_years: 13,
      bio: "Guides patients through chronic care plans.",
      portfolio_url: "https://example.com/dr-brian",
    },
    {
      name: "Dr. Clara Hughes",
      email: "clara.hughes@hcl.com",
      phone: "3333333333",
      dob: "1980-11-22",
      specialization: "Neurology",
      medical_license: "LIC-1003",
      education: "MD Neurology, Stanford",
      experience_years: 12,
      bio: "Works on lifestyle interventions for migraines.",
      portfolio_url: "https://example.com/dr-clara",
    },
    {
      name: "Dr. Daniel Ortiz",
      email: "daniel.ortiz@hcl.com",
      phone: "4444444444",
      dob: "1976-05-05",
      specialization: "Orthopedics",
      medical_license: "LIC-1004",
      education: "MS Ortho, Mayo Clinic",
      experience_years: 16,
      bio: "Helps patients recover mobility faster.",
      portfolio_url: "https://example.com/dr-daniel",
    },
    {
      name: "Dr. Evelyn Brooks",
      email: "evelyn.brooks@hcl.com",
      phone: "5555555555",
      dob: "1981-09-18",
      specialization: "Dermatology",
      medical_license: "LIC-1005",
      education: "MD Dermatology, UCLA",
      experience_years: 10,
      bio: "Special interest in autoimmune skin disorders.",
      portfolio_url: "https://example.com/dr-evelyn",
    },
    {
      name: "Dr. Farhan Ahmed",
      email: "farhan.ahmed@hcl.com",
      phone: "6666666666",
      dob: "1979-12-03",
      specialization: "Pulmonology",
      medical_license: "LIC-1006",
      education: "MD Pulmonology, Imperial College",
      experience_years: 14,
      bio: "Supports patients with long-term breathing issues.",
      portfolio_url: "https://example.com/dr-farhan",
    },
    {
      name: "Dr. Grace Nolan",
      email: "grace.nolan@hcl.com",
      phone: "7777777777",
      dob: "1982-10-12",
      specialization: "Psychiatry",
      medical_license: "LIC-1007",
      education: "MD Psychiatry, Columbia",
      experience_years: 11,
      bio: "Focus on holistic mental wellness.",
      portfolio_url: "https://example.com/dr-grace",
    },
    {
      name: "Dr. Henry Zhao",
      email: "henry.zhao@hcl.com",
      phone: "8888888888",
      dob: "1974-08-06",
      specialization: "Gastroenterology",
      medical_license: "LIC-1008",
      education: "MD Gastroenterology, Peking Univ.",
      experience_years: 17,
      bio: "Helps patients manage complex gut disorders.",
      portfolio_url: "https://example.com/dr-henry",
    },
    {
      name: "Dr. Irene Costa",
      email: "irene.costa@hcl.com",
      phone: "9999999999",
      dob: "1983-03-25",
      specialization: "Ophthalmology",
      medical_license: "LIC-1009",
      education: "MD Ophthalmology, Harvard",
      experience_years: 9,
      bio: "Expert in diabetic retinopathy monitoring.",
      portfolio_url: "https://example.com/dr-irene",
    },
    {
      name: "Dr. Jacob Rivera",
      email: "jacob.rivera@hcl.com",
      phone: "1010101010",
      dob: "1977-01-30",
      specialization: "Nephrology",
      medical_license: "LIC-1010",
      education: "MD Nephrology, Baylor",
      experience_years: 15,
      bio: "Designs kidney-care plans around lifestyle.",
      portfolio_url: "https://example.com/dr-jacob",
    },
  ];

  const doctorProfiles: Doctor[] = [];

  for (const doctor of doctorSeedData) {
    const createdDoctor = await prisma.user.upsert({
      where: { email_id: doctor.email },
      update: {},
      create: {
        name: doctor.name,
        email_id: doctor.email,
        phone_no: doctor.phone,
        dob: new Date(doctor.dob),
        password,
        stat: "active",
        role: "doctor",
        doctor_profile: {
          create: {
            specialization: doctor.specialization,
            medical_license: doctor.medical_license,
            education: doctor.education,
            experience_years: doctor.experience_years,
            bio: doctor.bio,
            portfolio_url: doctor.portfolio_url,
          },
        },
      },
      include: { doctor_profile: true },
    });

    if (createdDoctor.doctor_profile) {
      doctorProfiles.push(createdDoctor.doctor_profile);
    }
  }

  const patientSeedData = [
    {
      name: "Emily Carter",
      email: "emily.carter@hcl.com",
      phone: "1200000001",
      dob: "1991-04-12",
      issue: "Hypertension",
    },
    {
      name: "Oliver West",
      email: "oliver.west@hcl.com",
      phone: "1200000002",
      dob: "1988-09-05",
      issue: "Type 2 Diabetes",
    },
    {
      name: "Sophia Patel",
      email: "sophia.patel@hcl.com",
      phone: "1200000003",
      dob: "1995-02-17",
      issue: "Anxiety",
    },
    {
      name: "Liam Brooks",
      email: "liam.brooks@hcl.com",
      phone: "1200000004",
      dob: "1990-12-22",
      issue: "Chronic back pain",
    },
    {
      name: "Mia Fernandez",
      email: "mia.fernandez@hcl.com",
      phone: "1200000005",
      dob: "1987-07-03",
      issue: "Asthma",
    },
    {
      name: "Noah Bennett",
      email: "noah.bennett@hcl.com",
      phone: "1200000006",
      dob: "1993-11-11",
      issue: "High cholesterol",
    },
    {
      name: "Ava Shah",
      email: "ava.shah@hcl.com",
      phone: "1200000007",
      dob: "1996-08-19",
      issue: "Migraine",
    },
    {
      name: "Ethan Lewis",
      email: "ethan.lewis@hcl.com",
      phone: "1200000008",
      dob: "1992-05-29",
      issue: "Sleep apnea",
    },
    {
      name: "Charlotte Kim",
      email: "charlotte.kim@hcl.com",
      phone: "1200000009",
      dob: "1994-03-08",
      issue: "Thyroid disorder",
    },
    {
      name: "James Parker",
      email: "james.parker@hcl.com",
      phone: "1200000010",
      dob: "1989-01-15",
      issue: "Kidney stone history",
    },
  ];

  const patientRecords: { user: User; doctor: Doctor }[] = [];

  for (const [index, patient] of patientSeedData.entries()) {
    const doctor = doctorProfiles[index % doctorProfiles.length];

    const createdPatient = await prisma.user.upsert({
      where: { email_id: patient.email },
      update: {
        assigned_doctors: {
          set: [{ id: doctor.id }],
        },
      },
      create: {
        name: patient.name,
        email_id: patient.email,
        phone_no: patient.phone,
        dob: new Date(patient.dob),
        password,
        stat: "active",
        role: "user",
        current_issue: patient.issue,
        assigned_doctors: {
          connect: { id: doctor.id },
        },
      },
    });

    patientRecords.push({ user: createdPatient, doctor });
  }

  for (const record of patientRecords) {
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 5);
    appointmentDate.setHours(10, 0, 0, 0);

    await prisma.appointment.create({
      data: {
        patient_id: record.user.id,
        doctor_id: record.doctor.id,
        appointment_date: appointmentDate,
        department: record.doctor.specialization,
        status: "scheduled",
      },
    });

    const goalBlueprints = [
      {
        goal_target_value: "10000 steps",
        target_type: "Daily Steps",
        frequency: 30,
      },
      {
        goal_target_value: "75 bpm",
        target_type: "Average Heartbeat",
        frequency: 30,
      },
    ];

    const createdGoals: Goal[] = [];

    for (const blueprint of goalBlueprints) {
      const goal = await prisma.goal.create({
        data: {
          user_id: record.user.id,
          doctor_id: record.doctor.id,
          goal_target_value: blueprint.goal_target_value,
          target_type: blueprint.target_type,
          frequency: blueprint.frequency,
        },
      });
      createdGoals.push(goal);
    }

    for (const goal of createdGoals) {
      const completionDays = Math.min(
        goal.frequency,
        Math.floor(goal.frequency * 0.6)
      );
      if (completionDays === 0) continue;

      const trackingEntries = Array.from({ length: completionDays }).map(
        (_, index) => {
          const entryDate = new Date();
          entryDate.setDate(entryDate.getDate() - (completionDays - index));
          entryDate.setHours(8, 0, 0, 0);
          return {
            goal_id: goal.id,
            user_id: record.user.id,
            value: goal.goal_target_value,
            entry_date: entryDate,
          };
        }
      );

      await prisma.goalTracking.createMany({
        data: trackingEntries,
      });
    }

    await prisma.prescription.createMany({
      data: [
        {
          patient_id: record.user.id,
          doctor_id: record.doctor.id,
          medicine: "Metformin 500mg",
          dosage: "1 tablet",
          frequency: "Twice daily",
          duration: "30 days",
          notes: "Take after meals",
        },
        {
          patient_id: record.user.id,
          doctor_id: record.doctor.id,
          medicine: "Vitamin D3",
          dosage: "1 capsule",
          frequency: "Daily",
          duration: "15 days",
          notes: "Morning with breakfast",
        },
      ],
    });

    const trackingEntries = chartTemplates.flatMap((template) =>
      template.values.map((value, valueIndex) => {
        const createdAt = new Date();
        createdAt.setDate(
          createdAt.getDate() - (template.values.length - valueIndex)
        );
        return {
          user_id: record.user.id,
          value: value.toString(),
          tracking_type_unit: `${template.title}|${template.unit}`,
          created_at: createdAt,
        };
      })
    );

    await prisma.tracking.createMany({
      data: trackingEntries,
    });

    await prisma.conversation.createMany({
      data: [
        {
          patient_id: record.user.id,
          doctor_id: record.doctor.id,
          sender_role: "doctor",
          message: `Hello ${
            record.user.name.split(" ")[0]
          }, how are you feeling today?`,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          patient_id: record.user.id,
          doctor_id: record.doctor.id,
          sender_role: "patient",
          message: "Feeling better after following the plan.",
          created_at: new Date(Date.now() - 1000 * 60 * 30),
        },
      ],
    });
  }

  console.log({
    admin: admin.email_id,
    doctorsSeeded: doctorProfiles.length,
    patientsSeeded: patientRecords.length,
    appointmentsSeeded: patientRecords.length,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
