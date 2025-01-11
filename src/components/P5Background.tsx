"use client";

import dynamic from "next/dynamic";
import React from "react";

const Sketch = dynamic(() => import("react-p5"), { ssr: false });

export function P5Background() {
  let numEllipses = 5;
  let radius = 10;
  let angleStep = 0;

  const setup = (p5: any, canvasParentRef: any) => {
    p5.createCanvas(window.innerWidth, window.innerHeight).parent(canvasParentRef);
  };

  const draw = (p5: any) => {
    p5.background(0, 15);
    angleStep = p5.mouseX * 0.01;

    for (let i = 0; i < numEllipses; i++) {
      let angle = (i * p5.TWO_PI) / numEllipses + p5.frameCount * angleStep;
      let x = p5.width / 2 + p5.cos(angle) * radius;
      let y = p5.height / 2 + p5.sin(angle) * radius;

      p5.strokeWeight(1);
      p5.stroke(255, 100, 200);
      p5.noFill();
      p5.ellipse(x, y, radius * 2, radius * 2);

      if (p5.keyIsDown(87)) {
        radius += p5.mouseY * 0.01;
      } else if (p5.keyIsDown(83)) {
        radius -= p5.mouseY * 0.01;
      }
    }
  };

  const windowResized = (p5: any) => {
    p5.resizeCanvas(window.innerWidth, window.innerHeight);
  };

  return <Sketch setup={setup} draw={draw} windowResized={windowResized} />;
};

