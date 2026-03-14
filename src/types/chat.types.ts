export interface Chat {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface Message {
  id: string;
  chatId: string;
  role: "user" | "assistant" | "system";
  content: string;
  agentName?: string;
  agentStatus?: AgentStatus;
  attachments?: Attachment[];
  createdAt: Date;
}

export interface AgentStatus {
  agent: string;
  step: string;
  steps: string[];
  currentStepIndex: number;
  isComplete: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}
