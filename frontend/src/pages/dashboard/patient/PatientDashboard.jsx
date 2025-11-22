import {
    ClipboardDocumentCheckIcon,
    ChatBubbleLeftEllipsisIcon,
    CalendarDaysIcon
} from "@heroicons/react/24/outline";

import {
    Avatar,
    Card,
    CardBody,
    CardHeader,
    Typography
} from "@material-tailwind/react";

import React from "react";

export function PatientDashboard() {

    // --------------------------------------------------------------------------
    // ALL PATIENT DATA FROM ONE SOURCE
    // --------------------------------------------------------------------------
    const patient_data = {
        patient: {
            name: "Shad Ali",
            age: 20,
            gender: "Male",
            img: "/img/bruce-mars.jpeg",
        },

        stats: {
            total_goals: 7,
            total_responses: 14,
            upcoming_appointments: 3,
        },

        upcoming_appointments: [
            {
                doctor: "Dr. Ritesh Sharma",
                date: "25 Nov 2025",
                time: "03:30 PM",
                department: "Cardiology",
                img: "/img/team-1.jpeg",
            },
            {
                doctor: "Dr. Meera Patel",
                date: "28 Nov 2025",
                time: "11:00 AM",
                department: "Dermatology",
                img: "/img/team-2.jpeg",
            },
            {
                doctor: "Dr. Sanjay Gupta",
                date: "30 Nov 2025",
                time: "09:00 AM",
                department: "Neurology",
                img: "/img/team-3.jpeg",
            },
        ],

        doctor_responses: [
            {
                doctor: "Dr. Ritesh",
                img: "/img/team-1.jpeg",
                message: "Increase water intake and avoid heavy lifting this week.",
                time: "Yesterday",
            },
            {
                doctor: "Dr. Kumar",
                img: "/img/team-2.jpeg",
                message: "Your reports look good. Continue the same medication.",
                time: "2 days ago",
            },
            {
                doctor: "Dr. Sunaina",
                img: "/img/team-5.jpeg",
                message: "Practice breathing exercises daily for anxiety.",
                time: "4 days ago",
            }
        ],

        goals_from_doctors: [
            {
                doctor: "Dr. Ritesh Sharma",
                doctor_img: "/img/team-1.jpeg",
                goal: "Gain 5 kg weight",
                due: "20 Dec 2025",
                status: "active",
            },
            {
                doctor: "Dr. Kumar",
                doctor_img: "/img/team-2.jpeg",
                goal: "Reduce headache occurrences to < 2",
                due: "28 Nov 2025",
                status: "active",
            },
            {
                doctor: "Dr. Sunaina",
                doctor_img: "/img/team-5.jpeg",
                goal: "Anxiety level < 3",
                due: "15 Dec 2025",
                status: "active",
            },
            {
                doctor: "Dr. Mehta",
                doctor_img: "/img/team-4.jpeg",
                goal: "Lower cough frequency",
                due: "10 Dec 2025",
                status: "completed",
            },
        ],
    };

    const statisticsCards = [
        {
            icon: ClipboardDocumentCheckIcon,
            title: "Assigned Goals",
            value: patient_data.stats.total_goals,
        },
        {
            icon: ChatBubbleLeftEllipsisIcon,
            title: "Doctor Responses",
            value: patient_data.stats.total_responses,
        },
        {
            icon: CalendarDaysIcon,
            title: "Upcoming Appointments",
            value: patient_data.stats.upcoming_appointments,
        },
    ];

    // --------------------------------------------------------------------------

    return (
        <div className="mt-12">



            {/* STATISTICS CARDS */}
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
                {statisticsCards.map(({ icon, title, value }) => (
                    <Card
                        key={title}
                        className="border border-blue-gray-100 shadow-sm p-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography variant="h6" color="blue-gray">{title}</Typography>
                                <Typography variant="h4" color="blue-gray" className="mt-2">
                                    {value}
                                </Typography>
                            </div>
                            {React.createElement(icon, { className: "w-10 h-10 text-blue-500" })}
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

                {/* UPCOMING APPOINTMENTS */}
                <Card className="xl:col-span-1 border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6">
                        <Typography variant="h6" color="blue-gray">
                            Upcoming Appointments
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-600">
                            Your scheduled visits with doctors
                        </Typography>
                    </CardHeader>

                    <CardBody className="pt-0">
                        {patient_data.upcoming_appointments.map(({ doctor, date, time, department, img }, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 border-b border-blue-gray-50 py-3 last:border-none"
                            >
                                <Avatar src={img} size="sm" />
                                <div>
                                    <Typography variant="small" color="blue-gray">
                                        {doctor}
                                    </Typography>
                                    <Typography className="text-xs text-blue-gray-500">
                                        {department} • {date} • {time}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>

                {/* DOCTOR RESPONSES */}
                <Card className="xl:col-span-2 border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6">
                        <Typography variant="h6" color="blue-gray">
                            Doctor Responses
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-600">
                            Messages from your doctors
                        </Typography>
                    </CardHeader>

                    <CardBody className="pt-0">
                        {patient_data.doctor_responses.map(({ doctor, message, time, img }, index) => (
                            <div key={index} className="flex items-center gap-4 border-b border-blue-gray-50 py-3">
                                <Avatar src={img} size="sm" />
                                <div>
                                    <Typography variant="small" color="blue-gray">
                                        {doctor}
                                    </Typography>
                                    <Typography className="text-xs text-blue-gray-500 mb-1">
                                        {time}
                                    </Typography>
                                    <Typography className="text-sm text-blue-gray-700">
                                        {message}
                                    </Typography>
                                </div>
                            </div>
                        ))}
                    </CardBody>
                </Card>

            </div>

            {/* ALL GOALS ASSIGNED BY ALL DOCTORS */}
            <div className="mt-12">
                <Card className="border border-blue-gray-100 shadow-sm">
                    <CardHeader floated={false} shadow={false} className="p-6">
                        <Typography variant="h6" color="blue-gray" className="mb-1">
                            Your Health Goals
                        </Typography>
                        <Typography variant="small" className="text-blue-gray-600">
                            All goals assigned by your doctors
                        </Typography>
                    </CardHeader>

                    <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                        <table className="w-full min-w-[640px] table-auto">
                            <thead>
                                <tr>
                                    {["Doctor", "Goal", "Due Date", "Status"].map((h) => (
                                        <th key={h} className="border-b border-blue-gray-50 py-3 px-6 text-left">
                                            <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400">
                                                {h}
                                            </Typography>
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {patient_data.goals_from_doctors.map(
                                    ({ doctor, doctor_img, goal, due, status }, index) => (
                                        <tr key={index}>
                                            <td className="py-3 px-6">
                                                <div className="flex items-center gap-4">
                                                    <Avatar src={doctor_img} size="sm" />
                                                    <Typography color="blue-gray">{doctor}</Typography>
                                                </div>
                                            </td>

                                            <td className="py-3 px-6">{goal}</td>
                                            <td className="py-3 px-6">{due}</td>
                                            <td className="py-3 px-6 capitalize">
                                                {status === "completed" ? (
                                                    <span className="text-green-600 font-medium">Completed</span>
                                                ) : (
                                                    <span className="text-blue-600 font-medium">Active</span>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}

export default PatientDashboard;
