"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * A quiet orbital study in the About header: three line rings and a small
 * wireframe core, turning slowly and leaning toward the pointer.
 * Rendered only in the browser, paused when off screen, skipped for reduced motion.
 */
export default function OrbitField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 6.6);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute("aria-hidden", "true");
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const strong = new THREE.LineBasicMaterial({
      color: 0xff5a2e,
      transparent: true,
      opacity: 0.9,
    });
    const soft = new THREE.LineBasicMaterial({
      color: 0xf0ede3,
      transparent: true,
      opacity: 0.28,
    });
    const ink = new THREE.LineBasicMaterial({
      color: 0xd6ff4b,
      transparent: true,
      opacity: 0.72,
    });

    const ring = (radius: number, material: THREE.LineBasicMaterial, segments: number) => {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < segments; i += 1) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0));
      }
      return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material);
    };

    const ringA = ring(1.08, strong, 128);
    const ringB = ring(1.48, soft, 160);
    const ringC = ring(1.9, soft, 192);

    ringA.rotation.set(1.18, 0.18, 0);
    ringB.rotation.set(0.52, 1.05, 0.36);
    ringC.rotation.set(-0.42, 0.26, -0.72);

    group.add(ringA, ringB, ringC);

    const core = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.44, 0)),
      ink,
    );
    group.add(core);

    const nodeGeometry = new THREE.SphereGeometry(0.035, 12, 12);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5a2e,
      transparent: true,
      opacity: 0.9,
    });

    const nodes = [
      { radius: 1.08, angle: 0.4, axis: "a" },
      { radius: 1.48, angle: 2.4, axis: "b" },
      { radius: 1.9, angle: 4.3, axis: "c" },
    ].map(({ radius, angle, axis }) => {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.userData.axis = axis;
      node.userData.radius = radius;
      node.userData.angle = angle;
      group.add(node);
      return node;
    });

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    const onPointer = (event: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      target.x = Math.max(-1, Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2));
      target.y = Math.max(-1, Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2));
    };

    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (width === 0 || height === 0) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    resize();

    let visible = true;
    const visibility = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    visibility.observe(host);

    if (finePointer) window.addEventListener("pointermove", onPointer, { passive: true });

    const start = performance.now();
    let raf = 0;

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;

      const time = (performance.now() - start) / 1000;

      current.x += (target.x - current.x) * 0.04;
      current.y += (target.y - current.y) * 0.04;

      group.rotation.y = time * 0.075 + current.x * 0.22;
      group.rotation.x = Math.sin(time * 0.11) * 0.1 + current.y * 0.16;

      ringA.rotation.z = time * 0.05;
      ringB.rotation.z = -time * 0.038;
      ringC.rotation.z = time * 0.026;

      core.rotation.y = -time * 0.2;
      core.rotation.x = time * 0.11;

      for (const node of nodes) {
        const radius = node.userData.radius as number;
        const angle = (node.userData.angle as number) + time * 0.08;
        node.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
        node.position.applyEuler(
          node.userData.axis === "a"
            ? ringA.rotation
            : node.userData.axis === "b"
              ? ringB.rotation
              : ringC.rotation,
        );
      }

      renderer.render(scene, camera);
    };

    tick();

    return () => {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resizeObserver.disconnect();
      if (finePointer) window.removeEventListener("pointermove", onPointer);

      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line) {
          object.geometry.dispose();
        }
      });
      strong.dispose();
      soft.dispose();
      ink.dispose();
      nodeGeometry.dispose();
      nodeMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="orbit-field" aria-hidden="true" />;
}
