import { useState } from "react";
import {
  MapPin,
  ShieldCheck,
  Building2,
  Users,
  TrendingUp,
  Brain,
  AlertTriangle,
  Heart,
  Loader2,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Menu,
  Info,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Account = {
  id: string;
  name: string;
  dod: string;
  balance: number;
  creditor: "Healthcare" | "Auto Loan" | "Credit Card" | "Utilities" | "Commercial Credit";
  x: number;
  y: number;
  match: {
    business: string;
    guarantee: string;
    recoverable: number;
    confidence: number;
    guide: string[];
  };
};

const ACCOUNTS: Account[] = [
  {
    id: "DCM-9801-001",
    name: "Johnathan R. Doe",
    dod: "03/12/2026",
    balance: 12450,
    creditor: "Healthcare",
    x: 34,
    y: 38,
    match: {
      business: "Doe & Sons Automotive LLC",
      guarantee: "YES — Commercial Line of Credit",
      recoverable: 45000,
      confidence: 96,
      guide: [
        "Open with sincere condolences and reference the Minneapolis community context — keep tone respectful and unhurried.",
        "Acknowledge Mr. Doe's role at Doe & Sons Automotive LLC without implying personal liability on surviving family.",
        "Frame the conversation around resolving the commercial line of credit so the business can continue operating cleanly.",
        "Offer flexible structured settlement options aligned with the seasonal cash flow of an auto-service business in Hennepin County.",
      ],
    },
  },
  {
    id: "DCM-9801-002",
    name: "Eleanor Vance",
    dod: "04/01/2026",
    balance: 8200,
    creditor: "Auto Loan",
    x: 58,
    y: 26,
    match: {
      business: "Vance Hearth Bakery LLC",
      guarantee: "YES — SBA-backed working capital",
      recoverable: 28500,
      confidence: 91,
      guide: [
        "Reference her decades operating the bakery on Lyndale — community recognition matters.",
        "Confirm the executor before discussing the SBA line; avoid speculation about family obligations.",
        "Position recovery as protecting the bakery's standing with local suppliers.",
      ],
    },
  },
  {
    id: "DCM-9801-003",
    name: "Robert M. Chen",
    dod: "04/15/2026",
    balance: 15900,
    creditor: "Credit Card",
    x: 46,
    y: 62,
    match: {
      business: "Chen Custom Cabinetry Inc.",
      guarantee: "YES — Equipment Financing",
      recoverable: 62000,
      confidence: 94,
      guide: [
        "Equipment financing is secured against shop machinery still in active use.",
        "Tone: respectful, B2B. The shop is now run by his son Marcus.",
        "Lead with continuity — recovery options that keep the machinery in the shop.",
      ],
    },
  },
  {
    id: "DCM-9801-004",
    name: "Sarah Jenkins",
    dod: "05/02/2026",
    balance: 6100,
    creditor: "Utilities",
    x: 71,
    y: 52,
    match: {
      business: "Jenkins Family Dental PLLC",
      guarantee: "NO — Pending verification",
      recoverable: 0,
      confidence: 42,
      guide: [
        "No personal guarantee detected at this confidence level.",
        "Recommend secondary lien review before closing the file.",
      ],
    },
  },
  {
    id: "DCM-9801-005",
    name: "William Bradley",
    dod: "05/10/2026",
    balance: 22000,
    creditor: "Commercial Credit",
    x: 22,
    y: 70,
    match: {
      business: "Bradley Roofing & Restoration LLC",
      guarantee: "YES — Personal Guarantee on Trade Credit",
      recoverable: 38200,
      confidence: 89,
      guide: [
        "Seasonal contractor — discuss settlement after the spring storm season for realism.",
        "His daughter Erin is the registered agent; route correspondence through her.",
      ],
    },
  },
];

const ANALYSTS = [
  { initials: "MR", name: "M. Reyes", role: "Analyst" },
  { initials: "JK", name: "J. Kim", role: "Senior Analyst" },
  { initials: "TS", name: "T. Singh", role: "Portfolio Manager" },
];

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const creditorTone: Record<Account["creditor"], string> = {
  Healthcare: "bg-sky-50 text-sky-700 ring-sky-200",
  "Auto Loan": "bg-amber-50 text-amber-700 ring-amber-200",
  "Credit Card": "bg-violet-50 text-violet-700 ring-violet-200",
  Utilities: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "Commercial Credit": "bg-rose-50 text-rose-700 ring-rose-200",
};

/* ------------ InfoTip ------------ */

function InfoTip({ text, light }: { text: string; light?: boolean }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex items-center transition-colors ml-1 shrink-0",
              light
                ? "text-white/40 hover:text-white/80"
                : "text-muted-foreground/50 hover:text-dcm-emerald",
            )}
            aria-label="More information"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[240px] text-xs leading-relaxed" side="bottom">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

