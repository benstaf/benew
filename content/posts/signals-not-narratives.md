---

title: "Signals, Not Narratives - How We Cut Through the YC Hype Cycle"
description: "YC Bench turns YC batches into a live benchmark for forecasting startup outperformance."
date: "2026-03-08"
author: "YC Bench Team"
-----------------------

Every YC batch produces the same pattern.

First comes the speculation: Twitter threads predicting the winners, blog posts naming the “most interesting companies,” investors publishing lists of favorites.

Then Demo Day arrives. Some companies explode with attention. Others quietly build traction.

A few months later, the picture changes again.

The problem isn’t that people are wrong. The problem is that **startup prediction has almost no feedback loop**. The outcomes that matter — large exits, IPOs, durable companies — take **7 to 10 years** to resolve.

By the time we know who was right, nobody remembers the original predictions.

YC Bench exists to fix that.

Instead of waiting a decade to evaluate ideas about startup success, YC Bench turns **Y Combinator batches into a live forecasting benchmark**. Predictions are made early, signals are measured during the batch, and results are evaluated within months.

The goal is simple: move startup prediction out of the world of narratives and into the world of **measurable signals**.

---

## YC Batches Are a Natural Benchmark

Most startup datasets are messy. Companies start at different times, raise money under different conditions, and operate in completely different market environments.

YC batches are different.

Each batch contains roughly **200 startups funded at the same time**, operating under similar constraints, and presenting to investors at the same endpoint: **Demo Day three months later**.

That structure creates something rare in the startup world: a **comparable cohort**.

Everyone starts at roughly the same moment. Everyone is racing toward the same deadline. Everyone is being evaluated by the same market.

In machine learning terms, a YC batch looks a lot like a benchmark dataset.

YC Bench treats it that way.

---

## Measuring Outperformance

To evaluate predictions, YC Bench introduces a metric called the **Pre-Demo Day Score**.

Instead of waiting for long-term outcomes, we measure which startups show the strongest observable signals **right before Demo Day**.


### Traction signals

Sometimes startups publicly disclose performance metrics during the batch. When they do, those signals are extremely informative.

Examples include:

* revenue or ARR
* pilot revenue
* signed contracts or LOIs
* active users
* product activity volume
* ecosystem adoption signals

Because startups rarely disclose everything, YC Bench takes a pragmatic approach: each startup gets credit for its **strongest observable traction signal**.

### Attention signals

Not every company shares traction during the batch. To ensure the benchmark still covers the entire cohort, YC Bench also incorporates broader indicators of market attention and visibility.

These signals capture the degree to which a startup is beginning to appear in the public or online ecosystem during the batch.

The final **Pre-Demo Day Score** combines these signals in a way that ensures:

* high-traction companies rank highly even if they operate quietly
* companies attracting strong external attention are still captured even without disclosed metrics

---

## The Prediction Task

Once the scores are computed, forecasting models can be evaluated against them.

The task YC Bench focuses on is simple:

**identify the top 10% of startups in the batch.**

This target is not arbitrary. Venture outcomes follow a power-law distribution, where a small fraction of startups generate the majority of returns.

The challenge is to identify those companies **before the market consensus forms**.

Forecasts are evaluated using metrics such as:

* **Precision** — how many predicted startups actually appear among the batch’s top performers
* **Recall** — how many high-traction startups were identified early

This turns startup prediction into a measurable problem.

Not opinions.
Not narratives.
Actual forecasts that can be scored.

---

## From Stories to Signals

Startup ecosystems run heavily on narrative.

Founders pitch narratives.
Investors share narratives.
Journalists amplify narratives.

But narratives are extremely hard to test.

YC Bench takes a different approach.

By turning YC batches into a **live forecasting environment**, it becomes possible to evaluate predictive signals on a timeline measured in months rather than years.

Each batch becomes a new experiment.

Each prediction becomes testable.

And over time, we can begin to answer a question that the startup world has mostly avoided:

**what actually predicts startup outperformance?**

---

## A Live Benchmark

YC Bench is designed to run continuously.

Every YC batch becomes a new forecasting challenge. Predictions can be submitted as soon as the batch list is public, and they are evaluated once the Pre-Demo Day signals are observed.

Over time the benchmark will expand with:

* more YC batches
* richer traction data
* improved signal weighting
* new forecasting models

The ambition is straightforward:

build a **standard benchmark for startup forecasting**.

Not another list of “hot companies.”

But a system where predictions can actually be tested.
