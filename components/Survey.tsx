import React, { useState } from 'react';
import { SurveyResponse } from '../types';

interface SurveyProps {
  onSubmit: (data: SurveyResponse) => void;
}

export const Survey: React.FC<SurveyProps> = ({ onSubmit }) => {
  const [data, setData] = useState<SurveyResponse>({
    strategicThinking: 0,
    epistemicVigilance: 0,
    intellectualAutonomy: 0,
    perceivedUsefulness: 0,
    perceivedEaseOfUse: 0,
    reflectionConstraint: '',
    studentExperience: '',
  });

  const handleChange = (field: keyof SurveyResponse, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const isComplete = 
    data.strategicThinking > 0 &&
    data.epistemicVigilance > 0 &&
    data.intellectualAutonomy > 0 &&
    data.perceivedUsefulness > 0 &&
    data.perceivedEaseOfUse > 0 &&
    data.reflectionConstraint.trim().length > 5 &&
    data.studentExperience.trim().length > 5;

  const LikertScale = ({ field, label, description }: { field: keyof SurveyResponse, label: string, description: string }) => (
    <div className="mb-8 bg-[#002d56] p-6 rounded-lg border border-[#00B2A9]/20">
      <h3 className="text-[#FDB913] font-bold text-lg mb-1">{label}</h3>
      <p className="text-[#E6EBF4] text-sm mb-4 italic opacity-80">{description}</p>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-xs text-[#E6EBF4] uppercase tracking-wider">Strongly Disagree</span>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((val) => (
            <button
              key={val}
              onClick={() => handleChange(field, val)}
              className={`w-10 h-10 rounded-full font-bold transition-all ${
                // @ts-ignore
                data[field] === val 
                  ? 'bg-[#00B2A9] text-white scale-110 shadow-[0_0_10px_#00B2A9]' 
                  : 'bg-[#333F48] text-gray-400 hover:bg-gray-600'
              }`}
            >
              {val}
            </button>
          ))}
        </div>
        <span className="text-xs text-[#E6EBF4] uppercase tracking-wider">Strongly Agree</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto w-full animate-fade-in-up pb-12">
      <div className="bg-[#FDB913] text-[#002046] p-4 rounded-t-lg font-bold text-center uppercase tracking-widest border-b-4 border-[#002046]">
        Mandatory Reflection Survey
      </div>
      <div className="bg-[#002046] p-8 rounded-b-lg border border-[#FDB913] shadow-2xl">
        <p className="text-white mb-8 text-center text-sm">
          Please complete this survey to unlock your final Assessment Report.
        </p>

        <LikertScale 
          field="strategicThinking"
          label="1. Strategic Thinking (The Map Check)"
          description="I consciously used the 'Cartoon Hotel Lobby' Dashboard to strategize my shift workflow, prioritizing which hotspots to visit based on urgency."
        />

        <LikertScale 
          field="epistemicVigilance"
          label="2. Epistemic Vigilance (The Depth Check)"
          description="When the AI Coach provided feedback, I critically evaluated if the response was contextually accurate, rather than assuming it was correct just because it is 'smart'."
        />

        <LikertScale 
          field="intellectualAutonomy"
          label="3. Intellectual Autonomy (The Pilot Check)"
          description="I felt I was the active manager of the 'Virtual Shift,' consulting the AI only as a secondary resource, rather than relying on it to dictate my decisions."
        />

        <LikertScale 
          field="perceivedUsefulness"
          label="4. Perceived Usefulness (The Value Check)"
          description="The 'QuickChart' visualizations in the PMS View helped me identify operational bottlenecks much faster than reading standard text-based data."
        />

        <LikertScale 
          field="perceivedEaseOfUse"
          label="5. Perceived Ease of Use (The Friction Check)"
          description="The interface interaction between the Dashboard Hotspots and specific scenario views was intuitive and responsive."
        />

        <div className="mb-8">
          <label className="block text-[#FDB913] font-bold text-lg mb-1">6. Reflection (Qualitative Check)</label>
          <p className="text-[#E6EBF4] text-sm mb-2 italic opacity-80">
            The system enforces a '2-sentence constraint' when sending log entries. Did this force you to be more concise, or did it prevent you from explaining fully? How did you adapt?
          </p>
          <textarea 
            className="w-full h-24 p-3 rounded bg-[#333F48] text-white border border-gray-600 focus:border-[#00B2A9] outline-none"
            value={data.reflectionConstraint}
            onChange={(e) => handleChange('reflectionConstraint', e.target.value)}
            placeholder="Write your reflection here..."
          />
        </div>

        <div className="mb-8">
          <label className="block text-[#FDB913] font-bold text-lg mb-1">7. Student Experience</label>
          <p className="text-[#E6EBF4] text-sm mb-2 italic opacity-80">
            Did the combination of the 'Virtual Shift' simulation and AI feedback help you understand theoretical concepts better than traditional methods? Why or why not?
          </p>
          <textarea 
            className="w-full h-24 p-3 rounded bg-[#333F48] text-white border border-gray-600 focus:border-[#00B2A9] outline-none"
            value={data.studentExperience}
            onChange={(e) => handleChange('studentExperience', e.target.value)}
            placeholder="Share your experience..."
          />
        </div>

        <button 
          onClick={() => isComplete && onSubmit(data)}
          disabled={!isComplete}
          className={`w-full py-4 rounded-lg font-bold text-lg uppercase tracking-wider transition-all shadow-lg ${
            isComplete 
              ? 'bg-[#00B2A9] hover:bg-[#009b93] text-white hover:scale-[1.02]' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isComplete ? "Submit Survey & Unlock Report" : "Complete All Questions to Continue"}
        </button>

      </div>
    </div>
  );
};