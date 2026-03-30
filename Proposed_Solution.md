# SwasthAi (MindCare) - Comprehensive Proposed Solution

## Overview
SwasthAi is an innovative, privacy-first mental health and wellness platform designed specifically for university students. It bridges the gap between proactive student self-monitoring, AI-assisted triage, and professional on-campus counseling, ensuring that students receive timely interventions without compromising their privacy.

## Core Features & Workflows

### 1. Multi-Role Ecosystem & Authentication
The platform serves three distinct user roles, each with a tailored experience:
- **Students:** Sign up with their university and department details, allowing them to access personalized growth tools, self-assessments, and booking services.
- **Independent Counselors:** Offer broad therapy sessions and can add post-session medical reviews.
- **On-Campus Counselors:** Oversee the mental health analytics of their specific institution, gaining high-level insights into department wellness without violating individual privacy.

### 2. Bi-Weekly Mental Health Surveys
- **Functionality:** A mandatory, comprehensive check-in presented to students every 14 days upon login. 
- **Metrics Tracked:** 
  - **Core Mental State:** Questions derived from PHQ-9 and GAD-7 assessments.
  - **Behavior & Thinking:** Identifying signs of burnout and loss of motivation.
  - **Stress:** Evaluating academic pressure versus overall stress.
  - **Lifestyle Habits:** Tracking sleep hours, exercise days, and daily screen time.
  - **Safety Check:** Monitoring for self-harm thoughts to trigger immediate intervention.
- **Outcome:** Generates a dynamic "Wellness Score" (0-100) displayed on the Student Dashboard, categorizing progress into Mental Wellbeing, Stress Control, and Physical Habits.

### 3. Student Dashboard
- **Data-Driven Insights:** Students see a visual breakdown of their survey scores instead of static goals, reinforcing self-awareness.
- **Resource Hub:** Access to scheduled live sessions, quick coping mechanisms, and an easy option to voluntarily retake the check-in survey.

### 4. Advanced Privacy & Medical History Management
- **Anonymity:** During the counselor booking process and dashboard views, student identities are kept strictly anonymous to off-campus counselors.
- **Medical Reviews:** Counselors can safely attach post-session feedback. When a student books a counselor, that counselor can request to view the anonymous medical history to better prepare for the session, ensuring continuity of care.

### 5. On-Campus Intuitive Analytics
- **Department-Level Insights:** On-Campus Counselors see aggregated wellness scores, active alert counts, and student distribution across fields (Engineering, Business, Liberal Arts, Sciences) exclusively for their institution.
- **Proactive Resource Allocation:** By identifying which department has the lowest wellness scores, institutions can host targeted workshops and peer-support groups.

### 6. AI Wellness Assistant & Emergency Alert System 
- **24/7 Support:** A Gemini-powered smart chat that provides empathetic listening, coping strategies, and psychological first aid.
- **Crisis Detection:** The AI passively analyzes chat input for depression or self-harm keywords.
- **Automated Emergency Routing:** If crisis language is detected, the system immediately pulls the guardian's contact info stored during signup (without prompting the distressed student) and automatically simulates an emergency phone call and support team email to initiate an intervention.

## Technical Architecture
- **Frontend:** React, TypeScript, Tailwind CSS, ShadCN UI for a fully responsive, visually calming, glass-morphic interface.
- **Backend & Database:** Firebase Authentication and Firestore for secure, real-time data syncing.
- **AI Integration:** Google Gemini API for natural language conversational support. 

## Impact & Value Proposition
SwasthAi acts as a preventive net, catching deteriorating mental health trends before they escalate into crises. By utilizing AI for triage, maintaining strict student anonymity, and surfacing macro-level data to universities, the platform drastically lowers the barrier to seeking help and removes the stigma of traditional counseling services.
