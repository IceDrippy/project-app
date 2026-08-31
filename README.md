# AVIAGUARD Aviation Insurance Platform

AVIAGUARD is an aviation insurance web application for pilots, aircraft owners, fleet operators, and administrators who need a clearer way to register aircraft, estimate coverage, manage policies, submit claims, and review operational risk items.

## Insurance Problem

Aviation insurance involves detailed aircraft, pilot, usage, storage, valuation, document, and claim information. Traditional intake can be slow and fragmented, making it difficult for customers to understand coverage options and for administrators to review applications or claims consistently. AVIAGUARD centralizes these steps into one guided workflow with quote logic, validation, and admin review queues.

## Intended Users

- Aircraft owners and pilots who need to register aircraft, compare coverage, receive a quote, and manage policy activity.
- Fleet or business aviation operators who need a structured insurance intake process for multiple aircraft.
- Insurance administrators who need to review submitted applications, pilot credentials, medical information, documents, and claims.

## Business Value

AVIAGUARD reduces manual insurance intake effort, improves consistency in risk capture, and gives users faster visibility into aviation coverage options. For the insurer, it supports cleaner application data, organized claim submission, review traceability, and a stronger foundation for underwriting decisions.

## Scope

Completed scope includes the customer-facing React experience, aircraft registration wizard, quote calculation, account signup and login flow, dashboard navigation, policy and aircraft views, claim filing flow, and admin review interface for applications and claims.

Excluded scope includes production payment processing, final underwriting automation, live aircraft telemetry integrations, regulatory document verification services, complete actuarial pricing, database backup procedures, demo credentials, and personal reflection content.

Future scope may include richer backend enforcement, document storage, payment provider integration, notification workflows, reporting, analytics, and deeper policy lifecycle management.

## Technology Stack

React frontend, Flask API backend, and Microsoft SQL Server database.

## Roles

- Normal users can create accounts, log in, register aircraft, select coverage, view dashboards and policies, and submit claims.
- Admin users can access the admin workspace, review application and claim queues, approve or reject review items, and view review activity.

## Main Features

- Guided aircraft insurance registration for aircraft details, use case, pilot information, coverage, quote, and payment confirmation.
- Dynamic quote calculation based on hull value, coverage tier, usage, storage, pilot experience, pilot certification, medical status, and deductible.
- User authentication with role-based navigation after login.
- Policy, aircraft, plan comparison, dashboard, and claims areas for normal users.
- Claim submission linked to active policies and aircraft records.
- Supporting claim document selection with client-side image and size validation.
- Admin queue normalization for application, document, medical, and claim review tasks.
- Review log support for admin decisions and audit-style activity summaries.

## End-to-End Workflows

- A visitor signs up, logs in, completes aircraft registration, chooses a coverage tier and hull value, reviews the quote, completes payment validation, and reaches the dashboard with the new aircraft submitted for review.
- A normal user opens the claims flow, selects an insured aircraft or policy, enters incident details and claim amount, optionally attaches image evidence, and submits the claim for administrative review.
- An administrator logs in with an admin role, reviews pending application and claim tasks, records a decision, and sees the review queue and activity log update.
- A user compares plan options, reviews policy areas, and returns to the dashboard to continue insurance and aircraft management activities.

## Business Rules and Validations

- Login requires a username of at least four characters and a password.
- Signup requires full name, valid email address, gender, username, and a password of at least six characters.
- Admin access is determined from the authenticated role value; users with an ADMIN role are routed to the admin workspace, while other authenticated users are routed to the dashboard.
- Aircraft registration maintains step completion state and carries aircraft, use case, pilot, coverage, and quote data through the wizard.
- Hull value is constrained to the configured coverage range and is used directly in premium calculation.
- Coverage tier falls back to the professional tier if an unsupported tier is supplied.
- Quote inputs fall back to default values when optional aircraft, pilot, storage, purpose, medical, or deductible values are missing or invalid.
- Premiums include a minimum annual premium rule, risk adjustments, selected tier multiplier, and a deductible discount cap.
- Payment requires cardholder name, a 16-digit card number, MM/YY expiry, CVV, and billing postal code before an aircraft application is submitted.
- Claim submission requires an active policy to be identified for the selected aircraft before the claim can be filed.
- Claim payloads include policy, aircraft, generated claim reference, incident date, incident description, incident location, and numeric claim amount.
- Supporting claim documents must be image files smaller than 10 MB each.
- Admin review queues treat pending and in-review statuses as open work.

## Challenges and Decisions

- The insurance workflow spans customer onboarding, aircraft data capture, quote generation, payment validation, claim submission, and admin review. The project keeps these as separate flows while sharing state where needed for the aircraft registration journey.
- Quote calculation needed to be understandable and deterministic for a prototype. The decision was to use transparent rule-based factors rather than a black-box rating model.
- API data can arrive in different shapes from tasks, aircraft, claims, and logs. The admin helper layer normalizes those records into a consistent queue format for review.
- Some workflows need to function before full backend integrations are complete. The frontend includes fallback handling and local state paths so the application remains demonstrable while API endpoints mature.

## Trade-Offs

- Client-side validation improves responsiveness but must be backed by server-side validation before production use.
- The current quote model is explainable and easy to test, but it is not a complete actuarial pricing engine.
- Local browser storage simplifies authentication state for the prototype, but a production system should use a hardened token and session strategy.
- Payment screens validate format and flow completion, but no real payment processor is integrated in the completed scope.
- Admin queues are designed for clarity and review speed, but advanced workload assignment, escalation, and compliance reporting are left for later.

## Current Limitations

- The application is a prototype and does not represent a production-ready insurance or underwriting system.
- Real payment authorization, document persistence, aircraft registry verification, telemetry ingestion, and regulatory checks are not implemented.
- Quote factors are simplified and should not be used as final insurance pricing.
- Some data may depend on backend endpoint availability and compatible API response shapes.
- Authentication and authorization flows need production hardening before handling real customer or policy data.

## Future Functionality and Development Themes

- Complete backend validation and authorization for every user and admin workflow.
- Add secure document upload, storage, review, and retention policies.
- Integrate a payment provider and connect payment outcomes to policy activation.
- Expand underwriting rules, pricing models, and risk scoring with more aviation-specific data.
- Add notifications for application, policy, payment, and claim status changes.
- Build richer admin reporting, audit history, queue assignment, and operational analytics.
- Improve policy lifecycle support for renewals, endorsements, cancellations, and coverage changes.
