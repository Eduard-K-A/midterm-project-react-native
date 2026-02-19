## Job Finder App – Midterm Project

This project is a polished, production-style Job Finder mobile application built with React Native and Expo. It features a dark-first, editorial aesthetic inspired by modern fintech and trading terminals, with rich theming, animations, and a fully validated application flow.

### Tech Stack

- **Expo SDK**: 54 (TypeScript template)
- **React Native**: 0.81
- **State Management**: Redux Toolkit + React Redux
- **Navigation**: React Navigation (Bottom Tabs + Stack)
- **Forms & Validation**: React Hook Form + Zod
- **Networking**: Axios
- **UUIDs**: react-native-uuid
- **Theming**: Custom ThemeContext with dark/light palettes
- **Fonts**: Sora (headings), DM Sans (body) via `@expo-google-fonts`

### Setup & Installation

1. Clone the repository `midterm-project-react-native`.
2. Install dependencies:
   - `npm install`
3. Run the app:
   - `npm run start` (then select iOS, Android, or Web)

### Folder Structure

- `src/api/jobsApi.ts`: Axios instance and job fetching utilities.
- `src/components/`: Reusable UI components (job cards, search bar, skeletons, modal, theme toggle, empty states).
- `src/navigation/AppNavigator.tsx`: Bottom tab + stack configuration.
- `src/screens/`: Main job finder and saved jobs screens.
- `src/store/`: Redux Toolkit store and slices for jobs and saved jobs.
- `src/theme/`: Color tokens, typography scale, and ThemeContext.
- `src/types/index.ts`: Shared TypeScript interfaces.
- `src/utils/`: Form validators (Zod) and helper utilities.
- `src/hooks/`: Theming and debounce hooks.

### API Reference

The app integrates with the `https://empllo.com/api/v1` API.

- **Base URL**: `https://empllo.com/api/v1`
- **Jobs Endpoint**: `GET /jobs`
  - The response is normalized defensively in `jobsApi.ts` to match the internal `Job` interface:
    - Fields: `title`, `company`, `location`, `salary`, `type`, `description`, `tags`, `postedAt`, `logo`.
    - Each job receives a UUID (`id`) via `react-native-uuid` if the API does not provide one.

### Core Features

- Dark-first, editorial UI with light mode support.
- Job listing screen with:
  - Debounced search across title, company, and location.
  - Pull-to-refresh.
  - Skeleton loading state and graceful error handling.
  - Reusable job cards with save/apply actions.
- Saved jobs screen with:
  - Persistent in-memory saved jobs via Redux.
  - Confirmation dialog on removal.
- Full-screen application form modal:
  - Validated with Zod + React Hook Form.
  - Inline error messages, character counting, and disabled submit while invalid or submitting.
  - Success alerts tailored to the originating screen.
- Global theming with a toggle in headers, applied consistently across screens and components.

### Known Limitations / Future Improvements

- Saved jobs are stored in Redux only and are not persisted across app restarts.
- The API integration assumes a `/jobs` collection; if the remote API contract changes significantly, additional normalization may be required.
- Advanced animations (staggered item transitions, shared element transitions, and more complex skeleton effects) can be extended further for a richer feel.
- Adding offline support and caching would improve reliability on unstable networks.

