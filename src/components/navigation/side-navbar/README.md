# Evalify Sidebar Navigation

A comprehensive sidebar navigation system for the Evalify educational platform, built with Next.js, TypeScript, and shadcn/ui components.

## Overview

This sidebar implementation provides two variants:
- **Basic Sidebar**: Clean, minimal design with organized navigation groups and redesigned authentication
- **Enhanced Sidebar**: Feature-rich design with collapsible sub-menus, badges, and improved user profile management

## Features

### Basic Sidebar (`side-navbar.tsx`)
- ✅ Clean, organized navigation structure
- ✅ Icon-only collapsible mode
- ✅ Active state indicators
- ✅ Grouped navigation sections
- ✅ Fixed theme toggle with proper state management
- ✅ Redesigned gradient login button
- ✅ Simplified user navigation (no dropdown)
- ✅ Direct access to settings and logout
- ✅ Responsive design

### Enhanced Sidebar (`enhanced-sidebar.tsx`)
- ✅ Collapsible sub-navigation menus
- ✅ Badge notifications for counts
- ✅ Redesigned user profile section (no dropdown)
- ✅ Hierarchical navigation structure
- ✅ Quick action items (Add/Create buttons)
- ✅ Enhanced visual feedback
- ✅ Avatar integration
- ✅ Fixed theme toggle functionality
- ✅ NextAuth.js session management

### Integrated Features
- **Authentication State Management**: Automatically displays user info when logged in, shows redesigned gradient login button when logged out
- **Theme Switching**: Fixed light/dark mode toggle with proper state management and system preference detection
- **Session Handling**: Seamless integration with NextAuth.js for user session management
- **Responsive Layout**: Proper sidebar integration with main content area and header
- **Simplified UX**: Removed complex dropdowns in favor of direct button access

## Navigation Structure

### Main Navigation
- **Dashboard** - Platform overview and quick stats
- **Users** - User management (Students, Instructors, Admin)
  - All Users
  - Students
  - Instructors
  - Add User
- **Courses** - Course management and creation
  - All Courses
  - Active Courses
  - Draft Courses
  - Create Course
- **Semester** - Academic period management
  - Current Semester
  - Past Semesters
  - Upcoming

### Assessment Tools
- **Quiz** - Quiz creation and management
  - Active Quizzes
  - Draft Quizzes
  - Completed
  - Create Quiz
- **Question Bank** - Question repository
  - All Questions
  - Multiple Choice
  - True/False
  - Short Answer
  - Add Question
- **Labs** - Laboratory assignment management
  - All Labs
  - Active Labs
  - Completed Labs
  - Create Lab

### Analytics & Reports
- **Results** - Performance analytics and reporting
  - Quiz Results
  - Lab Results
  - Course Progress
  - Reports

### System
- **Settings** - Application configuration (direct access)
- **Theme Toggle** - Fixed light/dark mode switching with proper state
- **User Authentication** - Redesigned login button with gradient styling
- **User Profile** - Simplified profile display without dropdown
- **Logout** - Direct logout button with red styling for clear action

## Usage

### Basic Implementation

```tsx
import { AppSidebar } from "@/components/navigation/side-navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Enhanced Implementation

```tsx
import { EnhancedSidebar } from "@/components/navigation/side-navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <EnhancedSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
```

### Demo Component

```tsx
import { SidebarDemo } from "@/components/navigation/side-navbar/sidebar-demo";

