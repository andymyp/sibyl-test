export interface User {
  id: string;
  email: string;
  name: string;
  role: "client" | "lawyer";
  createdAt: string;
  jurisdiction?: string;
  barNumber?: string;
}

export interface CaseFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Case {
  id: string;
  title: string;
  category: string;
  description: string;
  status: "open" | "engaged" | "closed" | "cancelled";
  clientId: string;
  files: CaseFile[];
  createdAt: string;
  updatedAt: string;
}

export interface Quote {
  id: string;
  caseId: string;
  lawyerId: string;
  amount: number;
  expectedDays: number;
  note: string;
  status: "proposed" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

// Dummy users
export const dummyUsers: User[] = [
  {
    id: "client1",
    email: "client1@example.com",
    name: "John Smith",
    role: "client",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "lawyer1",
    email: "lawyer1@example.com",
    name: "Sarah Johnson",
    role: "lawyer",
    createdAt: "2024-01-10T10:00:00Z",
    jurisdiction: "New York",
    barNumber: "NY123456",
  },
  {
    id: "lawyer2",
    email: "lawyer2@example.com",
    name: "Michael Chen",
    role: "lawyer",
    createdAt: "2024-01-12T10:00:00Z",
    jurisdiction: "California",
    barNumber: "CA789012",
  },
];

// Dummy cases
export const dummyCases: Case[] = [
  {
    id: "case1",
    title: "Commercial Lease Agreement Review",
    category: "Commercial Law",
    description:
      "I need assistance reviewing a commercial lease agreement for my restaurant. The lease is for 5 years with renewal options. I want to ensure the terms are fair and protect my business interests. Please review clauses related to rent increases, maintenance responsibilities, and termination conditions.",
    status: "open",
    clientId: "client1",
    files: [
      {
        id: "file1",
        name: "lease-agreement.pdf",
        size: 2048576,
        type: "application/pdf",
        uploadedAt: "2024-12-15T10:30:00Z",
      },
      {
        id: "file2",
        name: "property-floor-plan.png",
        size: 1024000,
        type: "image/png",
        uploadedAt: "2024-12-15T10:35:00Z",
      },
    ],
    createdAt: "2024-12-15T10:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z",
  },
  {
    id: "case2",
    title: "Employment Contract Dispute",
    category: "Employment Law",
    description:
      "I believe my employer has violated the terms of my employment contract regarding overtime compensation and benefits. I need legal advice on whether I have grounds for a claim and what options are available to me. This involves reviewing my employment contract and recent pay stubs.",
    status: "engaged",
    clientId: "client1",
    files: [
      {
        id: "file3",
        name: "employment-contract.pdf",
        size: 1536000,
        type: "application/pdf",
        uploadedAt: "2024-12-10T14:20:00Z",
      },
      {
        id: "file4",
        name: "pay-stubs.pdf",
        size: 512000,
        type: "application/pdf",
        uploadedAt: "2024-12-10T14:25:00Z",
      },
    ],
    createdAt: "2024-12-10T14:00:00Z",
    updatedAt: "2024-12-12T16:30:00Z",
  },
  {
    id: "case3",
    title: "Intellectual Property Protection",
    category: "Intellectual Property",
    description:
      "I have developed a new software application and need help with patent and trademark protection. I want to understand my options for protecting my intellectual property both domestically and internationally. This includes reviewing my development documentation and market analysis.",
    status: "open",
    clientId: "client1",
    files: [
      {
        id: "file5",
        name: "software-documentation.pdf",
        size: 4096000,
        type: "application/pdf",
        uploadedAt: "2024-12-18T09:15:00Z",
      },
      {
        id: "file6",
        name: "market-analysis.pdf",
        size: 2048000,
        type: "application/pdf",
        uploadedAt: "2024-12-18T09:20:00Z",
      },
      {
        id: "file7",
        name: "app-screenshots.png",
        size: 3072000,
        type: "image/png",
        uploadedAt: "2024-12-18T09:25:00Z",
      },
    ],
    createdAt: "2024-12-18T09:00:00Z",
    updatedAt: "2024-12-18T09:00:00Z",
  },
];

// Dummy quotes
export const dummyQuotes: Quote[] = [
  {
    id: "quote1",
    caseId: "case1",
    lawyerId: "lawyer1",
    amount: 1500,
    expectedDays: 7,
    note: "I have extensive experience in commercial lease negotiations. I can review your agreement thoroughly and provide detailed recommendations within a week.",
    status: "proposed",
    createdAt: "2024-12-15T14:00:00Z",
    updatedAt: "2024-12-15T14:00:00Z",
  },
  {
    id: "quote2",
    caseId: "case1",
    lawyerId: "lawyer2",
    amount: 1200,
    expectedDays: 5,
    note: "I specialize in commercial real estate law and can provide a comprehensive review of your lease agreement with actionable recommendations.",
    status: "proposed",
    createdAt: "2024-12-15T16:30:00Z",
    updatedAt: "2024-12-15T16:30:00Z",
  },
  {
    id: "quote3",
    caseId: "case2",
    lawyerId: "lawyer1",
    amount: 2500,
    expectedDays: 14,
    note: "Employment disputes require careful analysis. I can review your contract and provide a comprehensive assessment of your claim potential.",
    status: "accepted",
    createdAt: "2024-12-11T10:00:00Z",
    updatedAt: "2024-12-12T16:30:00Z",
  },
  {
    id: "quote4",
    caseId: "case3",
    lawyerId: "lawyer2",
    amount: 5000,
    expectedDays: 21,
    note: "Intellectual property protection is crucial for software applications. I can help with patent research, trademark applications, and international protection strategies.",
    status: "proposed",
    createdAt: "2024-12-18T11:00:00Z",
    updatedAt: "2024-12-18T11:00:00Z",
  },
];

export const categories = [
  "Commercial Law",
  "Employment Law",
  "Intellectual Property",
  "Criminal Law",
  "Family Law",
  "Real Estate Law",
  "Corporate Law",
  "Tax Law",
  "Immigration Law",
  "Personal Injury",
];

// Mock authentication state
export let currentUser: User | null = {
  id: "123123",
  name: "Andy",
  email: "andy@mail.com",
  role: "lawyer",
  createdAt: "2025/02/05",
};

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
};

export const getCurrentUser = () => currentUser;

export const authenticate = (email: string, password: string): User | null => {
  const user = dummyUsers.find((u) => u.email === email);
  // In a real app, we'd verify the password hash
  return user || null;
};
