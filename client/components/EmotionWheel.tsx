"use client"

import React, { useState, useEffect, useRef } from "react";
import { PRIMARY_EMOTIONS } from "../types/emotions";
import { createArcPath, getTextPosition } from "../utils/wheel-utils";

const DIMENSIONS = {
  CENTER: 400,
  CORE_RADIUS: 40.5,
  LAYER1_RADIUS: 120,
  LAYER2_RADIUS: 240,
  LAYER3_RADIUS: 350,
}

// Zoom configuration
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.1;

// Helper function to safely check if we're on Mac
const isMacOS = () => {
  if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
    return navigator.platform?.includes('Mac') || false;
  }
  return false;
};

export default function EmotionWheel() {
  const [zoom, setZoom] = useState(1);
  const [showZoomInstructions, setShowZoomInstructions] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  // Store OS detection in state to avoid hydration mismatch
  const [isMac, setIsMac] = useState(false);
  
  // State for drag-to-move functionality
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Set OS detection after component mounts
  useEffect(() => {
    setIsMac(isMacOS());
  }, []);

  // Handle wheel events for zooming
  const handleWheel = (e: React.WheelEvent) => {
    // Only zoom if Command (Mac) or Control (Windows/Linux) key is pressed
    if (e.metaKey || e.ctrlKey) {
      e.preventDefault();
      
      // Determine zoom direction
      const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
      
      // Calculate new zoom level within bounds
      setZoom(prevZoom => {
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prevZoom + delta));
        return newZoom;
      });
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start dragging on left mouse button
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      setPosition({ x: newX, y: newY });
    }
  };

  // Handle mouse up to stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset position to center
  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
  };

  // Reset both zoom and position
  const resetAll = () => {
    setZoom(1);
    resetPosition();
  };

  // Handle keyboard shortcuts for zooming
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Space key resets zoom and position
      if (e.code === 'Space') {
        e.preventDefault();
        resetAll();
      }
      
      // Only handle if Cmd/Ctrl is pressed
      if (e.metaKey || e.ctrlKey) {
        // Zoom in with Cmd/Ctrl + Plus
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          setZoom(prevZoom => Math.min(MAX_ZOOM, prevZoom + ZOOM_STEP));
        }
        // Zoom out with Cmd/Ctrl + Minus
        else if (e.key === "-" || e.key === "_") {
          e.preventDefault();
          setZoom(prevZoom => Math.max(MIN_ZOOM, prevZoom - ZOOM_STEP));
        }
        // Reset zoom with Cmd/Ctrl + 0
        else if (e.key === "0") {
          e.preventDefault();
          resetAll();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [resetAll]);

  // Add event listener to prevent default browser zoom behavior
  useEffect(() => {
    const container = containerRef.current;
    
    const preventDefaultZoom = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };
    
    if (container) {
      container.addEventListener('wheel', preventDefaultZoom, { passive: false });
    }
    
    // Auto-hide instructions after 10 seconds
    const timer = setTimeout(() => {
      setShowZoomInstructions(false);
    }, 10000);
    
    return () => {
      if (container) {
        container.removeEventListener('wheel', preventDefaultZoom);
      }
      clearTimeout(timer);
    };
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        setPosition({ x: newX, y: newY });
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    // Add global event listeners to handle mouse movements outside the component
    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart]);

  // Reset zoom to default level
  const resetZoom = () => {
    setZoom(1);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-[960px] h-[960px] max-w-full overflow-hidden"
      onWheel={handleWheel}
    >
      {/* Zoom and navigation instructions */}
      {showZoomInstructions && (
        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-lg shadow-md text-sm z-10 max-w-[250px]">
          <p className="font-medium mb-1">Controls:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Move:</strong> Click and drag to move the wheel</li>
            <li><strong>Zoom:</strong> Hold {isMac ? '⌘ Cmd' : 'Ctrl'} + Scroll</li>
            <li>{isMac ? '⌘ Cmd' : 'Ctrl'} + +/- to zoom in/out</li>
            <li>{isMac ? '⌘ Cmd' : 'Ctrl'} + 0 to reset view</li>
          </ul>
          <button 
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
            onClick={() => setShowZoomInstructions(false)}
          >
            ✕
          </button>
        </div>
      )}
      
      {/* Controls */}
      <div className="absolute bottom-4 right-4 bg-white/90 px-2 py-1 rounded-md text-xs flex items-center gap-2 z-10">
        <button 
          onClick={resetAll}
          className="text-blue-600 hover:text-blue-800 font-medium"
          title="Reset view"
        >
          Reset View
        </button>
        <span>{Math.round(zoom * 100)}%</span>
        {!showZoomInstructions && (
          <button
            onClick={() => setShowZoomInstructions(true)}
            className="ml-1 text-gray-500 hover:text-gray-700"
            title="Show instructions"
          >
            ?
          </button>
        )}
      </div>
      
      <div 
        className="absolute inset-0 cursor-grab transition-transform"
        style={{ 
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg 
          width="960" 
          height="960" 
          viewBox="0 0 800 800" 
          className="max-w-full"
          style={{
            transform: `scale(${zoom})`,
            transformOrigin: 'center',
            transition: zoom === 1 ? 'transform 0.3s ease-out' : 'transform 0.1s ease-out'
          }}
        >
          <defs>
            {PRIMARY_EMOTIONS.map((emotion) => {
              const angle = emotion.rotation
              const isBottomHalf = angle > 90 && angle < 270

              return (
                <linearGradient
                  key={`gradient-${emotion.name}`}
                  id={`gradient-${emotion.name}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                  gradientTransform={`
                    rotate(${angle + (isBottomHalf ? 180 : 0)}, 0.5, 0.5)
                    translate(${isBottomHalf ? -1 : 0}, 0)
                  `}
                  gradientUnits="objectBoundingBox"
                >
                  <stop offset="0%" stopColor={emotion.startColor} />
                  <stop offset="100%" stopColor={emotion.endColor} />
                </linearGradient>
              )
            })}
          </defs>

          {/* Render all emotion segments */}
          {PRIMARY_EMOTIONS.map((emotion) => {
            const segmentAngle = 60
            const startAngle = emotion.rotation
            const endAngle = startAngle + segmentAngle
            const midAngle = startAngle + segmentAngle / 2

            return (
              <g key={emotion.name}>
                {/* Primary emotion segment */}
                <path
                  d={createArcPath(
                    startAngle,
                    endAngle,
                    DIMENSIONS.CORE_RADIUS,
                    DIMENSIONS.LAYER1_RADIUS,
                    DIMENSIONS.CENTER,
                    DIMENSIONS.CENTER,
                  )}
                  fill={`url(#gradient-${emotion.name})`}
                  className="transition-all duration-200 hover:opacity-90"
                />

                {/* Layer 2: Secondary Emotions */}
                {emotion.children.map((child, index) => {
                  const childSegmentAngle = segmentAngle / emotion.children.length
                  const childStartAngle = startAngle + index * childSegmentAngle
                  const childMidAngle = childStartAngle + childSegmentAngle / 2

                  const textPos = getTextPosition(
                    DIMENSIONS.CENTER,
                    DIMENSIONS.CENTER,
                    (DIMENSIONS.LAYER1_RADIUS + DIMENSIONS.LAYER2_RADIUS) / 2,
                    childMidAngle,
                    2,
                  )

                  return (
                    <g key={child.name}>
                      {/* Layer 2 segment */}
                      <path
                        d={createArcPath(
                          childStartAngle,
                          childStartAngle + childSegmentAngle,
                          DIMENSIONS.LAYER1_RADIUS,
                          DIMENSIONS.LAYER2_RADIUS,
                          DIMENSIONS.CENTER,
                          DIMENSIONS.CENTER,
                        )}
                        fill={`url(#gradient-${emotion.name})`}
                        className="transition-all duration-200 hover:opacity-80"
                      />

                      {/* Layer 2 text */}
                      <text
                        x={textPos.x}
                        y={textPos.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                        className="fill-white text-xs font-medium pointer-events-none select-none"
                      >
                        {child.name}
                      </text>

                      {/* Layer 3: Tertiary Emotions */}
                      {child.children.map((tertiaryEmotion, tertiaryIndex) => {
                        const tertiarySegmentAngle = childSegmentAngle / child.children.length
                        const tertiaryStartAngle = childStartAngle + tertiaryIndex * tertiarySegmentAngle
                        const tertiaryMidAngle = tertiaryStartAngle + tertiarySegmentAngle / 2

                        const tertiaryTextPos = getTextPosition(
                          DIMENSIONS.CENTER,
                          DIMENSIONS.CENTER,
                          (DIMENSIONS.LAYER2_RADIUS + DIMENSIONS.LAYER3_RADIUS) / 2,
                          tertiaryMidAngle,
                          3,
                        )

                        return (
                          <g key={tertiaryEmotion}>
                            {/* Layer 3 segment */}
                            <path
                              d={createArcPath(
                                tertiaryStartAngle,
                                tertiaryStartAngle + tertiarySegmentAngle,
                                DIMENSIONS.LAYER2_RADIUS,
                                DIMENSIONS.LAYER3_RADIUS,
                                DIMENSIONS.CENTER,
                                DIMENSIONS.CENTER,
                              )}
                              fill={`url(#gradient-${emotion.name})`}
                              className="transition-all duration-200 hover:opacity-70"
                            />

                            {/* Layer 3 text */}
                            <text
                              x={tertiaryTextPos.x}
                              y={tertiaryTextPos.y}
                              textAnchor="middle"
                              dominantBaseline="middle"
                              transform={`rotate(${tertiaryTextPos.rotation}, ${tertiaryTextPos.x}, ${tertiaryTextPos.y})`}
                              className="fill-white text-[10px] font-medium pointer-events-none select-none"
                            >
                              {tertiaryEmotion}
                            </text>
                          </g>
                        )
                      })}
                    </g>
                  )
                })}

                {/* Primary emotion text */}
                {(() => {
                  const textPos = getTextPosition(
                    DIMENSIONS.CENTER,
                    DIMENSIONS.CENTER,
                    (DIMENSIONS.CORE_RADIUS + DIMENSIONS.LAYER1_RADIUS) / 2,
                    midAngle,
                    1,
                  )

                  return (
                    <text
                      x={textPos.x}
                      y={textPos.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${textPos.rotation}, ${textPos.x}, ${textPos.y})`}
                      className="fill-white text-sm font-medium pointer-events-none select-none"
                    >
                      {emotion.name}
                    </text>
                  )
                })()}
              </g>
            )
          })}

          {/* Core circle */}
          <circle cx={DIMENSIONS.CENTER} cy={DIMENSIONS.CENTER} r={DIMENSIONS.CORE_RADIUS} fill="#EAE7DC" />
          <text
            x={DIMENSIONS.CENTER}
            y={DIMENSIONS.CENTER}
            textAnchor="middle"
            className="text-sm font-medium fill-gray-600 pointer-events-none select-none"
          >
            <tspan x={DIMENSIONS.CENTER} dy="-0.7em">
              I&apos;m
            </tspan>
            <tspan x={DIMENSIONS.CENTER} dy="1.4em">
              Feeling
            </tspan>
          </text>
        </svg>
      </div>
    </div>
  )
} 