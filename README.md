# Tria Contact List 

A fully functional, responsive, and theme-switchable contact management application built with React, focusing on robust data integrity and a modern user experience.

## Features

This application goes beyond the basic requirements to include advanced contact management features:

1. View & Search: Displays a list of contacts with instant, case-insensitive search filtering across Name and all Phone Numbers.

2. Add Contact: Uses a modal form with client-side validation for name, phone format, and email.

3. Edit Contact: Allows users to modify all fields of an existing contact, including adding or deleting individual phone numbers.

4. Multi-Number Support: Contacts can store multiple phone numbers, visible and manageable via the detailed view.

5. Robust Duplication Handling (Merge Logic):

6. If a user adds a new contact using an existing contact's name, the application automatically merges the new, unique phone numbers into the existing contact's record, preventing data fragmentation.

7. Secure Deletion: Implements custom confirmation modals for both full contact deletion and single phone number deletion, preventing accidental data loss.

8. Theme Switching: Users can seamlessly toggle between Light and Dark Modes, with the preference persisted across sessions using localStorage.

9. Responsive UI: Fully adaptive design using Tailwind CSS, ensuring an optimal experience on mobile, tablet, and desktop screens.


## Deployment

The application is deployed live at https://contact-list-bcoh.vercel.app/



## Instructions to run locally

1. Clone the Repository:

- git clone YOUR_GITHUB_REPO_LINK
- cd contact_list


2. Install Dependencies:

- npm install


3. Start the Development Server (using Vite):

- npm run dev

The application should start working successfully.

## Architecture and Design Choices

- Framework: Built with React using Functional Components and Hooks (useState, useEffect, and useMemo) for efficient state management and performance optimization (e.g., memoized search filtering).

- Styling: Utilizes Tailwind CSS for rapid development, a modern, responsive UI, and crucial theme switching capabilities via dynamic class toggling (dark: prefix).

- Icons: Uses the lucide-react library, which provides high-quality, lightweight, tree-shakeable SVG icons for a crisp interface.

- Data Interaction: Data is managed entirely through In-Memory State (useState), simulating API interaction with a fixed setTimeout delay for demonstrating loading states (isLoading).

- Complex Logic: The Merge Functionality in handleSaveOrUpdateContact intelligently checks for existing contacts by name and merges new phone numbers using array manipulation and comparison, ensuring previous numbers are retained.


## Assumptions

- Data Persistence: Contact data is stored only in the browser's memory (React state) and is not saved to a database. Data will reset upon a full page refresh.

- API Simulation: Network latency for saving, updating, and deleting is simulated using a fixed 500ms setTimeout.

- Phone Validation: Phone number validation uses a simple regex to check for common number formats and characters, providing basic client-side error handling.


## Future Improvements

1.  **Backend Integration for Data Persistence**
    * Integrate a backend service (e.g., Firebase Firestore, Supabase, or a custom REST API) to move contact storage out of the browser's local memory and ensure data is **persistent** across sessions and devices.

2.  **Advanced Form Validation & Error Handling**
    * Replace the simple regex checks with a robust library like `libphonenumber-js` to handle **international phone number formats**, country codes, and mobile/landline distinctions accurately.
    * Implement more detailed, user-friendly **in-form error messages** instead of relying solely on the general error box.

3.  **UI/UX Enhancements**
    * Implement **alphabetic indexing** or grouping on the main list to make navigating large contact lists easier.
    * Add a **"Recently Added"** or **"Recently Edited"** section to the contact list for quick access to frequently modified items.

4.  **Unit and Integration Testing**
    * Introduce comprehensive **unit tests** (using Jest/Vitest and React Testing Library) for complex logic such as `handleSaveOrUpdateContact` (merge logic) and all validation functions to ensure application reliability.

5.  **Offline Support**
    * Implement a **Service Worker** to cache the application shell and contact data, allowing users to view (and potentially add/edit) contacts even when offline.
