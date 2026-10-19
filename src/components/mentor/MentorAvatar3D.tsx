import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export type AvatarVoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface MentorAvatar3DProps {
  isSpeaking?: boolean;
  isThinking?: boolean;
  isListening?: boolean;
  voiceState?: AvatarVoiceState;
  onAvatarClick?: () => void;
}

export const MentorAvatar3D: React.FC<MentorAvatar3DProps> = ({
  isSpeaking = false,
  isThinking = false,
  isListening = false,
  voiceState = 'idle'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [cameraView, setCameraView] = useState<'portrait' | 'close' | 'angle'>('portrait');

  // Determine effective state
  const effectiveSpeaking = isSpeaking || voiceState === 'speaking';
  const effectiveThinking = isThinking || voiceState === 'thinking';
  const effectiveListening = isListening || voiceState === 'listening';

  // Mutable state for the 60fps render loop
  const stateRef = useRef({
    isSpeaking: effectiveSpeaking,
    isThinking: effectiveThinking,
    isListening: effectiveListening,
    mouseTarget: { x: 0, y: 0 }
  });

  useEffect(() => {
    stateRef.current.isSpeaking = effectiveSpeaking;
    stateRef.current.isThinking = effectiveThinking;
    stateRef.current.isListening = effectiveListening;
  }, [effectiveSpeaking, effectiveThinking, effectiveListening]);

  // Controls & Camera refs for preset buttons
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  const resetCamera = (view: 'portrait' | 'close' | 'angle') => {
    setCameraView(view);
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    if (!camera || !controls) return;

    if (view === 'portrait') {
      controls.target.set(0, 0.05, 0);
      camera.position.set(0, 0.35, 2.4);
    } else if (view === 'close') {
      controls.target.set(0, 0.25, 0);
      camera.position.set(0, 0.35, 1.6);
    } else if (view === 'angle') {
      controls.target.set(0, 0.05, 0);
      camera.position.set(1.4, 0.45, 2.0);
    }
    controls.update();
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 50);
    camera.position.set(0, 0.35, 2.4);
    cameraRef.current = camera;

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 3. OrbitControls (Smooth mouse & touch 3D rotation)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enableZoom = true;
    controls.minDistance = 1.3;
    controls.maxDistance = 3.6;
    controls.minPolarAngle = Math.PI / 3.4;
    controls.maxPolarAngle = Math.PI / 1.7;
    controls.minAzimuthAngle = -Math.PI / 2.2;
    controls.maxAzimuthAngle = Math.PI / 2.2;
    controls.target.set(0, 0.05, 0);
    controls.update();
    controlsRef.current = controls;

    // 4. Subtle Lavender & Purple Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfaf5ff, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(2, 3, 3);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xddd6fe, 1.0);
    fillLight.position.set(-2, 1.5, 2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xa855f7, 3.2, 10);
    rimLight.position.set(0, 2.5, -2);
    scene.add(rimLight);

    const pedestalLight = new THREE.PointLight(0xc084fc, 1.2, 5);
    pedestalLight.position.set(0, -0.8, 1.5);
    scene.add(pedestalLight);

    // ================= 5. BUILD COMPOSITE 3D VIRTUAL HUMAN AVATAR =================
    const avatarGroup = new THREE.Group();
    avatarGroup.position.set(0, -0.2, 0);
    scene.add(avatarGroup);

    // Materials
    const skinMaterial = new THREE.MeshStandardMaterial({
      color: 0xfce7de,
      roughness: 0.55,
      metalness: 0.05
    });

    const hairMaterial = new THREE.MeshStandardMaterial({
      color: 0x2e1065, // Deep purple-navy
      roughness: 0.4,
      metalness: 0.2
    });

    const blazerMaterial = new THREE.MeshStandardMaterial({
      color: 0xfaf5ff, // Soft lavender-white
      roughness: 0.35,
      metalness: 0.1
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: 0x7c3aed, // Vibrant purple trim
      roughness: 0.25,
      metalness: 0.6
    });

    const eyeWhiteMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.1
    });

    const irisMaterial = new THREE.MeshStandardMaterial({
      color: 0x6366f1, // Indigo violet iris
      roughness: 0.2,
      metalness: 0.4
    });

    const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x0f172a });

    const eyelidMaterial = new THREE.MeshStandardMaterial({
      color: 0xf4d4c7,
      roughness: 0.6
    });

    const haloMaterial = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0x9333ea,
      emissiveIntensity: 1.4,
      transparent: true,
      opacity: 0.75,
      roughness: 0.2
    });

    const earpieceMaterial = new THREE.MeshStandardMaterial({
      color: 0xc084fc,
      emissive: 0xa855f7,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.8
    });

    const glassesFrameMaterial = new THREE.MeshStandardMaterial({
      color: 0x7c3aed,
      metalness: 0.85,
      roughness: 0.15
    });

    // --- A. Torso & Shoulders ---
    const torsoGroup = new THREE.Group();
    torsoGroup.position.set(0, -0.65, 0);
    avatarGroup.add(torsoGroup);

    // Main Blazer Body
    const blazerBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.55, 0.72, 0.85, 32),
      blazerMaterial
    );
    torsoGroup.add(blazerBody);

    // Shoulders
    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), blazerMaterial);
    leftShoulder.position.set(-0.58, 0.25, 0);
    torsoGroup.add(leftShoulder);

    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), blazerMaterial);
    rightShoulder.position.set(0.58, 0.25, 0);
    torsoGroup.add(rightShoulder);

    // Lapel / V-Neck Center
    const lapel = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.08), trimMaterial);
    lapel.position.set(0, 0.22, 0.28);
    lapel.rotation.x = 0.2;
    torsoGroup.add(lapel);

    // Collar lines
    const leftCollar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.04), trimMaterial);
    leftCollar.position.set(-0.18, 0.26, 0.32);
    leftCollar.rotation.z = -0.35;
    torsoGroup.add(leftCollar);

    const rightCollar = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.04), trimMaterial);
    rightCollar.position.set(0.18, 0.26, 0.32);
    rightCollar.rotation.z = 0.35;
    torsoGroup.add(rightCollar);

    // AI Mirror Insignia Badge
    const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.02, 6), trimMaterial);
    badge.position.set(0.3, 0.18, 0.4);
    badge.rotation.x = Math.PI / 2;
    torsoGroup.add(badge);

    // --- B. Neck ---
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.19, 0.28, 24), skinMaterial);
    neck.position.set(0, -0.16, 0);
    avatarGroup.add(neck);

    // --- C. Head Group ---
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.28, 0);
    avatarGroup.add(headGroup);

    // Head Base
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.42, 32, 32), skinMaterial);
    headGroup.add(headMesh);

    // Jaw / Chin (animated during speech lip-sync!)
    const jawMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.16, 0.3, 24), skinMaterial);
    jawMesh.position.set(0, -0.18, 0.1);
    jawMesh.rotation.x = 0.4;
    headGroup.add(jawMesh);

    // Smiling Lips (animated scale and position during lip-sync!)
    const lips = new THREE.Mesh(
      new THREE.TorusGeometry(0.07, 0.015, 12, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xe17b77, roughness: 0.4 })
    );
    lips.position.set(0, -0.22, 0.36);
    headGroup.add(lips);

    // Inner mouth cavity backing for visual depth during speech
    const mouthCavity = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.04, 0.02),
      new THREE.MeshBasicMaterial({ color: 0x3b0764 })
    );
    mouthCavity.position.set(0, -0.22, 0.34);
    mouthCavity.visible = false;
    headGroup.add(mouthCavity);

    // Nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.14, 16), skinMaterial);
    nose.position.set(0, -0.05, 0.4);
    nose.rotation.x = 0.2;
    headGroup.add(nose);

    // Cheeks
    const leftCheek = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfda4af, transparent: true, opacity: 0.35 })
    );
    leftCheek.position.set(-0.24, -0.12, 0.3);
    headGroup.add(leftCheek);

    const rightCheek = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xfda4af, transparent: true, opacity: 0.35 })
    );
    rightCheek.position.set(0.24, -0.12, 0.3);
    headGroup.add(rightCheek);

    // --- Eyes with Eyelids for Blinking ---
    const createEye = (xPos: number) => {
      const eyeGroup = new THREE.Group();
      eyeGroup.position.set(xPos, 0.03, 0.34);

      // Sclera
      const eyeball = new THREE.Mesh(new THREE.SphereGeometry(0.07, 24, 24), eyeWhiteMaterial);
      eyeGroup.add(eyeball);

      // Iris
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.042, 24), irisMaterial);
      iris.position.set(0, 0, 0.05);
      eyeGroup.add(iris);

      // Pupil
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.022, 24), pupilMaterial);
      pupil.position.set(0, 0, 0.052);
      eyeGroup.add(pupil);

      // Glint
      const glint = new THREE.Mesh(
        new THREE.CircleGeometry(0.008, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      glint.position.set(0.015, 0.015, 0.053);
      eyeGroup.add(glint);

      // Eyelid for Blinking (Hemisphere)
      const eyelid = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        eyelidMaterial
      );
      eyelid.position.set(0, 0.03, 0.01);
      eyelid.scale.set(1, 0.01, 1);
      eyeGroup.add(eyelid);

      headGroup.add(eyeGroup);
      return eyelid;
    };

    const leftEyelid = createEye(-0.15);
    const rightEyelid = createEye(0.15);

    // Eyebrows
    const leftEyebrow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.03), hairMaterial);
    leftEyebrow.position.set(-0.15, 0.14, 0.36);
    leftEyebrow.rotation.z = 0.1;
    headGroup.add(leftEyebrow);

    const rightEyebrow = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.03), hairMaterial);
    rightEyebrow.position.set(0.15, 0.14, 0.36);
    rightEyebrow.rotation.z = -0.1;
    headGroup.add(rightEyebrow);

    // Sleek Academic Glasses
    const glassesGroup = new THREE.Group();
    glassesGroup.position.set(0, 0.03, 0.41);
    const leftRing = new THREE.Mesh(new THREE.RingGeometry(0.075, 0.09, 32), glassesFrameMaterial);
    leftRing.position.set(-0.15, 0, 0);
    glassesGroup.add(leftRing);

    const rightRing = new THREE.Mesh(new THREE.RingGeometry(0.075, 0.09, 32), glassesFrameMaterial);
    rightRing.position.set(0.15, 0, 0);
    glassesGroup.add(rightRing);

    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.015, 0.01), glassesFrameMaterial);
    bridge.position.set(0, 0.01, 0);
    glassesGroup.add(bridge);
    headGroup.add(glassesGroup);

    // Hair Elements
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.46, 32, 32), hairMaterial);
    hairTop.position.set(0, 0.18, -0.06);
    headGroup.add(hairTop);

    const hairLeft = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.55, 16), hairMaterial);
    hairLeft.position.set(-0.34, 0.02, 0.02);
    hairLeft.rotation.z = 0.2;
    headGroup.add(hairLeft);

    const hairRight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.18, 0.55, 16), hairMaterial);
    hairRight.position.set(0.34, 0.02, 0.02);
    hairRight.rotation.z = -0.2;
    headGroup.add(hairRight);

    const hairBangs = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, 0.18, 24), hairMaterial);
    hairBangs.position.set(0, 0.34, 0.28);
    hairBangs.rotation.x = -0.5;
    headGroup.add(hairBangs);

    // Headset
    const headsetArch = new THREE.Mesh(
      new THREE.TorusGeometry(0.43, 0.025, 16, 32, Math.PI),
      glassesFrameMaterial
    );
    headsetArch.position.set(0, 0.18, 0.08);
    headsetArch.rotation.x = 0.4;
    headGroup.add(headsetArch);

    const leftEarpieceGlow = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), earpieceMaterial);
    leftEarpieceGlow.position.set(-0.46, 0.02, 0);
    headGroup.add(leftEarpieceGlow);

    const rightEarpieceGlow = new THREE.Mesh(new THREE.SphereGeometry(0.04, 16, 16), earpieceMaterial);
    rightEarpieceGlow.position.set(0.46, 0.02, 0);
    headGroup.add(rightEarpieceGlow);

    // Floating Holographic Neural Halo
    const haloMesh = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.015, 16, 48), haloMaterial);
    haloMesh.position.set(0, 0.72, -0.05);
    headGroup.add(haloMesh);

    // --- D. Floating Pedestal & Contact Grounding Shadow ---
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.set(0, -1.15, 0);
    avatarGroup.add(pedestalGroup);

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.95, 0.12, 36), blazerMaterial);
    pedestalGroup.add(pedestal);

    const pedestalRim = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.02, 36), trimMaterial);
    pedestalRim.position.y = 0.06;
    pedestalGroup.add(pedestalRim);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.2, 2.2),
      new THREE.MeshBasicMaterial({ color: 0x4c1d95, transparent: true, opacity: 0.18, depthWrite: false })
    );
    shadowPlane.position.set(0, -0.07, 0);
    shadowPlane.rotation.x = -Math.PI / 2;
    pedestalGroup.add(shadowPlane);

    // --- Pointer Tracking Listener ---
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseTarget = { x: x * 0.4, y: y * 0.25 };
    };
    container.addEventListener('mousemove', handlePointerMove);

    // --- Animation Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let blinkTimer = 0;
    let isBlinking = false;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Controls update for smooth damping
      controls.update();

      const { isSpeaking, isThinking, isListening } = stateRef.current;

      // 1. Idle Breathing Animation (subtle torso expansion and vertical bob)
      const breath = Math.sin(time * 1.8) * 0.025;
      avatarGroup.position.y = breath - 0.2;

      // 2. Head tracking toward cursor with state-driven posture
      let targetRotationY = stateRef.current.mouseTarget.x + Math.sin(time * 0.8) * 0.04;
      let targetRotationX = -stateRef.current.mouseTarget.y * 0.5 + Math.cos(time * 1.2) * 0.02;
      let targetRotationZ = 0;

      // Speech cadence nod
      if (isSpeaking) {
        targetRotationX += Math.sin(time * 6) * 0.035;
      }

      // Thinking posture: slight head tilt and upward reflective gaze
      if (isThinking) {
        targetRotationZ = 0.12;
        targetRotationX -= 0.06;
      }

      // Attentive Listening posture: head leans forward and tilts sympathetically
      if (isListening) {
        targetRotationZ = -0.09;
        targetRotationX += 0.05;
        targetRotationY += 0.04;
      }

      headGroup.rotation.y = THREE.MathUtils.damp(headGroup.rotation.y, targetRotationY, 4, delta);
      headGroup.rotation.x = THREE.MathUtils.damp(headGroup.rotation.x, targetRotationX, 4, delta);
      headGroup.rotation.z = THREE.MathUtils.damp(headGroup.rotation.z, targetRotationZ, 3, delta);

      // 3. Realistic Dynamic Lip-Sync Speech Animation
      if (isSpeaking) {
        mouthCavity.visible = true;
        // Multi-frequency wave pattern simulating natural vowels and consonants
        const visemeWave = Math.abs(Math.sin(time * 15) * 0.65 + Math.sin(time * 23) * 0.35);
        const targetLipScaleY = 1.0 + visemeWave * 1.1;
        const targetLipScaleX = 1.0 - visemeWave * 0.25;
        const targetJawY = -0.18 - visemeWave * 0.035;
        const targetLipY = -0.22 - visemeWave * 0.015;

        lips.scale.y = THREE.MathUtils.damp(lips.scale.y, targetLipScaleY, 14, delta);
        lips.scale.x = THREE.MathUtils.damp(lips.scale.x, targetLipScaleX, 14, delta);
        jawMesh.position.y = THREE.MathUtils.damp(jawMesh.position.y, targetJawY, 14, delta);
        lips.position.y = THREE.MathUtils.damp(lips.position.y, targetLipY, 14, delta);
      } else {
        mouthCavity.visible = false;
        // Smooth return to relaxed gentle smile
        lips.scale.y = THREE.MathUtils.damp(lips.scale.y, 1.0, 8, delta);
        lips.scale.x = THREE.MathUtils.damp(lips.scale.x, 1.0, 8, delta);
        jawMesh.position.y = THREE.MathUtils.damp(jawMesh.position.y, -0.18, 8, delta);
        lips.position.y = THREE.MathUtils.damp(lips.position.y, -0.22, 8, delta);
      }

      // 4. Periodic Natural Blinking (every 3.8s)
      blinkTimer += delta;
      if (blinkTimer > 3.8 && !isBlinking) {
        isBlinking = true;
        blinkTimer = 0;
      }

      if (isBlinking) {
        const blinkProgress = blinkTimer / 0.18;
        if (blinkProgress >= 1) {
          isBlinking = false;
          blinkTimer = 0;
          leftEyelid.scale.y = 0.01;
          rightEyelid.scale.y = 0.01;
        } else {
          const scale = Math.sin(blinkProgress * Math.PI);
          leftEyelid.scale.y = Math.max(0.01, scale);
          rightEyelid.scale.y = Math.max(0.01, scale);
        }
      }

      // 5. Halo & Earpiece Glowing Pulses based on state
      haloMesh.rotation.z = time * 0.5;
      haloMesh.rotation.x = Math.PI / 2.2 + Math.sin(time * 1.5) * 0.05;

      if (isListening) {
        haloMaterial.color.setHex(0x06b6d4); // Cyan wave when listening
        haloMaterial.emissive.setHex(0x0891b2);
        haloMaterial.emissiveIntensity = 2.0 + Math.sin(time * 10) * 0.8;

        earpieceMaterial.color.setHex(0x06b6d4);
        earpieceMaterial.emissive.setHex(0x0891b2);
        earpieceMaterial.emissiveIntensity = 2.4 + Math.sin(time * 12) * 1.0;
      } else if (isThinking) {
        haloMaterial.color.setHex(0xc084fc);
        haloMaterial.emissive.setHex(0x9333ea);
        haloMaterial.emissiveIntensity = 2.5 + Math.sin(time * 8) * 0.9;

        earpieceMaterial.color.setHex(0xc084fc);
        earpieceMaterial.emissive.setHex(0x9333ea);
        earpieceMaterial.emissiveIntensity = 2.2 + Math.sin(time * 8) * 0.6;
      } else if (isSpeaking) {
        haloMaterial.color.setHex(0xa855f7);
        haloMaterial.emissive.setHex(0x7c3aed);
        haloMaterial.emissiveIntensity = 1.8 + Math.sin(time * 14) * 0.6;

        earpieceMaterial.color.setHex(0xc084fc);
        earpieceMaterial.emissive.setHex(0xa855f7);
        earpieceMaterial.emissiveIntensity = 2.8 + Math.sin(time * 16) * 1.2;
      } else {
        haloMaterial.color.setHex(0xa855f7);
        haloMaterial.emissive.setHex(0x9333ea);
        haloMaterial.emissiveIntensity = 1.2 + Math.sin(time * 2) * 0.3;

        earpieceMaterial.color.setHex(0xc084fc);
        earpieceMaterial.emissive.setHex(0xa855f7);
        earpieceMaterial.emissiveIntensity = 1.4 + Math.sin(time * 2.5) * 0.4;
      }

      renderer.render(scene, camera);
    };

    animate();

    // ResizeObserver for responsive scaling
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth > 0 && newHeight > 0) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handlePointerMove);
      resizeObserver.disconnect();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] sm:min-h-[440px] bg-gradient-to-b from-[#F5F3FF] via-[#FAF9FD] to-[#EDE9FE]/50 rounded-3xl overflow-hidden flex flex-col justify-between border border-purple-100 shadow-sm">
      {/* Top Header Badge & State Display */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-purple-100 shadow-2xs">
          {effectiveListening ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              <span className="text-xs font-bold text-rose-700">Listening to you...</span>
            </div>
          ) : effectiveThinking ? (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-violet-600"></span>
              </span>
              <span className="text-xs font-bold text-purple-700">Thinking & Analyzing...</span>
            </div>
          ) : effectiveSpeaking ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 h-3">
                <span className="w-0.5 h-3 bg-purple-600 animate-pulse rounded-full" />
                <span className="w-0.5 h-2 bg-purple-600 animate-pulse [animation-delay:0.15s] rounded-full" />
                <span className="w-0.5 h-3.5 bg-purple-600 animate-pulse [animation-delay:0.3s] rounded-full" />
              </div>
              <span className="text-xs font-bold text-purple-700">Dr. Elena is Speaking</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
              <span className="text-xs font-bold text-slate-800">
                Dr. Elena · 3D Virtual Mentor
              </span>
            </div>
          )}
        </div>

        {/* Quick Camera Angle Buttons */}
        <div className="flex items-center gap-1 pointer-events-auto bg-white/90 backdrop-blur-md p-1 rounded-xl border border-purple-100 shadow-2xs">
          <button
            onClick={() => resetCamera('portrait')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
              cameraView === 'portrait'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Portrait
          </button>
          <button
            onClick={() => resetCamera('close')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
              cameraView === 'close'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Close-Up
          </button>
          <button
            onClick={() => resetCamera('angle')}
            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-all ${
              cameraView === 'angle'
                ? 'bg-purple-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3/4 View
          </button>
        </div>
      </div>

      {/* 3D Canvas Mounting Container */}
      <div
        ref={mountRef}
        className="w-full flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
      />

      {/* Bottom Control & Status Strip */}
      <div className="px-4 py-2.5 bg-white/80 backdrop-blur-md border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-500 z-10">
        <span className="flex items-center gap-1.5">
          <span className="font-semibold text-purple-700">Drag or swipe</span> to view from any angle · Scroll to zoom
        </span>
        <span className="hidden sm:inline font-medium text-slate-400">
          Autonomous Lip-Sync & Idle Active
        </span>
      </div>
    </div>
  );
};
