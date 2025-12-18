# SkillSync - Skill Exchange Platform

The Skill Exchange Platform is a web application that enables users to **learn and teach skills through mutual exchange**.

Instead of traditional paid learning, users connect with others who want to learn the skills they can teach, and in return offer skills they want to learn themselves.

---

## Problem Statement

Many people want to learn new skills but lack access to affordable learning resources.  
At the same time, they already possess skills that others are interested in.

This platform bridges that gap by enabling **peer-to-peer skill exchange**, allowing users to learn collaboratively without monetary transactions.

---

## Key Features

- User authentication and profiles
- Skill-based user matching
- Session request and approval workflow
- Real-time chat between users
- Video calls using Jitsi API
- Session completion tracking
- Feedback and user statistics
- Real-time notifications using Socket.IO

---

## How the Platform Works (High Level)

1. Users create profiles with:
   - Skills they can teach
   - Skills they want to learn
2. The platform matches users based on mutual skill interest
3. Users send session requests to each other
4. The recipient can accept or reject the request
5. Accepted users can:
   - Chat in real time
   - Join a video session
6. After completion, sessions are marked completed and stats are updated

---

## Session Management Module

The session management module is a core backend component of the platform.  
It handles the **entire lifecycle of a learning session** between two users.

### Responsibilities

- Creating session requests
- Managing session status (pending, accepted, completed)
- Enforcing authorization rules
- Sending real-time notifications
- Tracking session completion
- Computing user statistics

---

## Backend Session Logic

### Requesting a Session
- A user can send a session request to another user
- Each session stores:
  - Requester
  - Recipient
  - Topic
  - Scheduled date
  - Status

### Accepting or Rejecting a Session
- Only the recipient is allowed to respond to a request
- Status updates are validated using authenticated user context

### Real-Time Notifications
- Socket.IO is used to notify users instantly when:
  - A new session request is received
  - A session request is accepted

### Viewing Sessions
- Users can view:
  - Pending session requests
  - Accepted sessions
- Sessions are sorted by scheduled date for better usability

### Completing a Session
- Only participants can mark a session as completed
- Completion time is recorded for tracking purposes

### User Statistics
- The system computes:
  - Total completed sessions
  - Skills taught
  - Skills learned

---

## Security & Authorization

- All session-related actions require authentication
- Only session participants can modify session state
- Unauthorized access attempts are explicitly blocked

---

## Design Decisions

- **Real-time updates** improve user experience and reduce polling
- **Clear session states** simplify backend logic
- **Authorization-first checks** prevent invalid actions
- **Modular backend design** keeps components maintainable

---

## Conclusion

The Skill Exchange Platform promotes collaborative learning by enabling users to exchange skills in a structured and secure manner.

The session management module plays a critical role in ensuring smooth coordination, real-time interaction, and accurate tracking of learning activity across the platform.