/* ------------ Dashboard (root) ------------ */

export function Dashboard() {
  const [selectedId, setSelectedId] = useState<string>(ACCOUNTS[0].id);
  const [matchState, setMatchState] = useState<Record<string, "idle" | "loading" | "done">>({});
  const [mobileOpen, setMobileOpen] = useState(false);
  const [analystIdx, setAnalystIdx] = useState(0);

  const selected = ACCOUNTS.find((a) => a.id === selectedId)!;
  const state = matchState[selected.id] ?? "idle";
  const analyst = ANALYSTS[analystIdx];

  const runMatch = () => {
    setMatchState((s) => ({ ...s, [selected.id]: "loading" }));
    setTimeout(() => {
      setMatchState((s) => ({ ...s, [selected.id]: "done" }));
    }, 1600);
  };

  return (
    <div className="min-h-screen flex bg-dcm-canvas font-sans text-[color:var(--foreground)]">
      <Sidebar analyst={analyst} analystIdx={analystIdx} onSwitchAnalyst={setAnalystIdx} />
      {mobileOpen && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-dcm-navy text-white p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="text-lg font-semibold">DCM Services</div>
              <button onClick={() => setMobileOpen(false)} className="text-white/80">
                Close
              </button>
            </div>
            <nav className="space-y-2">
              <div className="px-2 pb-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
                Workspace
              </div>
              <button className="group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium bg-white/10 text-white">
                <MapPin className="h-4 w-4 text-dcm-emerald" />
                <span className="flex-1 text-left">Pilot Cohort View</span>
              </button>
            </nav>
          </aside>
        </div>
      )}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          onOpenMenu={() => setMobileOpen(true)}
          analyst={analyst}
          analystIdx={analystIdx}
          onSwitchAnalyst={setAnalystIdx}
        />
        <main className="flex-1 px-8 py-6 space-y-6 overflow-auto">
          <MetricsRow />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DecedentQueue
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              matchState={matchState}
            />
            <ResolutionEngine account={selected} state={state} onRunMatch={runMatch} />
          </div>
        </main>
      </div>
    </div>
  );
}

/* ------------ Sidebar ------------ */

