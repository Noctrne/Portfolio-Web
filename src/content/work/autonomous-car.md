---
title: Autonomous Car — ERC UGM
category: software
year: 2026
summary: Software for a scaled autonomous vehicle in the robotics division of Elins Research Club UGM.
role: Programmer
tools: [Python, ROS 2, Computer Vision, Linux]
cover: ../../assets/work/autonomous-car.jpg
coverAlt: A typographic cover reading Autonomous Car, scaled vehicle perception and control, ERC UGM 2026
featured: false
order: 4
links:
  - label: 2025 platform
    href: https://github.com/autonomous-driving-2025
---

The autonomous car is a scaled vehicle used by Elins Research Club as a testbed for perception,
planning, and control. I worked on the software side: turning sensor data into a model of the
track, and translating that model into steering and speed decisions.

## Focus

The vehicle is deliberately small and the track is controlled, which makes it a useful place to
test ideas before they move to larger autonomous systems. Most of the work is in the unglamorous
part — reading sensors honestly, handling the cases where the track disappears, and keeping the
whole stack predictable.

## Context

The 2025 platform is documented in the autonomous-driving-2025 GitHub organisation, alongside the
dashboard and supporting ROS 2 packages.
