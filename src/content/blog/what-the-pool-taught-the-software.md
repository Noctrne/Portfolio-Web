---
title: What the pool taught the software
description: Two seasons with an autonomous underwater vehicle, and why the last ten percent is rarely a code problem.
date: 2026-10-18
tags: [robotics, field notes]
---

A pool is an honest test chamber. The light is flat, the water is clear, and the vehicle either completes the run or it does not. There is no audience to impress and no weather to blame. For a software person, that clarity is both a gift and a small humiliation.

I joined the ORCA sub-team as a programmer. By the end I was leading it, which meant the problems I spent the most time on were no longer the ones I could solve in an editor.

## The vehicle is the easy part

The first version of any subsystem is usually a technical problem. The second version is a coordination problem. Someone changes a pin map, someone else assumes the old one, and suddenly the failure looks like a sensor fault. A log that is clear to the person who wrote it can be opaque to everyone else at 2 a.m.

What helped was boring: one owner per subsystem, a shared checklist before every run, and a rule that a change is not finished until someone else can repeat it. None of that appears in the final demonstration. All of it decides whether the demonstration happens.

## Debugging in salt water

Water removes your ability to see the system while it is running. You get telemetry, a video feed, and your own memory of what the vehicle was supposed to do. The gap between those three is where most bugs live.

So we learned to make the vehicle explain itself. Timestamps that matched across nodes. A short, fixed set of states printed in a predictable order. A dry-run mode that could replay a mission without the pool. The goal was not more data; it was data we could argue about.

> A reliable system is not one that never fails. It is one whose failures are legible.

## What I keep

- Write the run plan before touching the vehicle.
- Change one thing at a time, even when the schedule is tight.
- Keep a log of what you expected, not only what happened.
- Assume the next person is tired and has less context than you.

The Top 8 finish at SAUVC 2026 is the line that goes on a CV. The part I actually carry is quieter: a habit of making failures small, visible, and fixable. That habit works on robots. It works on teams. It mostly works on me.
