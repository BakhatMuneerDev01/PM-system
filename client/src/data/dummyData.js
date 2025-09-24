const dummyUserIds = {
    johnDoe: '65f6c82c2f1b4c3e80d8f7a1',
    janeSmith: '65f6c82c2f1b4c3e80d8f7a2',
    robertJohnson: '65f6c82c2f1b4c3e80d8f7a3',
};

const dummyPatientIds = {
    johnDoe: '65f6c82c2f1b4c3e80d8f7b1',
    janeSmith: '65f6c82c2f1b4c3e80d8f7b2',
    robertJohnson: '65f6c82c2f1b4c3e80d8f7b3',
};

const dummyVisitIds = {
    visit1: '65f6c82c2f1b4c3e80d8f7c1',
    visit2: '65f6c82c2f1b4c3e80d8f7c2',
    visit3: '65f6c82c2f1b4c3e80d8f7c3',
};

const dummyConversationIds = {
    general: '65f6c82c2f1b4c3e80d8f7d1',
    fieldTeam: '65f6c82c2f1b4c3e80d8f7d2',
    management: '65f6c82c2f1b4c3e80d8f7d3',
};

// User Data
export const users = [
    {
        _id: dummyUserIds.johnDoe,
        username: 'John Doe',
        email: 'johndoe@gmail.com',
        password: 'hashedpassword', // Use a dummy hashed password
        phoneNumber: '0333-1234567',
        profileImage: 'https://randomuser.me/api/portraits/men/1.jpg',
        role: 'Admin',
        payments: {
            cardHolderName: 'Azusa Nakano',
            creditCardToken: 'tok_visa', // A dummy Stripe token
            country: 'United Kingdom',
            enableAutoPayout: true,
            notifyNewPayments: true,
        },
    },
    // Add other dummy users for messaging members
    {
        _id: '65f6c82c2f1b4c3e80d8f7e1',
        username: 'Field Employee',
        email: 'field.emp@gmail.com',
        password: 'hashedpassword',
        phoneNumber: '0333-1234568',
        role: 'Field Employee',
    },
];