export default function SidebarShowcase() {
  return <SidebarDemo />;
}
```

## Components

### Files Structure
```
src/components/navigation/side-navbar/
├── side-navbar.tsx          # Basic sidebar implementation
├── enhanced-sidebar.tsx     # Enhanced sidebar with sub-menus
├── sidebar-demo.tsx         # Demo component showcasing both variants
├── index.ts                 # Export file
└── README.md               # This documentation
```

### Dependencies

The sidebar components rely on the following shadcn/ui components:
- `@/components/ui/sidebar`
- `@/components/ui/dropdown-menu`
- `@/components/ui/avatar`
- `@/components/ui/badge`
- `@/components/ui/button`
- `@/components/ui/card`

### Authentication & Theme Dependencies
- `next-auth/react` - Session management and authentication
- `next-themes` - Theme switching functionality (now properly implemented)
- Keycloak provider for authentication (configurable)
- Proper provider structure for theme state management

### Icons

Uses Lucide React icons:
- `LayoutDashboard` - Dashboard
- `Users` - Users management
- `GraduationCap` - Courses
- `Calendar` - Semester
- `HelpCircle` - Quiz
- `BookOpen` - Question Bank
- `FlaskConical` - Labs
- `Trophy` - Results
- `Settings` - Settings
- `BarChart3` - Logo/Analytics

## Customization

### Adding New Navigation Items

To add new navigation items, update the respective arrays in the component:

```tsx
const mainNavItems = [
  // existing items...
  {
    title: "New Section",
    url: "/new-section",
    icon: NewIcon,
    badge: "3", // optional
    subItems: [ // optional for enhanced sidebar
      { title: "Sub Item", url: "/new-section/sub", icon: SubIcon },
    ],
  },
];
```

### Styling

The sidebar uses Tailwind CSS classes and follows the shadcn/ui design system. Customize appearance by:

1. Modifying CSS classes in the components
2. Updating the design tokens in your Tailwind config
3. Overriding component styles with custom CSS

### State Management

Both sidebar variants use:
- Sub-menu expansion (`useState` - Enhanced only)
- Active route detection (`usePathname`)
- Authentication state (`useSession` from NextAuth.js)
- Theme state (`useTheme` from next-themes)

For additional global sidebar state, consider integrating with:
- Context API
- Zustand
- Redux Toolkit

## Accessibility

Both sidebar variants include:
- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly structure
- Focus management
- Tooltip descriptions for collapsed state
- Theme preference respects system settings
- High contrast mode support
- Reduced motion preferences honored

## Responsive Design

The sidebar automatically:
- Collapses to icon-only mode on smaller screens
- Maintains functionality across device sizes
- Provides touch-friendly interaction areas
- Adapts to mobile navigation patterns

## Performance

Optimizations included:
- Lazy loading of sub-menus
- Minimal re-renders with proper key props
- Efficient state management
- Icon optimization with Lucide React

## Browser Support

Compatible with all modern browsers that support:
- CSS Grid and Flexbox
- ES6+ JavaScript features
- React 18+
- Next.js 15+

## Recent Improvements (Latest Version)

### 🔧 Fixed Issues
- **Theme Toggle**: Resolved state management issues with proper `useEffect` and `resolvedTheme` usage
- **Provider Structure**: Fixed SidebarProvider placement to prevent conflicts
- **Authentication Flow**: Streamlined user experience with direct button access
- **Hydration Issues**: Fixed Next.js hydration errors by properly handling client-side only state
- **Dark Theme**: Corrected CSS custom properties to ensure sidebar theme switching works properly

### 🎨 Design Enhancements
- **Login Button**: New gradient styling (blue to purple) with enhanced hover effects
- **User Navigation**: Removed dropdown complexity for direct button access
- **Logout Button**: Red styling for clear destructive action indication
- **Theme Button**: Dynamic labels (Light Mode/Dark Mode) based on current state

### 📱 UX Improvements
- **Simplified Navigation**: Direct access to settings and logout
- **Better Visual Hierarchy**: Clear separation of user info and actions
- **Consistent Styling**: Unified button styles across authentication states
- **Loading States**: Added proper loading indicators during hydration for smooth user experience
- **SSR Compatibility**: Ensured server-side rendering works correctly without hydration mismatches

## Contributing

When adding new features or modifying the sidebar:

1. Maintain consistency with existing design patterns
2. Update both basic and enhanced variants when applicable
3. Add proper TypeScript types
4. Include accessibility considerations
5. Test theme toggle functionality thoroughly
6. Ensure proper authentication state handling
7. Update this documentation

## License

This component is part of the Evalify platform and follows the project's licensing terms.
