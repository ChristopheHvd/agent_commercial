# 🏨 AGENT ORCHESTRATEUR – MEETING ROOM BOOKING

## 📌 Overview

This **n8n workflow** is an AI-powered orchestrator agent for managing **meeting room booking requests** in a business hotel context.  
It processes incoming client emails, extracts booking details, checks room availability, creates or updates reservations, generates quotes or invoices, and drafts a professional reply email in French.

---

## ⚙️ Key Components

### 🔗 Workflow Nodes

1. **Manual Trigger**  
   Used for manual execution and testing within n8n.

2. **Set Init-Data**  
   Sets example input data for testing (client email text and email address).

3. **OpenAI Chat Model**  
   Provides LLM capabilities using the `gpt-4o-mini` model for reasoning and orchestration.

4. **Simple Memory**  
   Stores conversation memory with a custom session key to maintain context across steps.

5. **Agent Orchestrator**  
   Core orchestrator node with the system prompt defining:
   - Agent role and objectives  
   - Process steps (classification, extraction, availability check, reservation creation, document generation, email drafting)  
   - Available tools and their usage  
   - Expected output format (`format_final_json_response`) with the final email in French.

6. **Tool: ClassifyEmail**  
   Classifies email intent (reservation, modification, invoice, incomplete info, follow-up, other).

7. **Tool: AGENT_CLIENT_MANAGEMENT**  
   Retrieves or updates client details based on the email address.

8. **Tool: AGENT_ROOMS_MANAGEMENT**  
   Finds available meeting rooms based on date, time range, and number of participants.

9. **Tool: AGENT_CLIENT_RESERVATION**  
   Creates or updates reservations with provided details, including action parameter to specify intent.

10. **Tool: WORKFLOW_GENERATE_DOCUMENTS**  
    Generates **quotes or invoices** for reservations and returns their URLs.

11. **Think Tool**  
    Allows the agent to reason, step back, and decide on missing information or next actions.

12. **Edit Fields**  
    Formats the final output fields as required by downstream processes.

---

## 🎯 Workflow Objective

✅ **Input:**  
- Client email text  
- Client email address

✅ **Process:**  
1. Classify the email intent.  
2. If it is a reservation request, extract booking details.  
3. Retrieve client information.  
4. Check room availability.  
5. Create or update the reservation.  
6. Generate a quote (or invoice if applicable).  
7. Draft and output a professional email reply in French, confirming availability and including the quote or invoice link.

✅ **Output:**  
A structured JSON containing the final email ready to be sent to the client.

---

## 🛠️ Dependencies

- **n8n v1+** with LangChain and OpenAI nodes installed  
- **OpenAI API key** (referenced as `OpenAi account` in credentials)  
- **Sub-workflows/tools:**
  - TOOL_ClassifyEmail
  - AGENT_CLIENT_MANAGEMENT
  - AGENT_ROOMS_MANAGEMENT
  - AGENT_CLIENT_RESERVATION_MANAGEMENT
  - WORKFLOW_GENERATE_INVOICE_OR_QUOTE

---

## 🚀 Usage

1. Import the workflow into n8n.  
2. Configure the **OpenAI credentials**.  
3. Adjust tool workflow IDs if necessary to match your instance.  
4. Trigger manually for tests or integrate with your email ingestion pipeline for production usage.

---

## 📄 Notes

- The final client-facing email is generated **entirely in French**, ensuring communication consistency.  
- The agent defaults new reservation statuses to `waiting_for_confirmation`, pending explicit client confirmation.  
- If any tool fails or returns null, the agent writes a fallback email explaining that a human will handle the request.

---

### 🔒 Repository Tags

- `Agent IA`  
- `WhatsApp` (if integrated for input channel)

---

✉️ **Maintainer:** *[Your Name or Team]*  
📅 **Last updated:** 2025-07-07

