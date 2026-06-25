# StudyNest

A responsive, interactive front-end prototype for collaborative remote learning.

## Run locally

This prototype has no package dependencies. Serve the folder with any static server:

```powershell
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Included in the prototype

- Group dashboard and shared learning library
- Live video-room experience with mic/camera controls
- Real-time style group chat
- File upload flow and cloud-sync feedback
- Notifications for materials, mentions, and live study activity
- Progress analytics, weekly goals, and upcoming sessions
- Search across materials and groups
- Responsive mobile navigation
- Offline app-shell caching through a service worker

## Production architecture

The UI is intentionally backend-agnostic. A production implementation can use:

- **Client:** React/Next.js or React Native/Expo, with IndexedDB/SQLite for offline data
- **Identity:** Firebase Auth, Supabase Auth, Clerk, or Auth0
- **Application API:** TypeScript service using NestJS/Fastify, or serverless functions
- **Database:** PostgreSQL for users, groups, permissions, chat metadata, and analytics
- **Object storage:** Google Drive integration plus S3-compatible managed storage
- **Realtime:** WebSockets/Firebase/Supabase Realtime for chat, presence, and notifications
- **Calls:** WebRTC through LiveKit, Daily, or Agora instead of maintaining an SFU initially
- **Offline sync:** local-first write queue, revision IDs, optimistic UI, and conflict resolution
- **Files:** immutable versions with a `file_versions` table and object-storage keys
- **Authorization:** role-based group membership (`owner`, `admin`, `member`, `viewer`) checked server-side

Suggested core entities: `users`, `groups`, `memberships`, `materials`, `file_versions`, `sessions`, `session_participants`, `messages`, `notifications`, `study_events`, and `sync_operations`.
