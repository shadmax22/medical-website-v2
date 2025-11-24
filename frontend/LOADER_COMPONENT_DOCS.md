# Loader Component Documentation

## Overview

The Loader component provides a consistent, animated loading experience across the medical website application. It includes multiple variants to suit different use cases.

## Components

### 1. Loader (Default)

The standard loader with a spinning ring and pulsing center.

```tsx
import { Loader } from "@/components/misc/Loader";

// Basic usage
<Loader />

// With custom message
<Loader message="Loading patient data..." />

// Different sizes
<Loader size="sm" />
<Loader size="md" />  // default
<Loader size="lg" />

// Full screen with backdrop
<Loader fullScreen message="Processing..." />
```

**Props:**

- `message?: string` - Loading message to display (default: "Loading...")
- `size?: "sm" | "md" | "lg"` - Size of the loader (default: "md")
- `fullScreen?: boolean` - Display as full-screen overlay with backdrop blur (default: false)

### 2. MedicalLoader

A medical-themed loader with a cross icon and pulse animation.

```tsx
import { MedicalLoader } from "@/components/misc/Loader";

<MedicalLoader message="Fetching medical records..." />
<MedicalLoader size="lg" fullScreen />
```

**Props:** Same as Loader component

### 3. SkeletonLoader

A skeleton loader for content placeholders.

```tsx
import { SkeletonLoader } from "@/components/misc/Loader";

// Default (3 lines)
<SkeletonLoader />

// Custom number of lines
<SkeletonLoader lines={5} />
```

**Props:**

- `lines?: number` - Number of skeleton lines to display (default: 3)

## Usage Examples

### Dashboard Loading

```tsx
function AdminDashboard() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader message="Loading dashboard data..." />;
  }

  return <div>Dashboard content...</div>;
}
```

### Full Screen Loading

```tsx
function App() {
  const [initializing, setInitializing] = useState(true);

  if (initializing) {
    return <Loader fullScreen message="Initializing application..." />;
  }

  return <Routes>...</Routes>;
}
```

### Content Placeholder

```tsx
function PatientList() {
  const [loading, setLoading] = useState(true);

  return (
    <div>
      {loading ? (
        <SkeletonLoader lines={5} />
      ) : (
        <ul>
          {patients.map((patient) => (
            <li key={patient.id}>{patient.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## Implementation Status

The Loader component has been implemented in the following pages:

✅ **Admin Dashboard** (`/pages/dashboard/admin/AdminDashboard.tsx`)

- Loading dashboard data

✅ **Doctor Dashboard** (`/pages/dashboard/doctor/DoctorDashboard.tsx`)

- Loading doctor dashboard

✅ **Patient Dashboard** (`/pages/dashboard/patient/PatientDashboard.tsx`)

- Loading patient dashboard

✅ **Profile Page** (`/pages/dashboard/profile.tsx`)

- Loading patient profile

✅ **Patients Profiles** (`/components/patient/PatientsProfiles.tsx`)

- Loading patients list

✅ **Sign Up Page** (`/pages/auth/patient/sign-up.tsx`)

- Loading doctors list during registration

## Design Features

### Animation

- **Spinning Ring**: Smooth 360° rotation animation
- **Pulsing Center**: Gentle pulse effect for visual interest
- **Fade In**: Subtle entrance animation

### Styling

- **Color Scheme**: Blue theme matching the medical website design
- **Backdrop**: Semi-transparent white background with blur effect (fullScreen mode)
- **Responsive**: Adapts to different screen sizes
- **Accessible**: Includes proper ARIA labels and semantic HTML

### Performance

- **Lightweight**: Minimal CSS and no external dependencies
- **GPU Accelerated**: Uses CSS transforms for smooth animations
- **No Layout Shift**: Fixed dimensions prevent content jumping

## Best Practices

1. **Use appropriate messages**: Provide context-specific loading messages

   ```tsx
   // Good
   <Loader message="Loading patient records..." />

   // Avoid
   <Loader message="Loading..." />
   ```

2. **Choose the right size**: Match loader size to the content area

   ```tsx
   // Small components
   <Loader size="sm" />

   // Full page
   <Loader size="lg" />
   ```

3. **Use fullScreen sparingly**: Reserve for critical operations

   ```tsx
   // Good: Initial app load, critical data fetch
   <Loader fullScreen message="Initializing..." />

   // Avoid: Small component updates
   ```

4. **Consider SkeletonLoader**: For better UX when loading lists or cards
   ```tsx
   // Better UX for content-heavy sections
   <SkeletonLoader lines={10} />
   ```

## Customization

To customize the loader appearance, modify the Tailwind classes in `/components/misc/Loader.tsx`:

```tsx
// Change color scheme
className = "border-t-blue-500"; // Change to border-t-green-500

// Adjust animation speed
className = "animate-spin"; // Add custom animation in tailwind.config
```

## Future Enhancements

Potential improvements for the Loader component:

- [ ] Add progress percentage display
- [ ] Support for custom icons
- [ ] Dark mode variant
- [ ] Accessibility improvements (screen reader announcements)
- [ ] Animation variants (dots, bars, etc.)
- [ ] Integration with Suspense boundaries

## Support

For issues or questions about the Loader component, please refer to the main project documentation or contact the development team.
