import React from "react";

export default function BrandLogo({
  width = 300,
  height = 110,
  topText = "Kancheepuram",
  bottomText = "S.M. Silks",
  yellow = "#F4DD3E",
  maroon = "#7F1D1D",
  topTextColor = "#1E3A8A",
}) {
  return (
    <svg
      width={width} height={height} viewBox="0 0 600 220"
      xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="smSilksTitle"
    >
      <title id="smSilksTitle">{`${topText} ${bottomText}`}</title>

      <rect x="0" y="0" width="600" height="80" fill={yellow} />
      <rect x="0" y="80" width="600" height="140" fill={maroon} />

      <text
        x="50%" y="25%" textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', Times, serif"
        fontSize="42" fontWeight="700"
        fill={topTextColor}
      >
        {topText}
      </text>
      
      {/* Outline (stroke) for bottom text */}
      <text
        x="50%" y="160" textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', Times, serif"
        fontSize="84" fontWeight="800"
        fill="none"
      >
        {bottomText}
      </text>

      {/* Fill on top */}
      <text
        x="50%" y="80%" textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', Times, serif"
        fontSize="84" fontWeight="800"
        fill="#FFFFFF"
      >
        {bottomText}
      </text>
    </svg>
  );
}