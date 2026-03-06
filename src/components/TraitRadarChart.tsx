
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { PersonalityProfile, PersonalityTrait } from '../types';
import { TRAIT_COLORS_HEX, MAX_POSSIBLE_TRAIT_SCORE, BIG_FIVE_TRAITS } from '../constants';

interface TraitRadarChartProps {
  profile: PersonalityProfile;
  comparisonProfile?: PersonalityProfile;
  comparisonProfileName?: string;
}

const TraitRadarChart: React.FC<TraitRadarChartProps> = ({ profile, comparisonProfile, comparisonProfileName = "פרופיל השוואה" }) => {
  const data = BIG_FIVE_TRAITS.map(trait => {
    const traitData: {
      subject: string;
      score: number;
      comparisonScore?: number;
      fullMark: number;
    } = {
      subject: trait,
      score: profile[trait],
      fullMark: MAX_POSSIBLE_TRAIT_SCORE,
    };
    if (comparisonProfile) {
      traitData.comparisonScore = comparisonProfile[trait];
    }
    return traitData;
  });

  // Custom tooltip formatter
  const renderTooltipContent = (props: any) => {
    const { payload } = props;
    if (payload && payload.length) {
      const dataPoint = payload[0].payload; // Access the full data point including subject
      const userScore = payload.find((p: any) => p.dataKey === 'score');
      const comparisonScoreItem = payload.find((p: any) => p.dataKey === 'comparisonScore');
      
      return (
        <div className="bg-white p-3 rounded-md shadow-lg border border-slate-200">
          <p className="font-semibold text-slate-700">{`${dataPoint.subject}`}</p>
          {userScore && <p className="text-sm text-slate-600" style={{ color: userScore.color }}>{`הפרופיל שלך: ${userScore.value} / ${dataPoint.fullMark}`}</p>}
          {comparisonScoreItem && <p className="text-sm text-slate-600" style={{ color: comparisonScoreItem.color }}>{`${comparisonProfileName}: ${comparisonScoreItem.value?.toFixed(1)} / ${dataPoint.fullMark}`}</p>}
        </div>
      );
    }
    return null;
  };


  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-xl w-full h-96 sm:h-[450px]">
      <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-4 text-center">פרופיל האישיות שלך (תרשים עכביש)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e0e0e0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#334155', fontSize: 12, fontWeight: 500 }} 
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, MAX_POSSIBLE_TRAIT_SCORE]} 
            tickCount={MAX_POSSIBLE_TRAIT_SCORE + 1} 
            allowDecimals={false}
            tick={{ fontSize: 10, fill: '#64748b' }}
          />
          <Radar 
            name="הפרופיל שלך" 
            dataKey="score" 
            stroke={TRAIT_COLORS_HEX[PersonalityTrait.Conscientiousness]} 
            fill={TRAIT_COLORS_HEX[PersonalityTrait.Conscientiousness]} 
            fillOpacity={0.6} 
          />
          {comparisonProfile && (
            <Radar
              name={comparisonProfileName}
              dataKey="comparisonScore"
              stroke={TRAIT_COLORS_HEX[PersonalityTrait.Extraversion]} // Example: a different color for comparison
              fill={TRAIT_COLORS_HEX[PersonalityTrait.Extraversion]}
              fillOpacity={0.4}
            />
          )}
          <Tooltip content={renderTooltipContent} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} formatter={(value) => <span className="text-slate-700">{value}</span>} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TraitRadarChart;
