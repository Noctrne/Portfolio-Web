---
title: ROV-Guard — DCSE Capstone Project
category: autonomy
year: 2026
summary: A supervised ROV platform with fail-safe behaviour, built as a DIKE UGM capstone and exhibited at MIPA EXPO 2026.
role: Project Leader
tools: [ROS 2, Jetson Nano, Pixhawk, Python, C++]
cover: ../../assets/work/rov-guard.jpg
coverAlt: ROV-Guard system architecture diagram showing the surface unit, onboard computer, and flight controller
featured: true
order: 2
---

ROV-Guard is my capstone project in the Department of Electronics and Instrumentation at
Universitas Gadjah Mada, developed with a team and funded through DIKE UGM's Alokasi Dana
Masyarakat.

## System

The vehicle is built on an ORCA-class ROV platform. A Pixhawk flight controller handles depth and
attitude, while a Jetson Nano companion computer runs a ROS 2 supervision layer. The supervision
node watches heartbeat and sensor state, and takes over when a mission needs to fail safe rather
than continue.

## What I did

As project leader I set the system architecture, coordinated integration across the mechanical,
electrical, and software work, and led pool testing. The project was exhibited at MIPA EXPO 2026.