// Patient Data
export const patients = [
    {
        "id": "patient-1",
        "fullName": "John Doe",
        "phoneNumber": "(123) 456-7890",
        "address": "123 Main St, Anytown, CA",
        "lastVisit": "2023-10-26",
        "dateOfBirth": "1985-03-15",
        "emergencyContact": "Jane Doe (Wife) - (555) 987-6543",
        "visits": [
            {
                "id": "visit-1-1",
                "date": "2023-10-26",
                "purpose": "Annual Check-up",
                "summary": "Routine physical, all good.",
                "type": "Initial Consultation",
                "notes": {
                    "observations": "Patient in good health.",
                    "treatmentNotes": "No specific treatment required.",
                    "followUpInstructions": "Follow up in one year."
                }
            }
        ]
    },
    {
        "id": "patient-2",
        "fullName": "Jane Smith",
        "phoneNumber": "(987) 654-3210",
        "address": "456 Oak Ave, Villagetown, CA",
        "lastVisit": "2023-09-15",
        "dateOfBirth": "1990-01-20",
        "emergencyContact": "Robert Smith (Brother) - (111) 222-3333",
        "visits": [
            {
                "id": "visit-2-1",
                "date": "2023-09-15",
                "purpose": "Routine Check-up",
                "summary": "General health check.",
                "type": "Routine Check-up",
                "notes": {
                    "observations": "Patient in good health.",
                    "treatmentNotes": "No specific treatment required.",
                    "followUpInstructions": "Follow up in one year."
                }
            }
        ]
    },
    {
        "id": "patient-3",
        "fullName": "Robert Johnson",
        "phoneNumber": "(555) 123-4567",
        "address": "789 Pine Ln, Cityville, TX",
        "lastVisit": "2023-11-01",
        "dateOfBirth": "1978-06-05",
        "emergencyContact": "Sarah Johnson (Wife) - (444) 555-6666",
        "visits": [
            {
                "id": "visit-3-1",
                "date": "2023-11-01",
                "purpose": "Initial Consultation",
                "summary": "New patient intake.",
                "type": "Initial Consultation",
                "notes": {
                    "observations": "Patient presented with mild symptoms.",
                    "treatmentNotes": "Recommended over-the-counter medication.",
                    "followUpInstructions": "Monitor symptoms for a week."
                }
            }
        ]
    },
    {
        "id": "patient-4",
        "fullName": "Emily Davis",
        "phoneNumber": "(333) 777-8888",
        "address": "101 Maple Rd, Townsville, FL",
        "lastVisit": "2023-10-05",
        "dateOfBirth": "1992-04-22",
        "emergencyContact": "Michael Davis (Husband) - (333) 888-9999",
        "visits": [
            {
                "id": "visit-4-1",
                "date": "2023-10-05",
                "purpose": "Allergy Consultation",
                "summary": "Seasonal allergy symptoms.",
                "type": "Routine Check-up",
                "notes": {
                    "observations": "Patient reported sneezing, itchy eyes, and runny nose.",
                    "treatmentNotes": "Prescribed antihistamines.",
                    "followUpInstructions": "Take medication as needed."
                }
            }
        ]
    },
    {
        "id": "patient-5",
        "fullName": "William Brown",
        "phoneNumber": "(222) 555-4444",
        "address": "202 Cedar Ave, Hamlet, NY",
        "lastVisit": "2023-11-10",
        "dateOfBirth": "1965-08-30",
        "emergencyContact": "Linda Brown (Wife) - (222) 666-7777",
        "visits": [
            {
                "id": "visit-5-1",
                "date": "2023-11-10",
                "purpose": "Annual Physical",
                "summary": "Comprehensive check-up.",
                "type": "Annual Check-up",
                "notes": {
                    "observations": "Patient in good health, blood work pending.",
                    "treatmentNotes": "N/A",
                    "followUpInstructions": "Return in 2 weeks to discuss lab results."
                }
            }
        ]
    },
    {
        "id": "patient-6",
        "fullName": "Olivia White",
        "phoneNumber": "(777) 999-0000",
        "address": "303 Birch Dr, Village, OR",
        "lastVisit": "2023-09-25",
        "dateOfBirth": "1980-12-01",
        "emergencyContact": "David White (Husband) - (777) 888-9999",
        "visits": [
            {
                "id": "visit-6-1",
                "date": "2023-09-25",
                "purpose": "Sprained Ankle",
                "summary": "Minor sprain from a fall.",
                "type": "Injury Visit",
                "notes": {
                    "observations": "Patient presented with swelling and pain in the ankle.",
                    "treatmentNotes": "Advised RICE (Rest, Ice, Compression, Elevation).",
                    "followUpInstructions": "Return if pain persists for more than a week."
                }
            }
        ]
    },
    {
        "id": "patient-7",
        "fullName": "Daniel Miller",
        "phoneNumber": "(444) 333-2222",
        "address": "404 Poplar St, Metropolis, AZ",
        "lastVisit": "2023-10-18",
        "dateOfBirth": "1995-07-12",
        "emergencyContact": "Jessica Miller (Sister) - (444) 222-1111",
        "visits": [
            {
                "id": "visit-7-1",
                "date": "2023-10-18",
                "purpose": "Routine Check-up",
                "summary": "General health assessment.",
                "type": "Routine Check-up",
                "notes": {
                    "observations": "Patient in good health.",
                    "treatmentNotes": "No specific treatment required.",
                    "followUpInstructions": "Follow up in one year."
                }
            }
        ]
    },
    {
        "id": "patient-8",
        "fullName": "Sophia Green",
        "phoneNumber": "(666) 111-2222",
        "address": "505 Elm Ct, Springfield, IL",
        "lastVisit": "2023-11-05",
        "dateOfBirth": "1988-02-28",
        "emergencyContact": "Thomas Green (Husband) - (666) 222-3333",
        "visits": [
            {
                "id": "visit-8-1",
                "date": "2023-11-05",
                "purpose": "Sore Throat",
                "summary": "Bacterial infection suspected.",
                "type": "Sick Visit",
                "notes": {
                    "observations": "Patient presented with severe sore throat and fever.",
                    "treatmentNotes": "Prescribed antibiotics.",
                    "followUpInstructions": "Complete the full course of antibiotics."
                }
            }
        ]
    },
    {
        "id": "patient-9",
        "fullName": "James Taylor",
        "phoneNumber": "(999) 888-7777",
        "address": "606 Oakwood Dr, Rivertown, GA",
        "lastVisit": "2023-10-20",
        "dateOfBirth": "1970-05-19",
        "emergencyContact": "Patricia Taylor (Wife) - (999) 777-6666",
        "visits": [
            {
                "id": "visit-9-1",
                "date": "2023-10-20",
                "purpose": "Blood Pressure Follow-up",
                "summary": "Blood pressure management.",
                "type": "Follow-up",
                "notes": {
                    "observations": "Blood pressure slightly elevated.",
                    "treatmentNotes": "Adjusted medication dosage.",
                    "followUpInstructions": "Return in 3 months for re-check."
                }
            }
        ]
    },
    {
        "id": "patient-10",
        "fullName": "Ava Wilson",
        "phoneNumber": "(111) 222-3333",
        "address": "707 Pine Rd, Lakeview, WA",
        "lastVisit": "2023-09-30",
        "dateOfBirth": "2000-09-08",
        "emergencyContact": "Chris Wilson (Father) - (111) 333-4444",
        "visits": [
            {
                "id": "visit-10-1",
                "date": "2023-09-30",
                "purpose": "Acne Consultation",
                "summary": "Skin care advice.",
                "type": "Initial Consultation",
                "notes": {
                    "observations": "Patient presented with moderate acne.",
                    "treatmentNotes": "Recommended a new skin care routine and topical cream.",
                    "followUpInstructions": "Schedule a follow-up in 2 months to assess progress."
                }
            }
        ]
    },
    {
        "id": "patient-11",
        "fullName": "Ethan Cooper",
        "phoneNumber": "(888) 111-2222",
        "address": "808 Birch Ct, Seaview, CA",
        "lastVisit": "2023-11-15",
        "dateOfBirth": "1994-03-25",
        "emergencyContact": "Chloe Cooper (Wife) - (888) 222-3333",
        "visits": [
            {
                "id": "visit-11-1",
                "date": "2023-11-15",
                "purpose": "Headache Consultation",
                "summary": "Migraine symptoms.",
                "type": "Sick Visit",
                "notes": {
                    "observations": "Patient reported a severe headache, sensitivity to light, and nausea.",
                    "treatmentNotes": "Prescribed sumatriptan.",
                    "followUpInstructions": "Monitor frequency and intensity of headaches."
                }
            }
        ]
    },
    {
        "id": "patient-12",
        "fullName": "Isabella Moore",
        "phoneNumber": "(777) 222-3333",
        "address": "909 Elm Ln, Northville, NY",
        "lastVisit": "2023-10-28",
        "dateOfBirth": "1987-09-18",
        "emergencyContact": "Jack Moore (Husband) - (777) 333-4444",
        "visits": [
            {
                "id": "visit-12-1",
                "date": "2023-10-28",
                "purpose": "Annual Check-up",
                "summary": "Routine physical, all good.",
                "type": "Annual Check-up",
                "notes": {
                    "observations": "Patient in good health.",
                    "treatmentNotes": "No specific treatment required.",
                    "followUpInstructions": "Follow up in one year."
                }
            }
        ]
    },
    {
        "id": "patient-13",
        "fullName": "Mason Clark",
        "phoneNumber": "(666) 333-4444",
        "address": "111 Pine St, Southville, TX",
        "lastVisit": "2023-09-01",
        "dateOfBirth": "1975-01-30",
        "emergencyContact": "Ava Clark (Daughter) - (666) 444-5555",
        "visits": [
            {
                "id": "visit-13-1",
                "date": "2023-09-01",
                "purpose": "Knee Pain",
                "summary": "Consultation for chronic knee pain.",
                "type": "Initial Consultation",
                "notes": {
                    "observations": "Patient reported persistent knee pain, especially after activity.",
                    "treatmentNotes": "Recommended physical therapy.",
                    "followUpInstructions": "Schedule a follow-up in 3 months to assess progress."
                }
            }
        ]
    },
    {
        "id": "patient-14",
        "fullName": "Chloe Walker",
        "phoneNumber": "(555) 444-5555",
        "address": "222 Oak Dr, Westside, FL",
        "lastVisit": "2023-10-12",
        "dateOfBirth": "1998-06-15",
        "emergencyContact": "Liam Walker (Brother) - (555) 555-6666",
        "visits": [
            {
                "id": "visit-14-1",
                "date": "2023-10-12",
                "purpose": "Flu Symptoms",
                "summary": "Prescribed antiviral, advised rest.",
                "type": "Sick Visit",
                "notes": {
                    "observations": "Patient presented with flu-like symptoms.",
                    "treatmentNotes": "Prescribed Tamiflu.",
                    "followUpInstructions": "Rest for 3-5 days, drink plenty of fluids."
                }
            }
        ]
    },
    {
        "id": "patient-15",
        "fullName": "Noah Hall",
        "phoneNumber": "(444) 555-6666",
        "address": "333 Maple Ln, Eastside, NY",
        "lastVisit": "2023-11-08",
        "dateOfBirth": "1960-02-28",
        "emergencyContact": "Olivia Hall (Wife) - (444) 666-7777",
        "visits": [
            {
                "id": "visit-15-1",
                "date": "2023-11-08",
                "purpose": "Follow-up",
                "summary": "Blood pressure re-check, stable.",
                "type": "Follow-up",
                "notes": {
                    "observations": "Blood pressure within normal limits.",
                    "treatmentNotes": "Continue current medication.",
                    "followUpInstructions": "Schedule next check-up in 6 months."
                }
            }
        ]
    },
    {
        "id": "patient-16",
        "fullName": "Mia Harris",
        "phoneNumber": "(333) 666-7777",
        "address": "444 Cedar Ave, Center City, AZ",
        "lastVisit": "2023-09-20",
        "dateOfBirth": "1991-07-22",
        "emergencyContact": "Jacob Harris (Husband) - (333) 777-8888",
        "visits": [
            {
                "id": "visit-16-1",
                "date": "2023-09-20",
                "purpose": "Routine Check-up",
                "summary": "General health assessment.",
                "type": "Routine Check-up",
                "notes": {
                    "observations": "Patient in good health.",
                    "treatmentNotes": "No specific treatment required.",
                    "followUpInstructions": "Follow up in one year."
                }
            }
        ]
    },
    {
        "id": "patient-17",
        "fullName": "Lucas King",
        "phoneNumber": "(222) 777-8888",
        "address": "555 Poplar St, Lakeside, IL",
        "lastVisit": "2023-10-03",
        "dateOfBirth": "1983-04-10",
        "emergencyContact": "Emma King (Wife) - (222) 888-9999",
        "visits": [
            {
                "id": "visit-17-1",
                "date": "2023-10-03",
                "purpose": "Back Pain",
                "summary": "Minor strain from lifting.",
                "type": "Injury Visit",
                "notes": {
                    "observations": "Patient presented with lower back pain.",
                    "treatmentNotes": "Advised rest and gentle stretching.",
                    "followUpInstructions": "Return if pain persists for more than 2 weeks."
                }
            }
        ]
    },
    {
        "id": "patient-18",
        "fullName": "Aria Scott",
        "phoneNumber": "(111) 888-9999",
        "address": "666 Oakwood Ct, Hillside, GA",
        "lastVisit": "2023-11-02",
        "dateOfBirth": "1996-12-05",
        "emergencyContact": "Owen Scott (Father) - (111) 999-0000",
        "visits": [
            {
                "id": "visit-18-1",
                "date": "2023-11-02",
                "purpose": "Sore Throat",
                "summary": "Bacterial infection suspected.",
                "type": "Sick Visit",
                "notes": {
                    "observations": "Patient presented with severe sore throat and fever.",
                    "treatmentNotes": "Prescribed antibiotics.",
                    "followUpInstructions": "Complete the full course of antibiotics."
                }
            }
        ]
    },
    {
        "id": "patient-19",
        "fullName": "Leo Martinez",
        "phoneNumber": "(999) 000-1111",
        "address": "777 Pine Rd, Riverbend, WA",
        "lastVisit": "2023-09-17",
        "dateOfBirth": "1972-08-20",
        "emergencyContact": "Sofia Martinez (Wife) - (999) 111-2222",
        "visits": [
            {
                "id": "visit-19-1",
                "date": "2023-09-17",
                "purpose": "Blood Pressure Follow-up",
                "summary": "Blood pressure management.",
                "type": "Follow-up",
                "notes": {
                    "observations": "Blood pressure slightly elevated.",
                    "treatmentNotes": "Adjusted medication dosage.",
                    "followUpInstructions": "Return in 3 months for re-check."
                }
            }
        ]
    },
    {
        "id": "patient-20",
        "fullName": "Grace Rodriguez",
        "phoneNumber": "(888) 999-0000",
        "address": "888 Cedar Dr, Sunset, CA",
        "lastVisit": "2023-10-25",
        "dateOfBirth": "2001-03-12",
        "emergencyContact": "Samuel Rodriguez (Brother) - (888) 000-1111",
        "visits": [
            {
                "id": "visit-20-1",
                "date": "2023-10-25",
                "purpose": "Acne Consultation",
                "summary": "Skin care advice.",
                "type": "Initial Consultation",
                "notes": {
                    "observations": "Patient presented with moderate acne.",
                    "treatmentNotes": "Recommended a new skin care routine and topical cream.",
                    "followUpInstructions": "Schedule a follow-up in 2 months to assess progress."
                }
            }
        ]
    }
]

