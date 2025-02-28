export type Point = {
  x: number
  y: number
}

export function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number): Point {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  }
}

export function getTextRotation(angle: number, level: number): number {
  // For center text only (level 0)
  if (level === 0) {
    return 0
  }

  // Normalize angle to 0-360 range
  const normalizedAngle = ((angle % 360) + 360) % 360

  // For angles 0-180: read center-out
  // For angles 180-360: read outside-in
  if (normalizedAngle >= 180) {
    return angle + 90 // Reverse text direction for bottom half
  }

  return angle - 90 // Original direction for top half
}

export function getTextPosition(
  centerX: number,
  centerY: number,
  radius: number,
  angle: number,
  level: number,
): { x: number; y: number; rotation: number } {
  const point = polarToCartesian(centerX, centerY, radius, angle)
  const rotation = getTextRotation(angle, level)
  return { x: point.x, y: point.y, rotation }
}

export function createArcPath(
  startAngle: number,
  endAngle: number,
  innerRadius: number,
  outerRadius: number,
  centerX: number,
  centerY: number,
): string {
  const start = polarToCartesian(centerX, centerY, outerRadius, endAngle)
  const end = polarToCartesian(centerX, centerY, outerRadius, startAngle)
  const innerStart = polarToCartesian(centerX, centerY, innerRadius, endAngle)
  const innerEnd = polarToCartesian(centerX, centerY, innerRadius, startAngle)

  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1

  return [
    `M ${start.x} ${start.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 1 ${innerStart.x} ${innerStart.y}`,
    `L ${start.x} ${start.y}`,
  ].join(" ")
} 