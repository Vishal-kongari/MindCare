import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { saveSurveyResponse, SurveyResponseData } from "@/services/survey";
import { Brain, Activity, HeartPulse, Moon, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";

interface Props {
  userId: string;
  onComplete: () => void;
}

const SECTION_A_QUESTIONS = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Feeling nervous or anxious",
  "Unable to stop worrying",
  "Trouble sleeping or sleeping too much",
  "Feeling tired or low energy"
];

const SECTION_B_QUESTIONS = [
  "Trouble concentrating on tasks",
  "Feeling overwhelmed by small things",
  "Losing motivation to do daily activities",
  "Feeling lonely even when around people"
];

const SCALE_OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];

export const MentalHealthSurvey: React.FC<Props> = ({ userId, onComplete }) => {
  const [step, setStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States
  const [sectionA, setSectionA] = useState<number[]>(Array(6).fill(-1));
  const [sectionB, setSectionB] = useState<number[]>(Array(4).fill(-1));
  const [sectionC, setSectionC] = useState<number[]>([5, 5]); // Stress defaults
  const [sectionD, setSectionD] = useState<number[]>([7, 3, 5]); // Sleep/Exercise/Screen defaults
  const [sectionE, setSectionE] = useState<number>(-1);

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const mental_score = sectionA.reduce((a, b) => a + (b >= 0 ? b : 0), 0) +
        sectionB.reduce((a, b) => a + (b >= 0 ? b : 0), 0);
      const stress_score = sectionC.reduce((a, b) => a + b, 0);

      // Fetch user hobbies
      let hobbies = "";
      try {
        const { getDb } = await import("@/lib/firebase");
        const { doc, getDoc } = await import("firebase/firestore");
        const db = await getDb();
        const userDoc = await getDoc(doc(db, "users", userId));
        if (userDoc.exists()) {
          hobbies = (userDoc.data() as any).hobbies || "";
        }
      } catch (err) {
        console.warn("Failed to fetch hobbies:", err);
      }

      // Prediction Call
      let prediction = null;
      try {
        const response = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mental_score,
            stress_score,
            sleep_hours: sectionD[0],
            exercise_days: sectionD[1],
            screen_time: sectionD[2],
            lonely: sectionB[3],
            self_harm: sectionE,
            hobbies
          })
        });
        if (response.ok) {
          const resData = await response.json();
          prediction = {
            level: resData.level,
            suggestions: resData.suggestions
          };
        }
      } catch (err) {
        console.error("FastAPI Backend Error:", err);
        // Continue saving survey even if prediction fails
      }

      const data: SurveyResponseData = {
        sectionA,
        sectionB,
        sectionC,
        sectionD,
        sectionE,
        prediction: prediction || undefined
      };

      await saveSurveyResponse(userId, data);
      setIsSubmitting(false);
      setStep(6); // Success step
      setTimeout(() => {
        onComplete();
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) return sectionA.every(v => v !== -1);
    if (step === 2) return sectionB.every(v => v !== -1);
    if (step === 5) return sectionE !== -1;
    return true; // Sliders always have a valid default
  };

  const renderWelcome = () => (
    <div className="text-center py-8 space-y-6">
      <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 p-5 shadow-lg">
        <Brain className="w-full h-full text-white" />
      </div>
      <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-pink-700">
        Bi-Weekly Check-in
      </h2>
      <p className="text-lg text-gray-600 max-w-md mx-auto">
        Taking a moment to reflect on your wellbeing helps us support you better. This short survey will take about 2 minutes.
      </p>
      <Button 
        onClick={handleNext}
        className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
      >
        Start Check-in <ArrowRight className="ml-2 w-5 h-5" />
      </Button>
    </div>
  );

  const renderSectionA = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 bg-blue-100 rounded-lg"><Activity className="w-5 h-5 text-blue-600" /></div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Core Mental State</h3>
          <p className="text-sm text-gray-500">Over the last 2 weeks, how often have you been bothered by:</p>
        </div>
      </div>
      <div className="space-y-4">
        {SECTION_A_QUESTIONS.map((q, idx) => (
          <div key={idx} className="space-y-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
            <h4 className="font-medium text-sm sm:text-base text-gray-900">{idx + 1}. {q}</h4>
            <RadioGroup 
              value={sectionA[idx]?.toString() || ""} 
              onValueChange={(val) => {
                const newArr = [...sectionA];
                newArr[idx] = parseInt(val);
                setSectionA(newArr);
              }}
              className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mt-1"
            >
              {SCALE_OPTIONS.map(opt => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`a-${idx}-${opt.value}`} />
                  <Label htmlFor={`a-${idx}-${opt.value}`} className="cursor-pointer text-sm text-gray-700 font-normal">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionB = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 bg-purple-100 rounded-lg"><Brain className="w-5 h-5 text-purple-600" /></div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Behavior & Thinking</h3>
          <p className="text-sm text-gray-500">Over the last 2 weeks, how often have you been bothered by:</p>
        </div>
      </div>
      <div className="space-y-4">
        {SECTION_B_QUESTIONS.map((q, idx) => (
          <div key={idx} className="space-y-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
            <h4 className="font-medium text-sm sm:text-base text-gray-900">{idx + 1}. {q}</h4>
            <RadioGroup 
              value={sectionB[idx]?.toString() || ""} 
              onValueChange={(val) => {
                const newArr = [...sectionB];
                newArr[idx] = parseInt(val);
                setSectionB(newArr);
              }}
              className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mt-1"
            >
              {SCALE_OPTIONS.map(opt => (
                <div key={opt.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={opt.value.toString()} id={`b-${idx}-${opt.value}`} />
                  <Label htmlFor={`b-${idx}-${opt.value}`} className="cursor-pointer text-sm text-gray-700 font-normal">
                    {opt.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSectionC = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 bg-orange-100 rounded-lg"><HeartPulse className="w-5 h-5 text-orange-600" /></div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Stress Levels</h3>
          <p className="text-sm text-gray-500">Please rate on <span className="hidden sm:inline">a scale from</span> 0 to 10</p>
        </div>
      </div>
      <div className="space-y-8 py-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Overall stress level</h4>
            <span className="text-2xl font-bold text-orange-600 bg-orange-50 px-4 py-1 rounded-lg">{sectionC[0]}</span>
          </div>
          <Slider 
            value={[sectionC[0]]} 
            max={10} 
            step={1} 
            onValueChange={(v) => {
              const newArr = [...sectionC];
              newArr[0] = v[0];
              setSectionC(newArr);
            }} 
            className="w-full"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Academic / Work pressure</h4>
            <span className="text-2xl font-bold text-orange-600 bg-orange-50 px-4 py-1 rounded-lg">{sectionC[1]}</span>
          </div>
          <Slider 
            value={[sectionC[1]]} 
            max={10} 
            step={1} 
            onValueChange={(v) => {
              const newArr = [...sectionC];
              newArr[1] = v[0];
              setSectionC(newArr);
            }} 
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

  const renderSectionD = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 bg-teal-100 rounded-lg"><Moon className="w-5 h-5 text-teal-600" /></div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Lifestyle Routine</h3>
          <p className="text-sm text-gray-500">Tell us about your physical health habits</p>
        </div>
      </div>
      <div className="space-y-8 py-2">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Average sleep hours per day</h4>
            <span className="text-2xl font-bold text-teal-600 bg-teal-50 px-4 py-1 rounded-lg">{sectionD[0]} hrs</span>
          </div>
          <Slider 
            value={[sectionD[0]]} 
            max={12} 
            step={1} 
            onValueChange={(v) => {
              const newArr = [...sectionD];
              newArr[0] = v[0];
              setSectionD(newArr);
            }} 
            className="w-full"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Exercise days per week</h4>
            <span className="text-2xl font-bold text-teal-600 bg-teal-50 px-4 py-1 rounded-lg">{sectionD[1]} days</span>
          </div>
          <Slider 
            value={[sectionD[1]]} 
            max={7} 
            step={1} 
            onValueChange={(v) => {
              const newArr = [...sectionD];
              newArr[1] = v[0];
              setSectionD(newArr);
            }} 
            className="w-full"
          />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Average screen time per day</h4>
            <span className="text-2xl font-bold text-teal-600 bg-teal-50 px-4 py-1 rounded-lg">{sectionD[2]} hrs</span>
          </div>
          <Slider 
            value={[sectionD[2]]} 
            max={24} 
            step={1} 
            onValueChange={(v) => {
              const newArr = [...sectionD];
              newArr[2] = v[0];
              setSectionD(newArr);
            }} 
            className="w-full"
          />
        </div>
      </div>
    </div>
  );

  const renderSectionE = () => (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 border-b pb-3">
        <div className="p-2 bg-red-100 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Safety Check</h3>
          <p className="text-sm text-gray-500">A sensitive but important question for your immediate safety.</p>
        </div>
      </div>
      <div className="space-y-4 bg-red-50/50 p-4 sm:p-6 rounded-xl border border-red-100">
        <h4 className="font-semibold text-gray-900 text-base sm:text-lg">Have you had thoughts of self-harm recently?</h4>
        <RadioGroup 
          value={sectionE === -1 ? "" : sectionE.toString()} 
          onValueChange={(val) => setSectionE(parseInt(val))}
          className="flex flex-col gap-3"
        >
          {[{label: "No", val: 0}, {label: "Sometimes", val: 1}, {label: "Yes", val: 2}].map(opt => (
            <div key={opt.val} className="flex items-center space-x-3 bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
              <RadioGroupItem value={opt.val.toString()} id={`e-${opt.val}`} />
              <Label htmlFor={`e-${opt.val}`} className="cursor-pointer font-medium w-full h-full text-gray-800">
                {opt.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12 space-y-6 animate-in zoom-in duration-500">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 p-5">
        <CheckCircle2 className="w-full h-full text-green-500" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
      <p className="text-lg text-gray-600 max-w-sm mx-auto">
        Your check-in is complete. Loading your dashboard...
      </p>
    </div>
  );

  const sections = [
    renderWelcome,
    renderSectionA,
    renderSectionB,
    renderSectionC,
    renderSectionD,
    renderSectionE,
    renderSuccess
  ];

  const totalSteps = sections.length - 2; // Exclude welcome and success
  const currentStep = step === 0 ? 0 : step === 6 ? totalSteps : step;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-gray-900/40 backdrop-blur-md p-0 sm:p-4 overflow-y-auto">
      <Card className="w-full max-w-2xl bg-white shadow-2xl border-0 overflow-hidden max-h-[100vh] sm:max-h-[85vh] sm:rounded-2xl flex flex-col">
        {step > 0 && step < 6 && (
          <div className="h-1.5 w-full bg-gray-100">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <CardContent className="p-4 sm:p-6 pt-6 sm:pt-8 overflow-y-auto flex-1 custom-scrollbar">
          {sections[step]()}
        </CardContent>

        {step > 0 && step < 6 && (
          <CardFooter className="flex justify-between border-t bg-gray-50/50 p-4 sm:p-6 shrink-0 mt-auto">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            
            {step === 5 ? (
              <Button 
                onClick={handleSubmit} 
                disabled={!isStepValid() || isSubmitting}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white min-w-[120px]"
              >
                {isSubmitting ? "Submitting..." : "Submit Answers"} 
                {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
              </Button>
            ) : (
              <Button 
                onClick={handleNext} 
                disabled={!isStepValid()}
                className="gap-2 bg-gray-900 hover:bg-gray-800 text-white min-w-[120px]"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
