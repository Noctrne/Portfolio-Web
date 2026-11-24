---
title: Mini 3D Scanner — Personal Project
category: embedded
year: 2026
summary: A low-cost turntable 3D scanner built from scratch — CAD, stepper control, IR sensing, and a Python reconstruction pipeline.
role: Design, firmware & software
tools: [Fusion 360, C++, Python, Stepper motors, IR sensors]
cover: ../../assets/work/mini-3d-scanner.jpg
coverAlt: A grey 3D render of the Mini 3D Scanner assembly with turntable and vertical lift
featured: true
order: 5
links:
  - label: Mini-3D-Scanner repository
    href: https://github.com/Noctrne/Mini-3D-Scanner
---

A low-cost turntable 3D scanner. A distance sensor measures the object's radius while a stepper
rotates the turntable; a second stepper raises the sensor between layers. The captured data becomes
a point cloud and an STL mesh.

## How it works

The Arduino firmware takes 200 distance readings per revolution, prints a layer delimiter, and
lifts the sensor by one millimetre. The host records that serial stream, then a Python script
converts each reading into a radius, maps (radius, theta, z) to Cartesian coordinates, smooths the
surface, closes it, and exports the mesh.

## Design

The stepper housings, lift, spin plate, and limiters were modelled in Fusion 360 and printed. The
Mark 2 design files, firmware, and reconstruction script live in the repository.
