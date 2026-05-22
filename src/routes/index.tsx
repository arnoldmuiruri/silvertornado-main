import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, ChevronRight, BookOpen } from "lucide-react";

const GLOSSARY = [
  {
    term: "Decedent",
    definition:
      "A person who has recently passed away. In this tool, these are individuals with open accounts — such as loans or medical bills — that have not yet been resolved.",
  },
  {
    term: "Census Tract",
    definition:
      "A small geographic area roughly the size of a neighborhood, defined by the US Census Bureau for collecting population data. Think of it like a ZIP code sub-zone.",
  },
  {
    term: "Tract 9801",
    definition:
      "The specific neighborhood in Hennepin County, Minnesota that this pilot study focuses on. All data in this dashboard comes from this one area.",
  },
  {
    term: "Boomer / 65+ Demographic",
    definition:
      "Residents aged 65 or older. This age group is statistically more likely to have estate-related accounts — meaning their passing may have left financial matters unresolved.",
  },
  {
    term: "Personal Guarantee",
    definition:
      "A written legal promise made by a business owner to personally repay a business loan if the business cannot. If that person passes away, this obligation may transfer to their estate — meaning money may still be owed.",
  },
  {
    term: "Recoverable Assets",
    definition:
      "The estimated dollar amount that may be legally collectible from the business or estate connected to the deceased person. This is the potential value of the account.",
  },
  {
    term: "Confidence Score (%)",
    definition:
      "How certain the AI is that it matched the right person to the right business. 85% or higher = high confidence, safe to act on. Below 70% = the AI is unsure, and a manual review is recommended before any contact.",
  },
  {
    term: "Entity Resolution",
    definition:
      "The AI process of searching government databases to connect a deceased person's name to businesses they may have owned or personally guaranteed debts for.",
  },
  {
    term: "UCC Filing",
    definition:
      "A public legal record (Uniform Commercial Code) showing a business used its assets as collateral for a loan. These records help identify additional recoverable amounts.",
  },
  {
    term: "Sole Proprietorship / LLC",
    definition:
      "Types of small business ownership. A Sole Proprietorship is a one-person business (owner and business are legally the same). An LLC (Limited Liability Company) is a registered company — but the owner may still have personally guaranteed its debts.",
  },
  {
    term: "Creditor Type",
    definition:
      "The category of the deceased person's debt: Healthcare (medical bill), Auto Loan, Credit Card, Utilities (electricity/water/gas), or Commercial Credit (business loan).",
  },
  {
    term: "AI Sorted",
    definition:
      "The AI has ranked the list of accounts from most to least likely to have recoverable assets. The cases at the top of the list are the highest priority.",
  },
  {
    term: "Analyst (User Role)",
    definition:
      "The team member currently reviewing this dashboard. You can switch between analysts using the name shown in the top-right corner of the dashboard — click it to see the dropdown.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Browse the Queue",
    desc: 'The left panel shows deceased individuals with open accounts, ranked by the AI from highest to lowest priority. Click any name to select it.',
  },
  {
    num: "2",
    title: "Run a Match",
    desc: 'With a name selected, click "Execute Cross-Entity Match" on the right panel. The AI will search government databases for connected businesses — this takes a few seconds.',
  },
  {
    num: "3",
    title: "Review & Act",
    desc: "If a match is found, you'll see whether a personal guarantee exists, the estimated recoverable amount, and a suggested script for respectful, professional outreach.",
  },
];

function Welcome() {
  return (
    <div className="min-h-screen bg-dcm-canvas">
      {/* Header */}
      <header className="bg-dcm-navy text-white px-8 py-5">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="h-10 w-10 rounded-md bg-dcm-emerald grid place-items-center shadow-sm shadow-dcm-emerald/30">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="text-[15px] font-semibold tracking-tight">DCM Services Analytics AI</div>
            <div className="text-[11px] text-white/60 uppercase tracking-[0.14em]">
              Geographic Portfolio Analyzer · Pilot v1.0
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-8 py-10 space-y-10">
        {/* Purpose */}
        <section className="bg-white rounded-xl border border-border shadow-sm p-8">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-xl bg-dcm-emerald/10 grid place-items-center shrink-0">
              <BookOpen className="h-6 w-6 text-dcm-emerald" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-dcm-navy tracking-tight">
                Welcome — Read This First
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Census Tract 9801 · Hennepin County, MN · Pilot Study
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/85">
            <p>
              <strong className="text-dcm-navy">What this tool does:</strong> When a small business
              owner passes away, any debts they personally promised to repay — called a{" "}
              <em>personal guarantee</em> — may still be owed by their estate or business. This tool
              helps DCM Services find those connections: match the right person to the right
              business, confirm whether money is owed, and prepare the team for respectful,
              professional follow-up.
            </p>
            <p>
              <strong className="text-dcm-navy">This is a pilot study</strong> focused on one
              neighborhood (Census Tract 9801) in Hennepin County, Minnesota. The data shown is
              simulated for demonstration purposes — no real external queries are run.
            </p>
            <p className="text-muted-foreground text-xs border-l-2 border-dcm-emerald pl-3">
              All definitions for terms used in the dashboard are listed below. If something is
              unclear, come back to this page anytime by clicking the{" "}
              <strong>? Help</strong> button in the dashboard header.
            </p>
          </div>
        </section>

        {/* How it works */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
            How It Works — 3 Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((step) => (
              <div key={step.num} className="bg-white rounded-xl border border-border shadow-sm p-5">
                <div className="h-8 w-8 rounded-full bg-dcm-emerald grid place-items-center text-white font-bold text-sm mb-3">
                  {step.num}
                </div>
                <h3 className="text-sm font-semibold text-dcm-navy">{step.title}</h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Glossary */}
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground mb-4">
            Key Terms — Plain English Definitions
          </h2>
          <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden divide-y divide-border">
            {GLOSSARY.map((item) => (
              <div key={item.term} className="px-6 py-4 flex gap-6">
                <div className="text-sm font-semibold text-dcm-navy w-52 shrink-0 pt-0.5">
                  {item.term}
                </div>
                <div className="text-sm text-foreground/80 leading-relaxed">{item.definition}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex justify-end pb-10">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-dcm-emerald px-7 py-3.5 text-sm font-semibold text-white shadow-md shadow-dcm-emerald/25 hover:bg-[oklch(0.6_0.12_175)] transition-colors"
          >
            Enter the Dashboard
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: Welcome,
  head: () => ({
    meta: [
      { title: "DCM Services — Welcome" },
      {
        name: "description",
        content: "Onboarding guide for the DCM Services Geographic Portfolio Analyzer pilot study.",
      },
    ],
  }),
});
