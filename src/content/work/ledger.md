---
title: Ledger — A Calmer Way to Read Your Money
category: code
year: 2025
summary: A personal finance interface that trades dashboards for a single, readable page.
role: Product design, front-end
tools: [Astro, TypeScript, SQLite]
cover: ../../assets/work/ledger.jpg
coverAlt: Minimal interface composition with outlined panels
featured: true
order: 3
links:
  - label: Live site
    href: https://example.com/ledger
  - label: Source
    href: https://github.com/
---

Most budgeting tools answer questions you did not ask. Ledger was built around one: how
much can I spend this month without thinking about it again?

## The interface

The main view is a single column of plain text. Income, fixed costs, and a remaining
number — no charts, no categories to maintain, no notifications.

## Under the hood

- Static front end, no client-side framework
- Server-side aggregation with a small SQLite database
- All amounts rendered as text, so the page stays usable with JavaScript disabled
- Total page weight under 40kb

The result is a tool that takes about fifteen seconds to check, which was the entire brief.
