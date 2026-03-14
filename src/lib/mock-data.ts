import type { Chat } from "@/types/chat.types";

const now = new Date();
const yesterday = new Date(now.getTime() - 86400000);
const twoDaysAgo = new Date(now.getTime() - 172800000);
const fiveDaysAgo = new Date(now.getTime() - 432000000);

export const mockChats: Chat[] = [
  {
    id: "1",
    title: "Scholarship search for MS Computer Science",
    createdAt: now,
    updatedAt: now,
    messages: [
      {
        id: "m1",
        chatId: "1",
        role: "user",
        content: "I want to find scholarships for a Master's in Computer Science in Singapore",
        createdAt: new Date(now.getTime() - 60000),
      },
      {
        id: "m2",
        chatId: "1",
        role: "assistant",
        content:
          "I'll help you find scholarships! Let me analyze your profile and search our database.\n\nBased on your profile, here are the top matches:\n\n1. **NUS Merit Scholarship** — Match: 92% | Deadline: Mar 30\n2. **ASEAN Scholarship** — Match: 87% | Deadline: Apr 15\n3. **Singapore International Graduate Award** — Match: 85% | Deadline: May 1\n\nWould you like me to go into detail on any of these?",
        agentName: "Scholarship Discovery Agent",
        createdAt: now,
      },
    ],
  },
  {
    id: "2",
    title: "CV review and suggestions",
    createdAt: yesterday,
    updatedAt: yesterday,
    messages: [
      {
        id: "m3",
        chatId: "2",
        role: "user",
        content: "Can you review my CV and suggest improvements?",
        createdAt: yesterday,
      },
      {
        id: "m4",
        chatId: "2",
        role: "assistant",
        content:
          "I'd be happy to review your CV! Please upload it and I'll provide detailed feedback on structure, content, and how well it aligns with scholarship requirements.",
        agentName: "Student Profile Agent",
        createdAt: yesterday,
      },
    ],
  },
  {
    id: "3",
    title: "MIT program requirements",
    createdAt: twoDaysAgo,
    updatedAt: twoDaysAgo,
    messages: [
      {
        id: "m5",
        chatId: "3",
        role: "user",
        content: "What are the requirements for MIT's EECS Master's program?",
        createdAt: twoDaysAgo,
      },
      {
        id: "m6",
        chatId: "3",
        role: "assistant",
        content:
          "Here are the key requirements for MIT's EECS Master's program:\n\n- **GPA**: 3.5+ recommended\n- **GRE**: Optional but recommended\n- **TOEFL/IELTS**: Required for non-native English speakers\n- **Letters of Recommendation**: 3 required\n- **Statement of Purpose**: Required\n- **Application Deadline**: December 15\n\nYour profile shows a strong match. Would you like help preparing your application?",
        agentName: "Program Discovery Agent",
        createdAt: twoDaysAgo,
      },
    ],
  },
  {
    id: "4",
    title: "Statement of Purpose draft",
    createdAt: fiveDaysAgo,
    updatedAt: fiveDaysAgo,
    messages: [
      {
        id: "m7",
        chatId: "4",
        role: "user",
        content: "Help me draft a Statement of Purpose for my NUS application",
        createdAt: fiveDaysAgo,
      },
      {
        id: "m8",
        chatId: "4",
        role: "assistant",
        content:
          "I'll help you craft a compelling Statement of Purpose. Let me start by reviewing your profile and the program requirements.\n\nHere's a suggested structure:\n\n1. **Opening Hook** — Your motivation for pursuing this field\n2. **Academic Background** — Relevant coursework and achievements\n3. **Research Experience** — Projects and publications\n4. **Why This Program** — Specific faculty, labs, or resources\n5. **Future Goals** — Career aspirations and how the program fits\n\nShall I draft each section?",
        agentName: "Application Assistant Agent",
        createdAt: fiveDaysAgo,
      },
    ],
  },
];
