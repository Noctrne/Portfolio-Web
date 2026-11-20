---
title: IoT Plant Watering System
category: embedded
year: 2023
summary: A soil-moisture-driven watering system built during a student exchange at Singapore ITE College.
role: Embedded development
tools: [Microcontroller, Soil sensors, C++]
cover: ../../assets/work/plant-watering.jpg
coverAlt: Soil sensors and a plant drawn in navy line work with brass accents
featured: true
order: 3
---

Built during a student exchange at Singapore ITE College in Kulon Progo, the system reads soil
humidity and waters a plant only when it needs it.

## How it works

A soil-moisture sensor feeds a microcontroller. When the reading crosses a threshold, a pump runs
for a bounded interval, then waits for the soil to settle before reading again. The point was to
make the automation boring and reliable rather than clever.

## Other exchange projects

The same programme included a Yogyakarta chatbot and an AI model for identifying batik patterns.
