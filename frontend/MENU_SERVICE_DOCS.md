# Menu and Routes Service Documentation

## Overview

The `menu.service.tsx` provides a centralized service for managing role-based navigation menus and routes in the application. This service eliminates code duplication and makes it easy to maintain navigation across different user roles.

## Features

### 1. **Centralized Configuration**

All routes and menu items for different user roles are defined in one place, making it easy to:

- Add new menu items
- Modify existing routes
- Maintain consistency across the application

### 2. **Role-Based Access**

Supports three user roles:

- **Admin**: Full system access with dashboard, doctors, patients, analytics, and settings
- **Doctor**: Access to dashboard, patients, appointments, goals, and profile
- **User (Patient)**: Access to dashboard, health tracking, appointments, goals, and profile

### 3. **Type-Safe**

Uses TypeScript interfaces to ensure type safety:

```typescript
interface MenuItem {
  label: string;
  path: string;
  icon?: any;
}

interface RoleConfig {
  routes: JSX.Element[];
  menu: MenuItem[];
}
```

## Usage

### In Dashboard Layout (`layouts/dashboard.tsx`)

```tsx
import { getRoutesForRole } from "@/services/menu.service";

// Get routes based on user role
const userRole = user_state_data?.user_data?.role as
  | "admin"
  | "doctor"
  | "user";
const roleRoutes = getRoutesForRole(userRole);

// Use in Routes component
<Routes>{roleRoutes}</Routes>;
```

### In Dashboard Navbar (`widgets/layout/dashboard-navbar.tsx`)

```tsx
import { getMenuForRole } from "@/services/menu.service";

// Get menu items based on user role
const menuItems = getMenuForRole(
  user_data?.user_data?.role as "admin" | "doctor" | "user"
);

// Render menu items
{
  menuItems.map((item) => (
    <Link key={item.path} to={item.path}>
      {item.icon && <item.icon className="h-5 w-5" />}
      <span>{item.label}</span>
    </Link>
  ));
}
```

## API Reference

### `getRoutesForRole(role: UserRole): JSX.Element[]`

Returns an array of React Router Route elements for the specified role.

**Parameters:**

- `role`: "admin" | "doctor" | "user"

**Returns:**

- Array of JSX.Element (Route components)

### `getMenuForRole(role: UserRole): MenuItem[]`

Returns an array of menu items for the specified role.

**Parameters:**

- `role`: "admin" | "doctor" | "user"

**Returns:**

- Array of MenuItem objects with label, path, and optional icon

### `getRoleConfig(role: UserRole): RoleConfig`

Returns both routes and menu items for the specified role.

**Parameters:**

- `role`: "admin" | "doctor" | "user"

**Returns:**

- Object containing both routes and menu arrays

## Current Menu Structure

### Admin Menu

- Dashboard (`/dashboard/dashboard`)
- Doctors (`/dashboard/doctors`)
- Patients (`/dashboard/patients`)
- Analytics (`/dashboard/analytics`)
- Settings (`/dashboard/settings`)

### Doctor Menu

- Dashboard (`/dashboard/dashboard`)
- My Patients (`/dashboard/patients`)
- Appointments (`/dashboard/appointments`)
- Goals (`/dashboard/goals`)
- Profile (`/dashboard/profile`)

### Patient Menu

- Dashboard (`/dashboard/dashboard`)
- My Health (`/dashboard/health`)
- Appointments (`/dashboard/appointments`)
- My Goals (`/dashboard/goals`)
- Profile (`/dashboard/profile`)

## Adding New Routes/Menu Items

To add a new route or menu item:

1. Open `src/services/menu.service.tsx`
2. Find the appropriate role configuration
3. Add the route to the `routes` array:

```tsx
routes: [
  <Route key="existing-route" path="/dashboard" element={<Dashboard />} />,
  <Route key="new-route" path="/dashboard/new-page" element={<NewPage />} />,
],
```

4. Add the menu item to the `menu` array:

```tsx
menu: [
  { label: "Dashboard", path: "/dashboard/dashboard", icon: HomeIcon },
  { label: "New Page", path: "/dashboard/new-page", icon: NewIcon },
],
```

## Benefits

1. **Maintainability**: Single source of truth for navigation
2. **Consistency**: Ensures all navigation uses the same structure
3. **Scalability**: Easy to add new roles or modify existing ones
4. **Type Safety**: TypeScript interfaces prevent errors
5. **Reusability**: Can be used in multiple components (navbar, sidebar, etc.)