function Sidebar({
  analyst,
  analystIdx,
  onSwitchAnalyst,
}: {
  analyst: (typeof ANALYSTS)[0];
  analystIdx: number;
  onSwitchAnalyst: (idx: number) => void;
}) {
  return (
    <aside className="hidden md:flex w-64 shrink-0 bg-dcm-navy text-white flex-col">
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-md bg-dcm-emerald grid place-items-center shadow-sm shadow-dcm-emerald/30">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight">DCM Services</div>
            <div className="text-[11px] text-white/60 uppercase tracking-[0.14em]">Analytics AI</div>
          </div>
        </div>
      </div>

      <nav className="px-3 py-4 space-y-1">
        <div className="px-2 pb-2 text-[10px] uppercase tracking-[0.18em] text-white/40">
          Workspace
        </div>
        <button className="group flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors bg-white/10 text-white shadow-[inset_3px_0_0_0_var(--dcm-emerald)]">
          <MapPin className="h-4 w-4 text-dcm-emerald" />
          <span className="flex-1 text-left">Pilot Cohort View</span>
          <ChevronRight className="h-3.5 w-3.5 text-white/40" />
        </button>
      </nav>

      <div className="mt-auto px-5 py-4 border-t border-white/10 space-y-3">
        <div className="rounded-md bg-white/5 px-3 py-2.5">
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <span className="h-1.5 w-1.5 rounded-full bg-dcm-emerald animate-pulse" />
            All systems operational
          </div>
          <div className="text-[11px] text-white/40 mt-1">Last sync · 2 min ago</div>
        </div>

        {/* Analyst switcher in sidebar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full rounded-md bg-white/5 hover:bg-white/10 transition-colors px-3 py-2.5 text-left group">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full bg-dcm-emerald/20 text-dcm-emerald grid place-items-center text-xs font-semibold shrink-0">
                  {analyst.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-medium text-white/90 truncate">{analyst.name}</div>
                  <div className="text-[10px] text-white/50">{analyst.role}</div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-white/40 group-hover:text-white/70 transition-colors" />
              </div>
              <div className="text-[10px] text-dcm-emerald mt-1.5 text-center">
                ↑ Click to switch analyst
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              Switch Analyst
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {ANALYSTS.map((a, i) => (
              <DropdownMenuItem
                key={a.name}
                onClick={() => onSwitchAnalyst(i)}
                className={cn("gap-2.5 cursor-pointer", i === analystIdx && "bg-secondary")}
              >
                <div className="h-7 w-7 rounded-full bg-dcm-navy text-white grid place-items-center text-xs font-semibold">
                  {a.initials}
                </div>
                <div>
                  <div className="text-sm font-medium">{a.name}</div>
                  <div className="text-xs text-muted-foreground">{a.role}</div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

/* ------------ Top Bar ------------ */

function TopBar({
  onOpenMenu,
  analyst,
  analystIdx,
  onSwitchAnalyst,
}: {
  onOpenMenu?: () => void;
  analyst: (typeof ANALYSTS)[0];
  analystIdx: number;
  onSwitchAnalyst: (idx: number) => void;
}) {
  return (
    <header className="border-b border-border bg-white">
      <div className="flex items-start justify-between px-8 py-5 gap-6">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <button
              onClick={onOpenMenu}
              className="inline-flex items-center justify-center md:hidden mr-2 rounded p-1 text-dcm-navy/80"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span>Pilot Cohort View</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-dcm-emerald font-medium">Hennepin / 9801</span>
          </div>
          <h1 className="mt-1.5 text-[22px] font-semibold tracking-tight text-dcm-navy">
            Geographic Portfolio Stress-Test Dashboard
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Pilot Study Micro-Cohort:{" "}
            <span className="font-medium text-foreground">
              Hennepin County, MN — Census Tract 9801
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Help / back to overview */}
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-secondary/60 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs">Definitions &amp; Help</span>
          </Link>

          {/* Analyst switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 pl-3 border-l border-border hover:opacity-80 transition-opacity group">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] text-muted-foreground">{analyst.role}</div>
                  <div className="text-sm font-medium leading-tight">{analyst.name}</div>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-dcm-navy to-dcm-slate text-white grid place-items-center text-sm font-semibold">
                  {analyst.initials}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
                Switch Analyst
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {ANALYSTS.map((a, i) => (
                <DropdownMenuItem
                  key={a.name}
                  onClick={() => onSwitchAnalyst(i)}
                  className={cn("gap-2.5 cursor-pointer", i === analystIdx && "bg-secondary")}
                >
                  <div className="h-7 w-7 rounded-full bg-dcm-navy text-white grid place-items-center text-xs font-semibold">
                    {a.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{a.name}</div>
                    <div className="text-xs text-muted-foreground">{a.role}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

/* ------------ Metrics Row ------------ */

function MetricsRow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <MetricCard
        icon={<Users className="h-5 w-5" />}
        label="Boomer Demographic (Age 65+)"
        value="4,120"
        suffix="Residents"
        trend="+3.2% YoY"
        info="People aged 65 or older living in Census Tract 9801. This age group is more likely to have open estate accounts that need resolution."
      />
      <MetricCard
        icon={<Building2 className="h-5 w-5" />}
        label="Active Small Businesses in Tract"
        value="345"
        suffix="Registered Entities"
        trend="+18 this quarter"
        info="Sole proprietorships and LLCs registered in Tract 9801. Business owners often personally guarantee their business debts, which may still be owed after they pass away."
      />
      <MetricCard
        icon={<AlertTriangle className="h-5 w-5" />}
        label="Unresolved Deceased Accounts"
        value="12"
        suffix="Open Portfolios"
        trend="5 high-confidence matches"
        emphasized
        info="Open accounts belonging to people in this area who have passed away and whose debts have not yet been addressed. The 5 highest-priority cases are shown in this dashboard."
      />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  suffix,
  trend,
  emphasized,
  info,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  suffix: string;
  trend: string;
  emphasized?: boolean;
  info?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-dcm-slate text-white p-5 shadow-sm",
        "border border-white/5",
      )}
    >
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-[3px]",
          emphasized ? "bg-dcm-emerald" : "bg-white/10",
        )}
      />
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-white/60 max-w-[80%]">
          <span>{label}</span>
          {info && <InfoTip text={info} light />}
        </div>
        <span
          className={cn(
            "h-9 w-9 grid place-items-center rounded-lg shrink-0",
            emphasized ? "bg-dcm-emerald/15 text-dcm-emerald-glow" : "bg-white/5 text-white/80",
          )}
        >
          {icon}
        </span>
      </div>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-[34px] font-semibold tracking-tight leading-none tabular-nums">
          {value}
        </span>
        <span className="text-sm text-white/60">{suffix}</span>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/60">
        <TrendingUp className="h-3 w-3 text-dcm-emerald-glow" />
        <span>{trend}</span>
      </div>
    </div>
  );
}

