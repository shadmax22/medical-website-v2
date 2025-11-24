# 2-Step Patient Registration Implementation

## Overview

Implemented a comprehensive 2-step patient registration system with doctor selection and assignment.

## Features Implemented

### Backend APIs

#### 1. **Patient Controller** (`backend-2/src/controllers/patient.controller.ts`)

- **`assignDoctorsToPatient`**: Assigns multiple doctors to a patient
  - Validates patient and doctors exist
  - Creates many-to-many relationships
  - Returns success confirmation

#### 2. **Public Routes** (`backend-2/src/routes/public.route.ts`)

- Added `POST /assign-doctors` endpoint
- Accepts `patient_id` and `doctor_ids[]`
- No authentication required (public registration flow)

### Frontend Implementation

#### 1. **Patient Service** (`frontend-with-ts/src/services/patient.service.ts`)

- `registerPatient()`: Creates new patient account
- `getAllDoctors()`: Fetches all available doctors
- `assignDoctorsToPatient()`: Assigns selected doctors to patient

#### 2. **2-Step Registration Component** (`frontend-with-ts/src/pages/auth/patient/sign-up.tsx`)

**Step 1: Account Creation**

- Full name, email, password validation
- Phone number (10-digit validation)
- Date of birth
- Gender selection
- Terms and conditions agreement
- Creates patient account via API
- Stores patient ID and token for step 2

**Step 2: Doctor Selection**

- Displays all available doctors in card layout
- Each card shows:
  - Doctor's name with avatar
  - Specialization
  - Years of experience
- **View Details** button opens modal with:
  - Full doctor profile
  - Education
  - Contact information
  - Bio (if available)
- **Select/Remove** button for multi-selection
- Selected doctors highlighted with blue ring
- Shows count of selected doctors
- Back button to return to step 1
- Complete registration button (disabled if no doctors selected)

### Key Features

1. **Multi-Doctor Selection**: Users can select multiple doctors
2. **Modal Preview**: VModal integration for detailed doctor information
3. **Validation**: Comprehensive form validation on step 1
4. **Loading States**: Proper loading indicators throughout
5. **Error Handling**: User-friendly error messages
6. **Auto-Login**: After successful registration, token is stored and user is redirected to dashboard

## API Flow

```
1. User fills Step 1 form
   ↓
2. POST /signup → Creates patient account
   ↓
3. Receives patient_id and token
   ↓
4. User proceeds to Step 2
   ↓
5. GET /doctors → Fetches all doctors
   ↓
6. User selects doctors and views details via modal
   ↓
7. POST /assign-doctors → Assigns selected doctors
   ↓
8. Token stored, redirect to dashboard
```

## Usage

### Registration Flow

1. Navigate to `/auth/register`
2. Fill in personal details
3. Click "Continue to Doctor Selection"
4. Browse available doctors
5. Click "View Details" to see full doctor profile in modal
6. Click "Select" to add doctors (multiple selection allowed)
7. Click "Complete Registration" to finish

### Backend Endpoints

**Register Patient**

```
POST /signup
Body: {
  name, email_id, password, phone_no, dob, role: "user"
}
Response: { token, data: { id, ... } }
```

**Get All Doctors**

```
GET /doctors
Response: [{ id, specialization, education, experience_years, user: {...} }]
```

**Assign Doctors**

```
POST /assign-doctors
Body: {
  patient_id: string,
  doctor_ids: string[]
}
Response: { message, assigned_count }
```

## Technical Details

### State Management

- `step`: Controls which step is displayed (1 or 2)
- `patientId`: Stores created patient ID
- `token`: Stores auth token for auto-login
- `selectedDoctors`: Array of selected doctor IDs
- `doctors`: List of all available doctors
- `loading`: Loading state for async operations

### Validation Rules

- Name: Required
- Email: Required, valid format
- Password: Required, min 6 characters
- Repeat Password: Must match password
- Phone: Required, 10 digits
- DOB: Required
- Gender: Required
- Terms: Must be accepted

### UI/UX Enhancements

- Responsive grid layout for doctor cards
- Visual feedback for selected doctors (blue ring)
- Disabled states for buttons during loading
- Count display showing number of selected doctors
- Avatar generation using UI Avatars API
- Smooth transitions between steps
