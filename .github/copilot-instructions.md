

### Toast Messages
use `useToast` from `src/hooks/use-toast.ts` for any toast messages. Donot use alert / error messages

### UI
- Use shadcn/ui components for UI elements.
- Make sure all UI components are responsive and works well on both desktop and mobile devices.
- Use Tailwind CSS for styling.
- Make sure all components works well with light and dark mode.

### API calls
Where possible, use `useQuery` and `useMutation` from `@tanstack/react-query` for API calls.
Use `axiosInstance` from `src/lib/axios/axios-client.ts` for making API requests to the backend.

### Next.js
- Use Server Components where possible.

### Code Style
- Modularize the code and keep it clean.
- Strictly use TypeScript for type safety.