/* ------------ Decedent Queue ------------ */

function DecedentQueue({
  selectedId,
  onSelect,
  matchState,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  matchState: Record<string, "idle" | "loading" | "done">;
}) {
  return (
    <section className="rounded-xl bg-white border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <div className="flex items-center gap-1">
            <h2 className="text-sm font-semibold text-dcm-navy">Priority Account Queue</h2>
            <InfoTip text="The list of deceased individuals with open accounts, ranked by the AI from most to least likely to have recoverable assets. Click any row to see their details on the right." />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Census Tract 9801 · 5 priority accounts shown (12 total)
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider rounded border border-emerald-200 bg-emerald-50 text-emerald-700 px-2 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-dcm-emerald animate-pulse" />
            AI Sorted
          </div>
          <InfoTip text="AI Sorted means the AI has ranked these accounts — cases with the highest chance of recoverable assets appear at the top." />
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 px-5 py-2.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground bg-secondary/40 border-b border-border">
        <div className="col-span-4">Name</div>
        <div className="col-span-3 flex items-center gap-1">
          Date of Passing
        </div>
        <div className="col-span-2 text-right flex items-center justify-end gap-1">
          Balance
          <InfoTip text="The outstanding personal debt balance on the deceased's account (e.g. unpaid medical bill, credit card, auto loan)." />
        </div>
        <div className="col-span-3 flex items-center gap-1">
          Debt Type
          <InfoTip text="The category of debt: Healthcare = medical bill, Auto Loan, Credit Card, Utilities = electricity/water/gas, Commercial Credit = business loan." />
        </div>
      </div>

      <ul className="divide-y divide-border">
        {ACCOUNTS.map((a) => {
          const isSelected = a.id === selectedId;
          const status = matchState[a.id] ?? "idle";
          return (
            <li key={a.id}>
              <button
                onClick={() => onSelect(a.id)}
                className={cn(
                  "w-full grid grid-cols-12 gap-3 px-5 py-3.5 text-left text-sm transition-colors group relative",
                  isSelected ? "bg-emerald-50/60" : "hover:bg-secondary/50",
                )}
              >
                {isSelected && (
                  <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-dcm-emerald" />
                )}
                <div className="col-span-4 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-dcm-navy truncate">{a.name}</span>
                    {status === "done" && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-dcm-emerald shrink-0" />
                    )}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">{a.id}</div>
                </div>
                <div className="col-span-3 text-muted-foreground self-center text-[13px] tabular-nums">
                  {a.dod}
                </div>
                <div className="col-span-2 text-right tabular-nums self-center font-medium">
                  {currency(a.balance)}
                </div>
                <div className="col-span-3 self-center">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset",
                      creditorTone[a.creditor],
                    )}
                  >
                    {a.creditor}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="px-5 py-3 border-t border-border bg-secondary/30 text-[11px] text-muted-foreground flex justify-between">
        <span>Showing 5 of 12 unresolved accounts</span>
        <span>Sorted by recovery confidence · highest first</span>
      </div>
    </section>
  );
}

/* ------------ Resolution Engine (Map + Match Detail) ------------ */

function ResolutionEngine({
  account,
  state,
  onRunMatch,
}: {
  account: Account;
  state: "idle" | "loading" | "done";
  onRunMatch: () => void;
}) {
  return (
    <section className="rounded-xl bg-white border border-border shadow-sm overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <div>
          <div className="flex items-center gap-1">
            <h2 className="text-sm font-semibold text-dcm-navy">AI Match Engine</h2>
            <InfoTip text="Searches government databases — MN Secretary of State, UCC filings, and county property records — to find businesses connected to the selected person." />
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Census Tract 9801 · Hennepin Co., MN — select a name on the left, then run a match
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          <Brain className="h-3.5 w-3.5 text-dcm-emerald" />
          resolve-v1.2
        </div>
      </div>

      <MapBox selectedId={account.id} />

      <div className="p-5 border-t border-border space-y-4">
        <SelectedHeader account={account} state={state} />

        {state !== "done" ? (
          <IdlePanel state={state} onRunMatch={onRunMatch} account={account} />
        ) : (
          <MatchResultPanel account={account} />
        )}
      </div>
    </section>
  );
}

function MapBox({ selectedId }: { selectedId: string }) {
  return (
    <div className="relative h-[280px] bg-dcm-navy overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <defs>
          <pattern id="dcmGrid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path
              d="M 5 0 L 0 0 0 5"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.2"
            />
          </pattern>
          <pattern id="dcmGridLg" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M 20 0 L 0 0 0 20"
              fill="none"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="0.3"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#dcmGrid)" />
        <rect width="100" height="100" fill="url(#dcmGridLg)" />
        <path
          d="M 0 30 Q 35 28 55 35 T 100 38"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.6"
          fill="none"
        />
        <path
          d="M 0 68 Q 30 62 60 70 T 100 75"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth="0.6"
          fill="none"
        />
        <path d="M 28 0 L 32 100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
        <path d="M 68 0 L 72 100" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
        {/* tract boundary */}
        <path
          d="M 10 14 L 88 9 L 93 50 L 84 88 L 16 92 L 7 55 Z"
          fill="rgba(0,168,143,0.06)"
          stroke="var(--dcm-emerald)"
          strokeWidth="0.5"
          strokeDasharray="1.2 1"
        />
      </svg>

      <div className="absolute top-3 left-3 rounded-md bg-black/30 backdrop-blur px-2.5 py-1.5 text-[11px] text-white/90 border border-white/10">
        <div className="text-white/50 text-[10px] uppercase tracking-wider">Tract Boundary</div>
        <div className="font-medium">9801 · 2.41 mi²</div>
      </div>
      <div className="absolute bottom-3 right-3 rounded-md bg-black/30 backdrop-blur px-2.5 py-1.5 text-[10px] uppercase tracking-wider text-white/60 border border-white/10">
        44.97° N · 93.27° W
      </div>

      {ACCOUNTS.map((a) => {
        const active = a.id === selectedId;
        return (
          <div
            key={a.id}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          >
            {active && (
              <span className="absolute inset-0 -m-4 rounded-full bg-dcm-emerald/30 animate-ping" />
            )}
            <span
              className={cn(
                "relative block rounded-full shadow-[0_0_0_3px_rgba(15,41,66,0.8)]",
                active
                  ? "h-3.5 w-3.5 bg-dcm-emerald shadow-[0_0_18px_4px_rgba(0,168,143,0.55)]"
                  : "h-2.5 w-2.5 bg-dcm-emerald-glow/80",
              )}
            />
          </div>
        );
      })}
    </div>
  );
}

function SelectedHeader({
  account,
  state,
}: {
  account: Account;
  state: "idle" | "loading" | "done";
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Currently Selected
          <InfoTip text="Click a different name in the left panel to switch to another account." />
        </div>
        <div className="text-[15px] font-semibold text-dcm-navy">{account.name}</div>
        <div className="text-xs text-muted-foreground">
          {account.id} · {account.creditor} · {currency(account.balance)}
        </div>
      </div>
      <span
        className={cn(
          "rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-medium shrink-0",
          state === "done"
            ? "bg-emerald-100 text-emerald-700"
            : state === "loading"
              ? "bg-amber-100 text-amber-700"
              : "bg-secondary text-muted-foreground",
        )}
      >
        {state === "done" ? "Match Found" : state === "loading" ? "Searching…" : "Not Yet Run"}
      </span>
    </div>
  );
}

function IdlePanel({
  state,
  onRunMatch,
  account,
}: {
  state: "idle" | "loading";
  onRunMatch: () => void;
  account: Account;
}) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground leading-relaxed">
        Search for businesses connected to{" "}
        <span className="font-medium text-foreground">{account.name}</span> in the Minnesota
        Secretary of State registry, UCC filings, and county property records. The AI will check
        whether any personal guarantees exist that may make debts recoverable from the estate.
      </p>
      <button
        onClick={onRunMatch}
        disabled={state === "loading"}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200",
          "bg-dcm-emerald text-white hover:bg-[oklch(0.6_0.12_175)] shadow-md shadow-dcm-emerald/25",
          "disabled:opacity-90 disabled:cursor-wait",
        )}
      >
        {state === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Searching databases…
          </>
        ) : (
          <>
            <Brain className="h-4 w-4" />
            Run Business Match
          </>
        )}
      </button>

      {state === "loading" && (
        <div className="rounded-md border border-border bg-secondary/40 p-3 space-y-1.5">
          <ProgressLine label="MN Secretary of State — business registry" delay={0} />
          <ProgressLine label="UCC Filings Index — loan collateral records" delay={250} />
          <ProgressLine label="County Property Records" delay={500} />
          <ProgressLine label="Trade Credit Bureau" delay={750} />
        </div>
      )}
    </div>
  );
}

