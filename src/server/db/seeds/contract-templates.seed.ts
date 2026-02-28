
import { contractTemplates } from "@/server/db/schema"
import { db } from "../client"

export const SERVICE_AGREEMENT_TEMPLATE = `# 1. PARTIES

This Service Agreement ("Agreement") is entered into as of {{contract_date}} ("Effective Date") by and between:

**Service Provider:** {{company_name}}, located at {{company_address}} ("Company")

**Client:** {{client_company}}, represented by {{client_name}} ({{client_email}}), located at {{client_address}} ("Client")

# 2. SCOPE OF WORK

## 2.1 Project Overview

The Company agrees to perform the following services for the Client:

**Project:** {{project_title}}

{{project_description}}

## 2.2 Deliverables

The Company will deliver all work products as mutually agreed upon in writing prior to commencement of each phase.

## 2.3 Milestones

{{project_milestones}}

# 3. TIMELINE

## 3.1 Start Date

Work under this Agreement shall commence on {{project_start_date}}.

## 3.2 Completion Date

The project is expected to be completed by {{project_due_date}}, subject to timely receipt of materials, feedback, and approvals from the Client.

## 3.3 Delays

Any delays caused by the Client's failure to provide necessary information, assets, or approvals in a timely manner shall not be the responsibility of the Company and may result in revised timelines.

# 4. COMPENSATION & PAYMENT TERMS

## 4.1 Project Fee

The total fee for the services described in this Agreement is {{project_budget}}.

## 4.2 Payment Schedule

- 50% deposit due upon signing of this Agreement
- 25% due at project midpoint milestone
- 25% balance due upon project completion and delivery

## 4.3 Late Payments

Invoices unpaid after 14 days of the due date will incur a late fee of 1.5% per month on the outstanding balance.

## 4.4 Expenses

Any pre-approved out-of-pocket expenses (third-party tools, licenses, stock assets, etc.) will be billed to the Client at cost with prior written approval.

# 5. REVISIONS & CHANGE ORDERS

## 5.1 Included Revisions

The project fee includes up to two (2) rounds of revisions per deliverable based on the original agreed scope.

## 5.2 Additional Work

Work outside the agreed scope will require a separate written Change Order with updated timeline and pricing before commencement.

# 6. INTELLECTUAL PROPERTY & OWNERSHIP

## 6.1 Ownership Upon Full Payment

Upon receipt of full payment, the Company assigns to the Client all rights, title, and interest in the final deliverables.

## 6.2 Ownership Before Full Payment

Until full payment is received, all work product remains the sole property of the Company. The Client has no right to use, distribute, or publish any deliverables prior to full payment.

## 6.3 Company Portfolio Rights

The Company reserves the right to display the completed project in its portfolio and marketing materials unless the Client requests otherwise in writing.

## 6.4 Third-Party Assets

Any third-party materials (fonts, stock images, libraries) used in the project are subject to their respective licenses. The Company will inform the Client of any such components.

# 7. CONFIDENTIALITY

## 7.1 Mutual Non-Disclosure

Both parties agree to keep confidential all non-public information shared during the course of this engagement, including but not limited to business strategies, technical data, client lists, and pricing.

## 7.2 Duration

This confidentiality obligation shall remain in effect during the term of this Agreement and for two (2) years following its termination.

## 7.3 Exceptions

Confidentiality obligations do not apply to information that is publicly known, independently developed, or required to be disclosed by law.

# 8. WARRANTIES & REPRESENTATIONS

## 8.1 Company Warrants

- The work produced is original and does not infringe upon any third-party intellectual property rights
- The Company has the full right and authority to enter into this Agreement

## 8.2 Client Warrants

- The Client has the right to use all materials provided to the Company
- The Client has the full right and authority to enter into this Agreement

# 9. LIMITATION OF LIABILITY

## 9.1 Cap on Liability

The Company's total liability under this Agreement shall not exceed the total fees paid by the Client in the three (3) months preceding the claim.

## 9.2 Exclusion of Consequential Damages

Neither party shall be liable for any indirect, incidental, special, or consequential damages arising from or related to this Agreement, even if advised of the possibility of such damages.

# 10. TERMINATION

## 10.1 Termination for Convenience

Either party may terminate this Agreement with fourteen (14) days written notice.

## 10.2 Payment on Termination

Upon termination, the Client shall pay the Company for all work completed up to the termination date, calculated on a pro-rata basis.

## 10.3 Termination for Cause

Either party may terminate immediately upon written notice if the other party materially breaches this Agreement and fails to cure such breach within seven (7) days of notice.

# 11. DISPUTE RESOLUTION

## 11.1 Governing Law

This Agreement shall be governed by and construed in accordance with applicable law.

## 11.2 Informal Resolution

The parties agree to attempt to resolve any dispute informally through good-faith negotiation for at least thirty (30) days before pursuing formal remedies.

## 11.3 Arbitration

If informal resolution fails, disputes shall be resolved through binding arbitration.

# 12. GENERAL PROVISIONS

## 12.1 Entire Agreement

This Agreement constitutes the entire agreement between the parties and supersedes all prior discussions, representations, and agreements.

## 12.2 Amendments

Any modification to this Agreement must be made in writing and signed by both parties.

## 12.3 Severability

If any provision of this Agreement is found to be unenforceable, the remaining provisions shall continue in full force.

## 12.4 Independent Contractor

The Company is an independent contractor. Nothing in this Agreement creates an employment, partnership, or joint venture relationship.`

export async function seedContractTemplates() {
    await db.insert(contractTemplates).values([
        {
            title:       "Service Agreement",
            description: "Standard client service agreement covering scope, payment, IP, and liability",
            type:        "service_agreement",
            body:        SERVICE_AGREEMENT_TEMPLATE,
            isDefault:   true,
        },
    ]).onConflictDoNothing()

    console.log("✓ Contract templates seeded")
}