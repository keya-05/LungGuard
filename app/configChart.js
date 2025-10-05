// app/configChart.js
import React from 'react';
import { Dimensions } from 'react-native';
import Svg, { Circle, Defs, Line, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

/**
 * Returns the color based on the y-axis value
 */
export const getColorForValue = (value) => {
  if (value > 25) {
    return '#4CAF50'; // Green
  } else if (value >= 15 && value <= 25) {
    return '#FFC107'; // Yellow
  } else {
    return '#F44336'; // Red
  }
};

/**
 * Get interpolated color between two colors
 */
const interpolateColor = (color1, color2, factor) => {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);
  
  const r1 = (c1 >> 16) & 0xff;
  const g1 = (c1 >> 8) & 0xff;
  const b1 = c1 & 0xff;
  
  const r2 = (c2 >> 16) & 0xff;
  const g2 = (c2 >> 8) & 0xff;
  const b2 = c2 & 0xff;
  
  const r = Math.round(r1 + factor * (r2 - r1));
  const g = Math.round(g1 + factor * (g2 - g1));
  const b = Math.round(b1 + factor * (b2 - b1));
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

/**
 * Custom ColoredLineChart Component
 */
export const ColoredLineChart = ({ data, width, height, colors }) => {
  const chartWidth = width || Dimensions.get('window').width - 40;
  const chartHeight = height || 220;
  const padding = { top: 20, right: 20, bottom: 40, left: 40 };
  
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;
  
  // Extract scores and labels
  const scores = data.map(item => item.score);
  const labels = data.map(item => item.date);
  
  // Calculate min and max for scaling
  const minScore = 0;
  const maxScore = Math.max(...scores, 30); // At least 30 for better visualization
  
  // Scale functions
  const xScale = (index) => padding.left + (index / (scores.length - 1)) * plotWidth;
  const yScale = (value) => padding.top + plotHeight - ((value - minScore) / (maxScore - minScore)) * plotHeight;
  
  // Generate path for the line
  const generatePath = () => {
    let path = '';
    scores.forEach((score, index) => {
      const x = xScale(index);
      const y = yScale(score);
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        // Bezier curve for smooth line
        const prevX = xScale(index - 1);
        const prevY = yScale(scores[index - 1]);
        const cpX = (prevX + x) / 2;
        path += ` Q ${cpX} ${prevY}, ${x} ${y}`;
      }
    });
    return path;
  };
  
  // Generate multiple path segments with different colors
  const generateColoredSegments = () => {
    const segments = [];
    
    for (let i = 0; i < scores.length - 1; i++) {
      const x1 = xScale(i);
      const y1 = yScale(scores[i]);
      const x2 = xScale(i + 1);
      const y2 = yScale(scores[i + 1]);
      
      const color1 = getColorForValue(scores[i]);
      const color2 = getColorForValue(scores[i + 1]);
      
      // Create gradient for this segment
      const segmentColor = color1 === color2 ? color1 : interpolateColor(color1, color2, 0.5);
      
      // Bezier curve control point
      const cpX = (x1 + x2) / 2;
      const path = `M ${x1} ${y1} Q ${cpX} ${y1}, ${x2} ${y2}`;
      
      segments.push({
        path,
        color: segmentColor,
        startColor: color1,
        endColor: color2,
        key: `segment-${i}`
      });
    }
    
    return segments;
  };
  
  const segments = generateColoredSegments();
  
  // Generate grid lines
  const horizontalLines = [];
  const numLines = 5;
  for (let i = 0; i <= numLines; i++) {
    const y = padding.top + (i / numLines) * plotHeight;
    const value = maxScore - (i / numLines) * (maxScore - minScore);
    horizontalLines.push({
      y,
      value: Math.round(value),
      key: `h-line-${i}`
    });
  }
  
  return (
    <Svg width={chartWidth} height={chartHeight}>
      <Defs>
        {segments.map((segment, index) => (
          <LinearGradient
            key={`gradient-${index}`}
            id={`gradient-${index}`}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <Stop offset="0%" stopColor={segment.startColor} stopOpacity="1" />
            <Stop offset="100%" stopColor={segment.endColor} stopOpacity="1" />
          </LinearGradient>
        ))}
      </Defs>
      
      {/* Horizontal grid lines */}
      {horizontalLines.map((line) => (
        <React.Fragment key={line.key}>
          <Line
            x1={padding.left}
            y1={line.y}
            x2={chartWidth - padding.right}
            y2={line.y}
            stroke={colors?.border || '#e0e0e0'}
            strokeWidth="1"
            strokeDasharray="4,4"
          />
          <SvgText
            x={padding.left - 10}
            y={line.y + 5}
            fontSize="10"
            fill={colors?.text || '#666'}
            textAnchor="end"
          >
            {line.value}
          </SvgText>
        </React.Fragment>
      ))}
      
      {/* Reference lines for thresholds */}
      <Line
        x1={padding.left}
        y1={yScale(25)}
        x2={chartWidth - padding.right}
        y2={yScale(25)}
        stroke="#4CAF50"
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.3"
      />
      <Line
        x1={padding.left}
        y1={yScale(15)}
        x2={chartWidth - padding.right}
        y2={yScale(15)}
        stroke="#F44336"
        strokeWidth="1"
        strokeDasharray="2,2"
        opacity="0.3"
      />
      
      {/* Colored line segments */}
      {segments.map((segment, index) => (
        <Path
          key={segment.key}
          d={segment.path}
          stroke={`url(#gradient-${index})`}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      ))}
      
      {/* Data points */}
      {scores.map((score, index) => (
        <Circle
          key={`point-${index}`}
          cx={xScale(index)}
          cy={yScale(score)}
          r="5"
          fill={getColorForValue(score)}
          stroke={colors?.card || '#fff'}
          strokeWidth="2"
        />
      ))}
      
      {/* X-axis labels */}
      {labels.map((label, index) => (
        <SvgText
          key={`label-${index}`}
          x={xScale(index)}
          y={chartHeight - padding.bottom + 25}
          fontSize="12"
          fill={colors?.text || '#666'}
          textAnchor="middle"
        >
          {label}
        </SvgText>
      ))}
    </Svg>
  );
};

/**
 * Get legend items for the color zones
 */
export const getLegendItems = () => [
  { color: '#4CAF50', label: 'Good (>25)', range: 'Above 25' },
  { color: '#FFC107', label: 'Moderate (15-25)', range: '15-25' },
  { color: '#F44336', label: 'Poor (<15)', range: 'Below 15' }
];

export default {
  ColoredLineChart,
  getColorForValue,
  getLegendItems,
};