function ProgressLine({ label, delay }: { label: string; delay: number }) {
  return (
    <div
      className="flex items-center gap-2 text-[11px] text-muted-foreground opacity-0 animate-[fadeIn_0.3s_ease-out_forwards]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <Loader2 className="h-3 w-3 animate-spin text-dcm-emerald" />
      <span className="flex-1">{label}</span>
      <span className="text-[10px] uppercase tracking-wider">Searching</span>
    </div>
  );
}

function MatchResultPanel({ account }: { account: Account }) {
  const hasGuarantee = account.match.guarantee.startsWith("YES");
  return (
    <div className="space-y-4 animate-[fadeIn_0.4s_ease-out]">
      <div className="flex items-start gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
        <CheckCircle2 className="h-4 w-4 text-dcm-emerald mt-0.5 shrink-0" />
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold">
            Business Match Found · Secretary of State Registry
          </div>
          <div className="text-sm font-semibold text-dcm-navy truncate mt-0.5">
            {account.match.business}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-700 mt-1">
            <span>AI Confidence: {account.match.confidence}%</span>
            <InfoTip text="How certain the AI is about this match. 85%+ = high confidence, act on it. Below 70% = manual review recommended before any contact." />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Personal Guarantee?"
          value={hasGuarantee ? "YES" : "NO"}
          sub={account.match.guarantee.replace(/^YES — |^NO — /, "")}
          tone={hasGuarantee ? "warning" : "muted"}
          icon={<ShieldCheck className="h-3.5 w-3.5" />}
          info="A personal guarantee means the business owner legally promised to repay this debt themselves. If YES, the estate may still owe this amount."
        />
        <Field
          label="Potentially Recoverable"
          value={account.match.recoverable > 0 ? currency(account.match.recoverable) : "—"}
          sub="Estimated corporate-side exposure"
          tone={account.match.recoverable > 0 ? "emerald" : "muted"}
          icon={<TrendingUp className="h-3.5 w-3.5" />}
          info="The estimated dollar amount that may be legally collectible from the business or estate. This is separate from the personal account balance shown in the left panel."
        />
      </div>

      <div className="rounded-md border border-border bg-secondary/40 p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="h-6 w-6 grid place-items-center rounded bg-dcm-emerald/15 text-dcm-emerald">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div>
            <div className="flex items-center gap-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Suggested Outreach Guide
              <InfoTip text="AI-generated talking points tailored to this specific estate and local context. Use as a starting guide — always verify facts before making contact." />
            </div>
            <div className="text-[11px] text-muted-foreground">
              Respectful script for this estate · compliance &amp; dignity first
            </div>
          </div>
        </div>
        <ul className="space-y-2 text-[13px] leading-relaxed">
          {account.match.guide.map((g, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-0.5 inline-grid h-4 w-4 shrink-0 place-items-center rounded-full bg-dcm-emerald/15 text-[10px] font-semibold text-dcm-emerald">
                {i + 1}
              </span>
              <span className="text-foreground/85">{g}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-muted-foreground border-t border-border pt-2.5">
          <Heart className="h-3 w-3 text-dcm-emerald" />
          Generated with compliance &amp; dignity-first guardrails
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  sub,
  tone,
  icon,
  info,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "emerald" | "warning" | "muted";
  icon: React.ReactNode;
  info?: string;
}) {
  const toneCls =
    tone === "emerald"
      ? "text-dcm-emerald"
      : tone === "warning"
        ? "text-amber-700"
        : "text-muted-foreground";
  return (
    <div className="rounded-md border border-border bg-white p-3">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
        <span className={toneCls}>{icon}</span>
        {label}
        {info && <InfoTip text={info} />}
      </div>
      <div className={cn("mt-1.5 text-lg font-semibold tabular-nums", toneCls)}>{value}</div>
      <div className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{sub}</div>
    </div>
  );
}
