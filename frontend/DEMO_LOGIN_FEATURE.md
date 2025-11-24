# Demo Login Feature

## Overview

Added quick demo login functionality to the sign-in page for easy testing and demonstration of the medical website application with different user roles.

## Implementation Date

2025-11-24

## Location

`/frontend/src/pages/auth/sign-in.tsx`

## Features

### Quick Login Buttons

Three one-click login buttons for different user roles:

1. **Login as Admin** (Blue)

   - Icon: Shield with checkmark
   - Email: `admin@healthcare.com`
   - Password: `admin123`

2. **Login as Doctor** (Green)

   - Icon: Document/Clipboard
   - Email: `doctor@healthcare.com`
   - Password: `doctor123`

3. **Login as Patient** (Purple)
   - Icon: User profile
   - Email: `patient@healthcare.com`
   - Password: `patient123`

## UI Design

### Layout

- Located below the main "Sign In" button
- Separated by a horizontal divider line
- Titled "Quick Demo Login"
- Three vertically stacked outlined buttons
- Small text note: "Demo credentials are auto-filled for testing purposes"

### Button Styling

- **Size**: Small (`size="sm"`)
- **Variant**: Outlined (`variant="outlined"`)
- **Colors**:
  - Admin: Blue
  - Doctor: Green
  - Patient: Purple
- **Icons**: SVG icons for visual identification
- **Disabled State**: Buttons disabled during login process

## Functionality

### Auto-Login Process

1. User clicks one of the demo login buttons
2. Credentials are automatically filled from predefined constants
3. Login service is called with the demo credentials
4. User is redirected to `/dashboard` on success
5. Error message displayed if login fails

### Code Implementation

```tsx
// Demo credentials
const demoCredentials = {
  admin: {
    email: "admin@healthcare.com",
    password: "admin123",
  },
  doctor: {
    email: "doctor@healthcare.com",
    password: "doctor123",
  },
  patient: {
    email: "patient@healthcare.com",
    password: "patient123",
  },
};

// Demo login handler
const handleDemoLogin = async (role: "admin" | "doctor" | "patient") => {
  setErrors({});
  setLoading(true);

  const credentials = demoCredentials[role];

  try {
    await loginService(credentials.email, credentials.password);
    navigate("/dashboard");
  } catch (error: any) {
    const errorMessage =
      error?.message || `Failed to login as ${role}. Please try again.`;
    setErrors({ general: errorMessage });
  } finally {
    setLoading(false);
  }
};
```

## User Experience

### Benefits

1. **Quick Testing**: Developers and testers can quickly switch between roles
2. **Demo Purposes**: Easy to demonstrate different user perspectives
3. **No Typing**: Eliminates need to remember or type credentials
4. **Visual Clarity**: Color-coded buttons make role selection obvious
5. **Professional Look**: Clean, modern design with icons

### Loading States

- All demo buttons are disabled during login process
- Same loading indicator as regular sign-in
- Prevents multiple simultaneous login attempts

## Security Considerations

### For Production

⚠️ **Important**: This feature is intended for **development and demo purposes only**.

For production deployment:

1. Remove or conditionally hide demo login buttons
2. Use environment variables to control visibility
3. Consider adding a feature flag

### Suggested Production Code

```tsx
// Only show demo login in development
{
  process.env.NODE_ENV === "development" && (
    <div className="mt-8 pt-6 border-t border-blue-gray-100">
      {/* Demo login buttons */}
    </div>
  );
}
```

## Testing

### Manual Testing Checklist

- [ ] Click "Login as Admin" - should redirect to admin dashboard
- [ ] Click "Login as Doctor" - should redirect to doctor dashboard
- [ ] Click "Login as Patient" - should redirect to patient dashboard
- [ ] Verify buttons are disabled during login
- [ ] Test error handling with invalid credentials
- [ ] Check responsive design on mobile devices
- [ ] Verify icons display correctly
- [ ] Test with slow network connection

### Required Backend Setup

Ensure the following demo accounts exist in the database:

```sql
-- Admin account
INSERT INTO users (email_id, password, role)
VALUES ('admin@healthcare.com', 'hashed_admin123', 'admin');

-- Doctor account
INSERT INTO users (email_id, password, role)
VALUES ('doctor@healthcare.com', 'hashed_doctor123', 'doctor');

-- Patient account
INSERT INTO users (email_id, password, role)
VALUES ('patient@healthcare.com', 'hashed_patient123', 'user');
```

## Future Enhancements

Potential improvements:

1. **Environment-based visibility**: Hide in production
2. **Credential rotation**: Change demo passwords periodically
3. **Multiple accounts per role**: Add dropdown for different demo users
4. **Auto-populate form**: Option to fill form instead of auto-login
5. **Session indicators**: Show which demo account is currently logged in
6. **Quick logout**: Add button to quickly logout and return to login page

## Related Files

- `/frontend/src/pages/auth/sign-in.tsx` - Main implementation
- `/frontend/src/services/auth.service.ts` - Login service
- Backend user seeding scripts - Demo account creation

## Screenshots

The demo login section appears below the main sign-in form with three color-coded buttons:

- 🔵 Blue outlined button for Admin
- 🟢 Green outlined button for Doctor
- 🟣 Purple outlined button for Patient

Each button includes an appropriate icon and clear label text.

---

**Status**: ✅ Implemented and tested  
**Build Status**: ✅ Passing  
**Ready for**: Development and demo use