// Visit Data
const visits = [
    {
        _id: dummyVisitIds.visit1,
        patientId: dummyPatientIds.janeSmith,
        date: new Date('2023-10-20T00:00:00Z'),
        type: 'Annual Check-up',
        summary: 'Routine physical, all good.',
        notes: {
            observations: 'Patient in good health.',
            treatmentNotes: 'None.',
            followUpInstructions: 'Return in one year for next check-up.',
        },
    },
    {
        _id: dummyVisitIds.visit2,
        patientId: dummyPatientIds.janeSmith,
        date: new Date('2023-07-10T00:00:00Z'),
        type: 'Follow-up',
        summary: 'Prescribed antiviral, advised rest.',
        notes: {
            observations: 'Patient presented with flu symptoms.',
            treatmentNotes: 'Prescribed antiviral medication.',
            followUpInstructions: 'Advised rest and hydration.',
        },
    },
    {
        _id: dummyVisitIds.visit3,
        patientId: dummyPatientIds.janeSmith,
        date: new Date('2023-03-01T00:00:00Z'),
        type: 'Follow-up',
        summary: 'Blood pressure re-check, stable.',
        notes: {
            observations: 'Blood pressure checked, it is stable.',
            treatmentNotes: 'None.',
            followUpInstructions: 'Continue with previous medication.',
        },
    },
];

// Conversation Data
const conversations = [
    {
        _id: dummyConversationIds.general,
        name: 'General',
        members: Object.values(dummyUserIds),
        isGroup: true,
    },
    {
        _id: dummyConversationIds.fieldTeam,
        name: 'Field Team',
        members: Object.values(dummyUserIds), // Example members
        isGroup: true,
    },
    {
        _id: dummyConversationIds.management,
        name: 'Management',
        members: Object.values(dummyUserIds), // Example members
        isGroup: true,
    },
];

// Message Data
const messages = [
    {
        _id: '65f6c82c2f1b4c3e80d8f7e1',
        conversationId: dummyConversationIds.general,
        sender: dummyUserIds.johnDoe,
        text: 'Good morning everyone! Hope you all have a productive day.',
        createdAt: new Date('2023-10-27T09:00:00Z'),
    },
    {
        _id: '65f6c82c2f1b4c3e80d8f7e2',
        conversationId: dummyConversationIds.fieldTeam,
        sender: '65f6c82c2f1b4c3e80d8f7e1', // The dummy Field Employee
        text: "Good morning! I'm heading to the north region for visits today.",
        createdAt: new Date('2023-10-27T09:05:00Z'),
    },
];
