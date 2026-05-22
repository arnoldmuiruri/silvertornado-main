# Stress Test Dashboard — Explainer

Purpose
- This prototype is a pilot dashboard for geographic portfolio stress-testing focused on deceased-account recovery opportunities within a census tract.

At-a-glance (Plain English)
- What you see: a single Pilot Cohort view (Hennepin County, Tract 9801) listing a small set of decedents and an "AI Spatial & Entity Resolution Engine." It surfaces likely corporate matches, confidence, and suggested talking points.
- Who it's for: an analyst or recovery team who needs a quick list of priority accounts to review and outreach suggestions.

Is this live?
- Demo status: This build is a simulated demo. The cross-entity "query" shown in the UI is simulated (client-side setTimeout) and not executing live external searches by default. Treat results as examples, not production outputs.

Business case (short)
- Goal: Surface high-confidence corporate exposures tied to a deceased individual's estate so recovery teams can prioritize respectful outreach and preserve asset value.
- Value: reduces time-to-discovery for recoverable corporate exposures and standardizes empathetic outreach language.

UX guidance & changes made
- A lightweight onboarding page is now provided inside the app at `/` to explain the purpose and next steps before opening the dashboard.
- Non-functional navigation items were removed from the mobile menu to avoid user confusion.
- A mobile menu (hamburger) was added for small-screen access to the workspace navigation.
- A favicon was added and linked in the app head so the browser shows an icon.

Plain-English definitions
- Decedent: a deceased person whose estate or accounts are being reviewed.
- Tract Boomer: the count of people aged 65+ in the census tract (a demographic snapshot).
- Personal Guarantee: an indication that a decedent may have personally guaranteed a business credit line — this implies potential recoverable assets.

How to use
1. Open the app on desktop or mobile.
2. Read the explainer at the landing page (`/`).
3. Click "Open Dashboard" to view the Pilot Cohort dashboard and interact with the demo matching flow.

Notes for the team
- If you want true live queries, you will need to integrate backend query endpoints and replace the simulated `setTimeout` flow in `src/components/dashboard/Dashboard.tsx` with an actual API call.
- For production hosting, Netlify or Vercel are straightforward options; deployment instructions depend on whether you build a static export or host an SSR entry.

Contact
- For questions about demo vs production behavior, ask the engineer who provided this prototype.
