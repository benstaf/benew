---
title: "Top 10% YC W26 batch startups — ranked by our Pre-Demo Day Score"
description: "As YC W26 approaches Demo Day, the biggest challenge for investors isn’t access—it’s prioritization.
"
date: "2026-03-19"
author: "YC Bench Team"
---

As YC W26 approaches Demo Day, the biggest challenge for investors isn’t access—it’s prioritization.

Hundreds of startups, limited time, and asymmetric information make it hard to know where to focus. While some firms like [Lobster Capital](https://www.lobstercap.com/) concentrate on identifying the absolute outliers (top ~2%), many funds—especially diversified YCombinator strategies like [Rebel Fund](https://www.rebelfund.vc/)—optimize for a broader top 10% to balance upside with portfolio risk.

This post introduces our **Pre-Demo Day Score**, a data-driven ranking designed specifically for that purpose.

---

## The Problem: Signal Fragmentation Before Demo Day

Pre-Demo Day evaluation typically relies on three incomplete sources:

1. **Private traction leaks** (selectively shared)
2. **Founder narratives** (often polished, rarely comparable)
3. **Market buzz** (noisy, but real)

Some investors lean heavily on insider datasets. For example, Lobster Capital’s widely circulated [YC W26 guide](https://lobstercap.substack.com/p/yc-w26-the-definitive-investors-guide) aggregates early traction signals (ARR, LOIs, usage, etc.). That level of depth may be sufficient for firms targeting only the **top 2%** of breakout companies.

But for funds building broader YC portfolios—like those explicitly optimizing for **top decile exposure**—this is not enough. You need a *systematic, scalable, and comparable* framework across the entire batch.

---

## Our Approach: A Hybrid Pre-Demo Day Score

We combine two different signal classes:

### 1. Traction (when available)

From publicly disclosed or leaked data:

* ARR and revenue signals
* Pilot revenue and LOIs
* Active users and activity volume
* Ecosystem pull (e.g. GitHub traction)

We apply a **VC-weighted scoring model**, where:

* Revenue dominates
* Engagement follows
* Acquisition and ecosystem signals are discounted

We then incorporate **velocity (MoM growth)** when available to capture momentum.

---

### 2. Market Attention (for everyone else)

The key insight:

> **Attention is not noise—it’s an early signal of market pull.**

This is supported by academic research showing that [web mentions correlate with startup success outcomes](https://doi.org/10.1145/3269206.3272011).

So we compute:

* Google/web mentions per startup domain
* Log-scaled distributions to handle extreme variance
* Relative share of total attention

---

### 3. Final Pre-Demo Day Score

For each startup:

> **Score = max(Traction Score, Attention Score)**

This ensures:

* High-traction startups rank highly even without buzz
* High-buzz startups are captured even without disclosed traction
* No company is excluded due to missing data

---

## What the Data Reveals

Across the YC W26 batch, attention and traction are **extremely unevenly distributed**:

* The **Gini coefficient is very high**, indicating strong inequality
* The **top 10% of startups capture a disproportionate share of total attention**
* The **top 2% dominate even more aggressively**, consistent with power-law dynamics

In other words:

> YC batches are not uniform—they are *winner-take-most systems*.

![](https://ycbench.com/ycw26_powerlaw.jpg)

---

## Why Focus on the Top 10%?

Because portfolio construction matters.

* **Top 2% strategy** → maximizes returns, but requires near-perfect selection
* **Top 10% strategy** → captures most breakout companies while reducing miss risk

This aligns with the philosophy described by [diversified YC funds like Rebel Fund](https://jaredheyman.medium.com/on-hitting-the-bullseye-6295e99d2a89) that prioritize:

* Coverage over precision
* Exposure over prediction

---

## The Ranking: Where Attention Meets Traction

The final ranking is driven by the **hybrid Pre-Demo Day Score**.

What makes this ranking useful:

* It reflects **real-world investor competition signals**
* It captures both **fundamentals and narrative momentum**
* It highlights where **capital is likely to concentrate on Demo Day**

Most importantly:

> It shows *not just who is good*, but **who the market already believes might be great**.


![](https://ycbench.com/ycw26_ranking.jpg)

---

## Key Insight for Demo Day Investors

By the time Demo Day starts:

* The top 10% is already partially “priced in” via attention
* The remaining alpha comes from:

  * Identifying *mispriced* startups within that top decile
  * Understanding *why* certain companies attract disproportionate attention

This ranking is a **map of that battlefield**.

---

## Access the Full Methodology

We’ve kept this post focused on insights and outcomes.

If you want:

* Full dataset
* Exact scoring pipeline
* Reproducible code
* Extended analysis

👉 Request access here: https://forms.gle/Y9i4yXpxokCB5rb58

---

## Final Thought

Demo Day feels like discovery.
In reality, much of the outcome is already shaped beforehand.

The goal isn’t to guess blindly—it’s to **read the signals early and systematically**.

That’s what the Pre-Demo Day Score is built for.
