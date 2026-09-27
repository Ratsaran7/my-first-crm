# NexusCRM — Modern Enterprise Sales & Relationship Platform

![NexusCRM Preview Banner](https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80)

> A production-grade Customer Relationship Management (CRM) web application engineered with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Recharts**. Designed with a modern, high-contrast dark/light SaaS aesthetic for portfolio showcase.

---

## 🌟 Key Highlights & Features

### 📊 1. Executive Dashboard & Metrics
- **Real-Time KPIs**: Total Pipeline Value, Closed Won Revenue, Conversion Win Rate %, Active Leads with comparative growth trends.
- **Interactive Revenue Velocity Chart**: Monthly closed revenue vs. quota targets with custom SVG gradients and tooltips.
- **Pipeline Stage Funnel**: Deal volume and value breakdown across all active sales phases.
- **Lead Acquisition Channels**: Donut chart tracking referrals, organic search, outbound, LinkedIn, and paid ads.
- **Live Activity Stream & Actionable Checklist**: Real-time sales rep notes, call logs, deal transitions, and quick-completion task items.

### 👥 2. Contacts & Lead Scoring
- **Filterable Data Table**: Search across names, titles, and companies with multi-stage filter tags (*New, Contacted, Qualified, Proposal, Won, Lost*) and priority levels.
- **Lead Quality Scoring**: Dynamic 0–100 engagement score with hot lead indicators.
- **Slide-over Contact Drawer**: Complete profile breakdown, associated deals, interactive activity logger (log calls, notes, emails, and meetings), and stage progression.

### 💼 3. Deals & Sales Pipeline Kanban Board
- **Interactive Pipeline Stages**:
  - `Discovery (25%)`
  - `Qualified (50%)`
  - `Proposal Sent (75%)`
  - `In Negotiation (90%)`
  - `Closed Won (100%)` (Triggers celebration confetti 🎉)
  - `Closed Lost (0%)`
- **Deal Cards**: Value formatted in USD, probability progress bars, tags, target close dates, and assigned sales owner.
- **Stage Totals**: Auto-calculated stage value summaries.

### 🏢 4. Companies & Enterprise Accounts Directory
- Grid of client organizations showcasing company size, account tier (*Enterprise, Growth, Starter*), industry, headquarters, and total deals value.
- Account drilldown view displaying all linked contacts and historical deals.

### 📅 5. Action Items & Task Manager
- Categorized by *All*, *To Do*, *In Progress*, and *Completed*.
- Multi-type tasks (*Call, Email, Meeting, Follow-up, General Task*) with due dates and contact links.

### 📈 6. Analytics, Leaderboard & CSV Export
- Sales Rep Quota Leaderboard with rank badges and progress bars.
- Deal velocity metrics (cycle duration, lead-to-opportunity rates, proposal acceptance).
- **One-click CSV Export** to generate and download client reports.

### ⚡ 7. Built-in Portfolio Demo Engine
- **Global Command Palette (`Cmd+K` / `Ctrl+K`)**: Rapid search across contacts, companies, deals, and tasks.
- **LocalStorage Persistence**: Add, edit, move, or delete records with zero backend database setup needed.
- **Instant Demo Reset**: One-click reset to restore the original realistic 20+ sample data records at any time.
- **Dark / Light Mode**: Seamless theme toggle with persistent user preference.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript (Strict)](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Tailwind Animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **FX / Feedback**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Date Utilities**: [date-fns](https://date-fns.org/)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/my-first-crm.git
cd my-first-crm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore the CRM.

### 4. Build for production
```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root shell layout with Theme & CRM providers
│   ├── globals.css             # Tailwind base styles and dark mode variables
│   ├── page.tsx                # Executive Dashboard view
│   ├── leads/page.tsx          # Contacts & Lead scoring directory
│   ├── pipeline/page.tsx       # Sales Pipeline Kanban board
│   ├── companies/page.tsx      # Enterprise Accounts directory
│   ├── tasks/page.tsx          # Action Items & Task manager
│   ├── analytics/page.tsx      # Revenue reports & Leaderboard
│   └── settings/page.tsx       # Workspace settings & Demo data controls
├── components/
│   ├── layout/                 # AppShell, Sidebar, Header, CommandPalette (Cmd+K)
│   ├── dashboard/              # StatCard, RevenueChart, StageFunnelChart, LeadSourceChart, RecentActivity, UpcomingTasks
│   ├── leads/                  # LeadsTable, LeadDetailDrawer, LeadModal, ActivityLogger
│   ├── pipeline/               # KanbanBoard, KanbanColumn, DealCard, DealModal
│   ├── companies/              # CompanyGrid, CompanyDetailDrawer, CompanyModal
│   ├── tasks/                  # TaskList, TaskModal
│   ├── analytics/              # RepPerformance, SalesVelocity
│   └── ui/                     # Button, Badge, Modal, Drawer, Input, Select, Dropdown, Avatar, Card, Tabs, Toast
├── context/
│   ├── CRMContext.tsx          # Global CRM state provider & actions
│   └── ThemeContext.tsx        # Dark/Light theme manager
├── data/
│   └── mockData.ts             # Rich realistic seed dataset
├── lib/
│   ├── utils.ts                # cn utility, formatting helpers
│   └── storage.ts              # LocalStorage sync engine
└── types/
    └── crm.ts                  # TypeScript interfaces
```

---

## 📜 License
MIT License. Free to use for personal portfolio showcase, learning, and customization.
