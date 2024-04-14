# PeerPrep Technical Interview Preparation Platform

![PeerPrep Logo](/GuideAssets/Logo.png)

## Introduction

PeerPrep is a collaborative, real-time platform designed to enhance technical interview
preparations for students. It aims to provide a seamless environment where students
can register, match with peers of similar interests and difficulty levels, and engage
in collaborative problem-solving. The platform features a comprehensive question
repository and an interactive web-based user interface, ensuring accessibility and
ease of use.

## System Architecture and Features

### Frontend

**Frontend UI**:

Delivers a responsive and intuitive user interface that supports real-time interactions
and seamlessly integrates with backend services.

[Frontend Guide](./frontend/README.md)

### Microservices

**User Service**:

Manages user registration, login, and profile management. This service is crucial
for authenticating users and maintaining user data security.

[User Service Guide](./microservices/user-service/README.md)

**Matching Service**:

Facilitates the matching of students based on selected criteria, optimizing the pairing
process to reduce wait times and enhance user experience.

[Matching Service Guide](./microservices/matching-service/README.md)

**Question Service**:

Responsible for storing and retrieving coding problems from a robust database, allowing
filtering by topic and difficulty.

[Question Service Guide](./microservices/question-service/README.md)

**Collaboration Service**:

Provides real-time collaborative sessions for code development, featuring tools for
concurrent editing and interactive problem-solving.

[Collaboration Service Guide](./microservices/collaboration-service/README.md)
