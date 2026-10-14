import React, { useState, useMemo, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Award,
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  FileText,
  Filter,
  Heart,
  HeartPulse,
  Info,
  Layers,
  MapPin,
  Maximize2,
  Navigation,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Stethoscope,
  Thermometer,
  Trash2,
  User,
  Users,
  X,
  Zap,
  BarChart2,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Brain,
  Droplet,
  Eye,
  Sliders
} from 'lucide-react';

// --- DATABASE: Symptoms ---
const SYMPTOMS_DATABASE = [
  { id: 'fever', name: 'High Fever', category: 'General', bodyPart: 'head', icon: 'Thermometer', desc: 'Body temperature exceeding 100.4°F (38°C)' },
  { id: 'chills', name: 'Chills & Rigors', category: 'General', bodyPart: 'head', icon: 'Thermometer', desc: 'Involuntary shivering and feeling cold' },
  { id: 'fatigue', name: 'Severe Fatigue', category: 'General', bodyPart: 'general', icon: 'Zap', desc: 'Extreme exhaustion and persistent lack of energy' },
  { id: 'headache', name: 'Throbbing Headache', category: 'Neurological', bodyPart: 'head', icon: 'Brain', desc: 'Pain localized to temples, forehead, or neck' },
  { id: 'dizziness', name: 'Dizziness & Lightheadedness', category: 'Neurological', bodyPart: 'head', icon: 'Brain', desc: 'Feeling faint, unsteady, or spinning sensation' },
  { id: 'cough_dry', name: 'Dry Persistent Cough', category: 'Respiratory', bodyPart: 'chest', icon: 'Activity', desc: 'Non-productive hacking cough' },
  { id: 'cough_productive', name: 'Productive Cough with Phlegm', category: 'Respiratory', bodyPart: 'chest', icon: 'Activity', desc: 'Coughing up clear, yellow, or greenish sputum' },
  { id: 'sob', name: 'Shortness of Breath', category: 'Respiratory', bodyPart: 'chest', icon: 'Activity', desc: 'Dyspnea or difficulty catching breath' },
  { id: 'sore_throat', name: 'Sore Throat & Pain', category: 'Respiratory', bodyPart: 'head', icon: 'Activity', desc: 'Scratchiness, raw sensation, or painful swallowing' },
  { id: 'chest_pain', name: 'Chest Tightness or Pain', category: 'Cardiovascular', bodyPart: 'chest', icon: 'HeartPulse', desc: 'Pressure, squeezing, or pain in central chest' },
  { id: 'palpitations', name: 'Heart Palpitations', category: 'Cardiovascular', bodyPart: 'chest', icon: 'Heart', desc: 'Rapid, fluttering, or pounding heart beat' },
  { id: 'nausea', name: 'Nausea & Queasiness', category: 'Digestive', bodyPart: 'abdomen', icon: 'Droplet', desc: 'Upset stomach with inclination to vomit' },
  { id: 'vomiting', name: 'Vomiting', category: 'Digestive', bodyPart: 'abdomen', icon: 'Droplet', desc: 'Involuntary expulsion of stomach contents' },
  { id: 'diarrhea', name: 'Frequent Watery Stools', category: 'Digestive', bodyPart: 'abdomen', icon: 'Droplet', desc: 'Loose or fluid bowel movements' },
  { id: 'abd_pain', name: 'Abdominal Cramping / Pain', category: 'Digestive', bodyPart: 'abdomen', icon: 'Droplet', desc: 'Localized or diffuse stomach ache' },
  { id: 'joint_pain', name: 'Severe Joint Pain (Arthralgia)', category: 'Musculoskeletal', bodyPart: 'limbs', icon: 'Sliders', desc: 'Aching, inflammation, or stiffness in joints' },
  { id: 'muscle_ache', name: 'Muscle Aches (Myalgia)', category: 'Musculoskeletal', bodyPart: 'limbs', icon: 'Sliders', desc: 'General body soreness and muscle weakness' },
  { id: 'skin_rash', name: 'Skin Rash or Lesions', category: 'Skin', bodyPart: 'skin', icon: 'Eye', desc: 'Redness, bumps, itching, or spots on epidermis' },
  { id: 'loss_taste_smell', name: 'Loss of Taste or Smell', category: 'Neurological', bodyPart: 'head', icon: 'Brain', desc: 'Anosmia or ageusia (inability to perceive odors/flavors)' },
  { id: 'runny_nose', name: 'Nasal Congestion & Rhinorrhea', category: 'Respiratory', bodyPart: 'head', icon: 'Activity', desc: 'Stuffy or constantly running nose' },
  { id: 'back_pain', name: 'Lower Back Pain', category: 'Musculoskeletal', bodyPart: 'back', icon: 'Sliders', desc: 'Stiffness or sharp pain in lumbar spine' },
  { id: 'sweats', name: 'Profuse Night Sweats', category: 'General', bodyPart: 'general', icon: 'Droplet', desc: 'Drenching sweat disrupting sleep' }
];

// --- DATABASE: Diseases & Clinical Models ---
const DISEASES_DATABASE = [
  {
    id: 'influenza',
    name: 'Viral Influenza (Flu)',
    icdCode: 'J10.1',
    category: 'Viral Respiratory Infection',
    riskLevel: 'Moderate',
    riskColor: 'amber',
    baseMatchScore: 88,
    symptomsRequired: ['fever', 'cough_dry', 'fatigue', 'muscle_ache', 'headache'],
    summary: 'A contagious respiratory illness caused by influenza viruses infecting the nose, throat, and sometimes the lungs.',
    matchingReason: 'High correlation with sudden high fever, generalized muscle aches, severe fatigue, and dry cough.',
    recommendedTests: ['Rapid Influenza Diagnostic Test (RIDT)', 'RT-PCR Viral Swab', 'Complete Blood Count (CBC)'],
    specialist: 'General Practitioner / Internal Medicine',
    selfCareTips: [
      'Strict bed rest for 4-7 days',
      'Hydrate with warm fluids, water, and electrolyte solutions',
      'Over-the-counter antipyretics for fever control (e.g., Acetaminophen)',
      'Isolate from family members to prevent viral transmission'
    ],
    redFlags: ['Shortness of breath or difficulty breathing', 'Persistent chest pain or pressure', 'Confusion or inability to wake']
  },
  {
    id: 'covid19',
    name: 'COVID-19 (SARS-CoV-2)',
    icdCode: 'U07.1',
    category: 'Coronaviral Disease',
    riskLevel: 'High',
    riskColor: 'rose',
    baseMatchScore: 82,
    symptomsRequired: ['fever', 'cough_dry', 'loss_taste_smell', 'fatigue', 'sob'],
    summary: 'Infectious disease caused by the SARS-CoV-2 coronavirus affecting upper and lower respiratory tracts.',
    matchingReason: 'Strong weight towards sudden loss of taste/smell paired with dry cough, dyspnea, and systemic fever.',
    recommendedTests: ['Rapid Antigen Test', 'RT-PCR Nasopharyngeal Swab', 'Chest X-Ray / CT if breathless', 'SpO2 Pulse Oximetry Monitoring'],
    specialist: 'Pulmonologist / Infectious Disease Specialist',
    selfCareTips: [
      'Monitor oxygen levels (SpO2) every 4 hours using a pulse oximeter',
      'Prone positioning if experiencing light respiratory tightness',
      'Stay isolated in a well-ventilated room',
      'Maintain high oral fluid intake'
    ],
    redFlags: ['SpO2 falling below 94%', 'Bluish lips or face', 'Severe persistent chest pain']
  },
  {
    id: 'dengue',
    name: 'Dengue Fever',
    icdCode: 'A90',
    category: 'Vector-Borne Viral Infection',
    riskLevel: 'High',
    riskColor: 'rose',
    baseMatchScore: 79,
    symptomsRequired: ['fever', 'joint_pain', 'headache', 'skin_rash', 'muscle_ache', 'nausea'],
    summary: 'Mosquito-borne viral disease characterized by high fever, severe retro-orbital headache, excruciating joint/bone pain, and rash.',
    matchingReason: 'Distinct combination of high fever, retro-orbital eye headache, severe joint aches (breakbone fever), and petechial rash.',
    recommendedTests: ['Dengue NS1 Antigen Test', 'Dengue IgM/IgG Antibody Assay', 'Platelet Count & Hematocrit (CBC)'],
    specialist: 'Infectious Disease / General Physician',
    selfCareTips: [
      'Abundant hydration (ORSL, coconut water, isotonic fluids)',
      'Avoid NSAIDs/Aspirin/Ibuprofen as they increase bleeding risk! Use Paracetamol for fever',
      'Complete physical rest',
      'Monitor body for unexpected bruises or mucosal bleeding'
    ],
    redFlags: ['Severe abdominal pain', 'Persistent vomiting', 'Bleeding gums or nose', 'Rapid drop in blood pressure']
  },
  {
    id: 'malaria',
    name: 'Malaria Fever',
    icdCode: 'B54',
    category: 'Parasitic Disease',
    riskLevel: 'High',
    riskColor: 'rose',
    baseMatchScore: 74,
    symptomsRequired: ['fever', 'chills', 'sweats', 'headache', 'fatigue', 'nausea'],
    summary: 'Life-threatening mosquito-borne illness caused by Plasmodium parasites causing cyclical fevers and rigors.',
    matchingReason: 'Classic triad of intense chills/shivering, high fever spikes, followed by profuse sweating and nausea.',
    recommendedTests: ['Malaria Parasite Rapid Diagnostic Test (RDT)', 'Peripheral Blood Smear (Thin & Thick)', 'CBC'],
    specialist: 'Tropical Medicine / Infectious Disease Specialist',
    selfCareTips: [
      'Complete prescription antimalarial course strictly as advised',
      'Keep warm during cold stage, cool compress during hot stage',
      'Maintain oral rehydration'
    ],
    redFlags: ['Extreme lethargy or altered consciousness', 'Dark/tea-colored urine', 'Jaundice (yellow eyes/skin)']
  },
  {
    id: 'gastroenteritis',
    name: 'Acute Gastroenteritis',
    icdCode: 'A09',
    category: 'Gastrointestinal Infection',
    riskLevel: 'Moderate',
    riskColor: 'amber',
    baseMatchScore: 71,
    symptomsRequired: ['diarrhea', 'vomiting', 'nausea', 'abd_pain', 'fever'],
    summary: 'Inflammation of the lining of the intestines caused by a virus, bacteria, or parasite, commonly referred to as stomach flu.',
    matchingReason: 'Cluster of stomach cramping, frequent watery bowel movements, nausea, and low-grade fever.',
    recommendedTests: ['Stool Routine & Microscopy', 'Electrolyte Panel (Sodium, Potassium)', 'Stool Culture'],
    specialist: 'Gastroenterologist / Primary Care Physician',
    selfCareTips: [
      'Oral Rehydration Therapy (ORS) after each liquid stool',
      'BRAT Diet (Bananas, Rice, Applesauce, Toast)',
      'Avoid dairy, caffeine, oily foods, and refined sugars',
      'Wash hands thoroughly to prevent household transmission'
    ],
    redFlags: ['Inability to keep fluids down for 24+ hours', 'Blood in stool or vomit', 'Signs of severe dehydration (sunken eyes, zero urination)']
  },
  {
    id: 'migraine',
    name: 'Acute Migraine Episode',
    icdCode: 'G43.9',
    category: 'Neurological Disorder',
    riskLevel: 'Low',
    riskColor: 'emerald',
    baseMatchScore: 68,
    symptomsRequired: ['headache', 'nausea', 'dizziness'],
    summary: 'A neurological condition that can cause severe, throbbing pain or a pulsing sensation, usually on one side of the head.',
    matchingReason: 'Unilateral throbbing headache associated with sensitivity, dizziness, and nausea without high systemic fever.',
    recommendedTests: ['Neurological Examination', 'Brain MRI/CT (if first occurrence or atypical)'],
    specialist: 'Neurologist / Pain Specialist',
    selfCareTips: [
      'Rest in a quiet, dark, temperature-controlled room',
      'Apply cold compress to forehead or back of neck',
      'Stay hydrated and avoid known dietary triggers (caffeine, aged cheese)',
      'Take prescribed triptans or analgesics at early onset'
    ],
    redFlags: ['Sudden thunderclap severe headache', 'Headache with fever and stiff neck', 'Numbness or weakness on one side of body']
  }
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('checker'); // 'checker', 'knowledge', 'vitals', 'history'

  // Symptom Checker State
  const [selectedSymptoms, setSelectedSymptoms] = useState({}); // { id: { severity: 5, duration: '3 days' } }
  const [symptomSearch, setSymptomSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBodyPartFilter, setSelectedBodyPartFilter] = useState('all');
  const [bodyView, setBodyView] = useState('front'); // 'front' or 'back'

  // Diagnostic Simulation State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [predictionResults, setPredictionResults] = useState(null);
  const [selectedResultDetail, setSelectedResultDetail] = useState(null);

  // Export Modal State
  const [showExportModal, setShowExportModal] = useState(false);

  // Vital Signs Form State
  const [vitals, setVitals] = useState({
    age: '32',
    gender: 'male',
    systolic: '120',
    diastolic: '80',
    heartRate: '72',
    spo2: '98',
    bloodGlucose: '95',
    smoker: false,
    diabetic: false,
    hypertensive: false
  });
  const [vitalsCalculatedRisk, setVitalsCalculatedRisk] = useState(null);

  // Knowledge Base State
  const [kbSearch, setKbSearch] = useState('');
  const [selectedKbDisease, setSelectedKbDisease] = useState(DISEASES_DATABASE[0]);

  // History State
  const [assessmentHistory, setAssessmentHistory] = useState([
    {
      id: 'hist-1',
      date: '2026-10-10 14:32',
      symptomsCount: 4,
      symptomsList: ['High Fever', 'Throbbing Headache', 'Severe Joint Pain', 'Fatigue'],
      topMatch: 'Dengue Fever',
      matchConfidence: 84,
      riskLevel: 'High'
    },
    {
      id: 'hist-2',
      date: '2026-09-18 09:15',
      symptomsCount: 3,
      symptomsList: ['Dry Persistent Cough', 'Sore Throat', 'Nasal Congestion'],
      topMatch: 'Viral Influenza (Flu)',
      matchConfidence: 78,
      riskLevel: 'Moderate'
    }
  ]);

  // --- Handlers: Symptom Selection ---
  const toggleSymptom = (symptomId) => {
    setSelectedSymptoms((prev) => {
      const next = { ...prev };
      if (next[symptomId]) {
        delete next[symptomId];
      } else {
        next[symptomId] = { severity: 5, duration: '1-3 days' };
      }
      return next;
    });
  };

  const updateSymptomSeverity = (symptomId, severity) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: { ...prev[symptomId], severity: Number(severity) }
    }));
  };

  const updateSymptomDuration = (symptomId, duration) => {
    setSelectedSymptoms((prev) => ({
      ...prev,
      [symptomId]: { ...prev[symptomId], duration }
    }));
  };

  const clearAllSymptoms = () => {
    setSelectedSymptoms({});
    setPredictionResults(null);
    setSelectedResultDetail(null);
  };

  // --- AI Model Prediction Simulation Engine ---
  const runPredictionEngine = () => {
    const selectedIds = Object.keys(selectedSymptoms);
    if (selectedIds.length === 0) return;

    setIsAnalyzing(true);
    setAnalysisProgress(15);

    const timer1 = setTimeout(() => setAnalysisProgress(50), 300);
    const timer2 = setTimeout(() => setAnalysisProgress(85), 600);

    const timer3 = setTimeout(() => {
      setAnalysisProgress(100);

      // Algorithmic Match Scoring logic
      const calculated = DISEASES_DATABASE.map((disease) => {
        let matchCount = 0;
        let weightedScore = 0;

        disease.symptomsRequired.forEach((reqSymptom) => {
          if (selectedSymptoms[reqSymptom]) {
            matchCount++;
            const sev = selectedSymptoms[reqSymptom].severity || 5;
            weightedScore += 10 + sev * 1.5;
          }
        });

        // Match Percentage calculation based on symptom overlap
        const maxPossible = disease.symptomsRequired.length;
        const overlapRatio = matchCount / maxPossible;
        let confidenceScore = Math.min(
          96,
          Math.round(overlapRatio * 65 + (matchCount > 0 ? 20 : 0) + (weightedScore / (maxPossible || 1)) * 1.2)
        );

        if (matchCount === 0) confidenceScore = Math.floor(Math.random() * 12) + 5;

        return {
          ...disease,
          confidence: confidenceScore,
          matchedSymptomsCount: matchCount,
          totalRequired: maxPossible
        };
      });

      // Sort by highest confidence match
      const sortedResults = calculated.sort((a, b) => b.confidence - a.confidence);

      setPredictionResults(sortedResults);
      setSelectedResultDetail(sortedResults[0]);
      setIsAnalyzing(false);

      // Save to History automatically
      const newHistoryItem = {
        id: 'hist-' + Date.now(),
        date: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
        symptomsCount: selectedIds.length,
        symptomsList: selectedIds.map((id) => SYMPTOMS_DATABASE.find((s) => s.id === id)?.name || id),
        topMatch: sortedResults[0].name,
        matchConfidence: sortedResults[0].confidence,
        riskLevel: sortedResults[0].riskLevel
      };
      setAssessmentHistory((prev) => [newHistoryItem, ...prev]);
    }, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  // --- Filtered Symptoms Database ---
  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS_DATABASE.filter((symptom) => {
      const matchesSearch = symptom.name.toLowerCase().includes(symptomSearch.toLowerCase()) ||
                            symptom.desc.toLowerCase().includes(symptomSearch.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || symptom.category === selectedCategory;
      const matchesBodyPart = selectedBodyPartFilter === 'all' || symptom.bodyPart === selectedBodyPartFilter;

      return matchesSearch && matchesCategory && matchesBodyPart;
    });
  }, [symptomSearch, selectedCategory, selectedBodyPartFilter]);

  // Categories list
  const categories = ['All', 'General', 'Respiratory', 'Neurological', 'Digestive', 'Musculoskeletal', 'Cardiovascular', 'Skin'];

  // --- Calculate Vitals Health Index ---
  const analyzeVitals = () => {
    const sys = parseInt(vitals.systolic) || 120;
    const dia = parseInt(vitals.diastolic) || 80;
    const hr = parseInt(vitals.heartRate) || 72;
    const spo2 = parseInt(vitals.spo2) || 98;
    const bg = parseInt(vitals.bloodGlucose) || 95;

    let flags = [];
    let riskTier = 'Optimal';
    let riskColor = 'emerald';

    if (spo2 < 95) {
      flags.push('Low Blood Oxygen Saturation (Hypoxia Risk)');
      riskTier = 'High';
      riskColor = 'rose';
    }
    if (sys >= 140 || dia >= 90) {
      flags.push('Stage 1 / 2 Hypertension Detected');
      if (riskTier !== 'High') { riskTier = 'Moderate'; riskColor = 'amber'; }
    }
    if (hr > 100) {
      flags.push('Elevated Resting Heart Rate (Tachycardia)');
      if (riskTier !== 'High') { riskTier = 'Moderate'; riskColor = 'amber'; }
    }
    if (bg > 125) {
      flags.push('Elevated Fasting Glucose (Hyperglycemia Warning)');
      if (riskTier !== 'High') { riskTier = 'Moderate'; riskColor = 'amber'; }
    }

    if (flags.length === 0) {
      flags.push('All entered vital signs fall within healthy reference ranges.');
    }

    setVitalsCalculatedRisk({
      tier: riskTier,
      color: riskColor,
      flags,
      timestamp: new Date().toLocaleTimeString()
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* HEADER & TOP NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Branding */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-bold shadow-lg shadow-cyan-500/20">
              <HeartPulse className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  MediPredict
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-semibold tracking-wider uppercase">
                  AI v3.4
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Clinical Symptom Assessment & Diagnostics Platform
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('checker')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'checker'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Symptom Checker</span>
            </button>

            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'vitals'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Vitals & Risk</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Disease Database</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>History ({assessmentHistory.length})</span>
            </button>
          </nav>

          {/* Compliance Badges */}
          <div className="flex items-center space-x-3">
            <div className="hidden lg:flex items-center space-x-2 bg-slate-800/60 border border-slate-700/60 px-3 py-1 rounded-full text-xs text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-[11px] font-medium">HIPAA & ISO 27001 Compliant</span>
            </div>
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Engine Active</span>
            </div>
          </div>
        </div>

        {/* Mobile Tab Row */}
        <div className="md:hidden flex items-center justify-around bg-slate-950 border-t border-slate-800 p-2">
          <button
            onClick={() => setActiveTab('checker')}
            className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'checker' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Checker</span>
          </button>
          <button
            onClick={() => setActiveTab('vitals')}
            className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'vitals' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Vitals</span>
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'knowledge' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Database</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`p-2 rounded-lg text-xs font-medium flex flex-col items-center gap-1 ${
              activeTab === 'history' ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>History</span>
          </button>
        </div>
      </header>

      {/* MEDICAL DISCLAIMER BANNER */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border-b border-amber-500/20 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-amber-300/90">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <p>
              <strong className="font-semibold text-amber-200">Clinical Disclaimer:</strong> MediPredict AI is an educational diagnostic support simulator. It does not replace professional medical advice, diagnosis, or treatment. In case of emergency, call local emergency services immediately.
            </p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ==================== TAB 1: SYMPTOM CHECKER ==================== */}
        {activeTab === 'checker' && (
          <div className="space-y-8">
            
            {/* Top Intro Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  <span>AI Symptom Analysis</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-normal">
                    Interactive Diagnostic Matrix
                  </span>
                </h1>
                <p className="text-slate-400 text-sm mt-1 max-w-2xl">
                  Select your current symptoms, fine-tune severity indicators and duration, or click body regions below to run the probabilistic diagnosis model.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 shrink-0">
                {Object.keys(selectedSymptoms).length > 0 && (
                  <button
                    onClick={clearAllSymptoms}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Selected ({Object.keys(selectedSymptoms).length})</span>
                  </button>
                )}
                
                <button
                  onClick={runPredictionEngine}
                  disabled={Object.keys(selectedSymptoms).length === 0 || isAnalyzing}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-bold text-xs transition shadow-lg ${
                    Object.keys(selectedSymptoms).length > 0 && !isAnalyzing
                      ? 'bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 text-slate-950 shadow-cyan-500/25 hover:opacity-95 transform active:scale-98'
                      : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  }`}
                >
                  <Zap className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'Analyzing Neural Patterns...' : 'Run Medical Assessment'}</span>
                </button>
              </div>
            </div>

            {/* MAIN CHECKER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: Symptom Selector & Filters (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Search & Body Part Filter Controls */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search symptoms (e.g., Fever, Cough, Headache)..."
                        value={symptomSearch}
                        onChange={(e) => setSymptomSearch(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                      />
                    </div>

                    {/* Quick Body System Filter */}
                    <div className="flex items-center space-x-2 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-400">
                      <Filter className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-[11px]">System:</span>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="bg-transparent text-slate-200 focus:outline-none text-xs font-medium cursor-pointer"
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-slate-900 text-slate-200">
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Body Map Quick Selector Strip */}
                  <div className="pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-teal-400" /> Filter by Anatomical Region
                      </span>
                      {selectedBodyPartFilter !== 'all' && (
                        <button
                          onClick={() => setSelectedBodyPartFilter('all')}
                          className="text-[11px] text-cyan-400 hover:underline"
                        >
                          Show All Regions
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {[
                        { id: 'all', label: 'All Body' },
                        { id: 'head', label: 'Head & Neck' },
                        { id: 'chest', label: 'Chest' },
                        { id: 'abdomen', label: 'Abdomen' },
                        { id: 'limbs', label: 'Limbs/Joints' },
                        { id: 'skin', label: 'Skin & Body' }
                      ].map((region) => (
                        <button
                          key={region.id}
                          onClick={() => setSelectedBodyPartFilter(region.id)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition ${
                            selectedBodyPartFilter === region.id
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {region.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Symptom Cards Grid */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>Available Symptom Identifiers ({filteredSymptoms.length})</span>
                    <span>Click card to toggle selection</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[520px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredSymptoms.map((symptom) => {
                      const isSelected = !!selectedSymptoms[symptom.id];

                      return (
                        <div
                          key={symptom.id}
                          onClick={() => toggleSymptom(symptom.id)}
                          className={`group cursor-pointer rounded-2xl p-4 border transition-all duration-200 relative overflow-hidden ${
                            isSelected
                              ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-teal-950/40 border-cyan-500/60 shadow-lg shadow-cyan-500/10'
                              : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          {/* Selection Check Indicator */}
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-2.5">
                              <div
                                className={`p-2 rounded-xl border ${
                                  isSelected
                                    ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                                    : 'bg-slate-950 border-slate-800 text-slate-400 group-hover:text-cyan-400'
                                }`}
                              >
                                <Activity className="w-4 h-4" />
                              </div>
                              <div>
                                <h3 className={`text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-slate-200'}`}>
                                  {symptom.name}
                                </h3>
                                <span className="text-[10px] text-slate-400">{symptom.category}</span>
                              </div>
                            </div>

                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center border transition ${
                                isSelected
                                  ? 'bg-cyan-400 border-cyan-400 text-slate-950'
                                  : 'border-slate-700 bg-slate-950'
                              }`}
                            >
                              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
                            {symptom.desc}
                          </p>

                          {/* Extra Sliders when Selected */}
                          {isSelected && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="mt-3 pt-3 border-t border-slate-700/60 space-y-2.5 bg-slate-950/40 p-2.5 rounded-xl"
                            >
                              {/* Severity Slider */}
                              <div>
                                <div className="flex justify-between text-[10px] text-slate-300 mb-1">
                                  <span>Severity Score</span>
                                  <span className="font-bold text-cyan-400">
                                    {selectedSymptoms[symptom.id].severity} / 10
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="1"
                                  max="10"
                                  value={selectedSymptoms[symptom.id].severity}
                                  onChange={(e) => updateSymptomSeverity(symptom.id, e.target.value)}
                                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                                />
                              </div>

                              {/* Duration Selector */}
                              <div className="flex items-center justify-between text-[10px]">
                                <span className="text-slate-400">Duration:</span>
                                <select
                                  value={selectedSymptoms[symptom.id].duration}
                                  onChange={(e) => updateSymptomDuration(symptom.id, e.target.value)}
                                  className="bg-slate-900 border border-slate-700 text-slate-200 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                                >
                                  <option value="Today">Today (&lt;24h)</option>
                                  <option value="1-3 days">1-3 Days</option>
                                  <option value="4-7 days">4-7 Days</option>
                                  <option value="1+ week">1+ Week</option>
                                </select>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Body Map & Live Summary (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Visual Body Region Mapper */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-4 h-4 text-cyan-400" /> Interactive Anatomical Selector
                    </h3>
                    <div className="flex items-center space-x-1 bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                      <button
                        onClick={() => setBodyView('front')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          bodyView === 'front' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                        }`}
                      >
                        Anterior (Front)
                      </button>
                      <button
                        onClick={() => setBodyView('back')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          bodyView === 'back' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'
                        }`}
                      >
                        Posterior (Back)
                      </button>
                    </div>
                  </div>

                  {/* SVG Anatomical Silhouette Diagram */}
                  <div className="relative bg-slate-950 rounded-xl p-4 border border-slate-800/80 flex items-center justify-center min-h-[260px] overflow-hidden">
                    {/* Background Grid Accent */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:16px_16px]"></div>

                    {/* Interactive Body Pins */}
                    <div className="relative w-48 h-64 flex flex-col items-center justify-between py-2">
                      {/* Head Region */}
                      <button
                        onClick={() => setSelectedBodyPartFilter('head')}
                        className={`group relative flex items-center justify-center p-2 rounded-full border transition ${
                          selectedBodyPartFilter === 'head'
                            ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-500/50'
                            : 'bg-slate-900/80 border-slate-700 hover:border-cyan-400'
                        }`}
                      >
                        <Brain className="w-6 h-6 text-cyan-400" />
                        <span className="absolute -right-24 text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          Head & Neurological
                        </span>
                      </button>

                      {/* Chest / Respiratory Region */}
                      <button
                        onClick={() => setSelectedBodyPartFilter('chest')}
                        className={`group relative flex items-center justify-center p-2.5 rounded-full border transition ${
                          selectedBodyPartFilter === 'chest'
                            ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-500/50'
                            : 'bg-slate-900/80 border-slate-700 hover:border-cyan-400'
                        }`}
                      >
                        <Heart className="w-7 h-7 text-rose-400" />
                        <span className="absolute -right-24 text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          Chest & Cardio
                        </span>
                      </button>

                      {/* Abdomen / Digestive Region */}
                      <button
                        onClick={() => setSelectedBodyPartFilter('abdomen')}
                        className={`group relative flex items-center justify-center p-2 rounded-full border transition ${
                          selectedBodyPartFilter === 'abdomen'
                            ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-500/50'
                            : 'bg-slate-900/80 border-slate-700 hover:border-cyan-400'
                        }`}
                      >
                        <Droplet className="w-6 h-6 text-amber-400" />
                        <span className="absolute -right-24 text-[10px] bg-slate-900 border border-slate-700 px-2 py-0.5 rounded text-slate-300 opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                          Abdomen & Gastro
                        </span>
                      </button>

                      {/* Limbs / Joints Region */}
                      <div className="flex space-x-6">
                        <button
                          onClick={() => setSelectedBodyPartFilter('limbs')}
                          className={`group relative flex items-center justify-center p-2 rounded-full border transition ${
                            selectedBodyPartFilter === 'limbs'
                              ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-500/50'
                              : 'bg-slate-900/80 border-slate-700 hover:border-cyan-400'
                          }`}
                        >
                          <Sliders className="w-5 h-5 text-emerald-400" />
                        </button>
                        <button
                          onClick={() => setSelectedBodyPartFilter('limbs')}
                          className={`group relative flex items-center justify-center p-2 rounded-full border transition ${
                            selectedBodyPartFilter === 'limbs'
                              ? 'bg-cyan-500/30 border-cyan-400 ring-2 ring-cyan-500/50'
                              : 'bg-slate-900/80 border-slate-700 hover:border-cyan-400'
                          }`}
                        >
                          <Sliders className="w-5 h-5 text-emerald-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Selected Symptoms Summary Panel */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                      <Layers className="w-4 h-4 text-cyan-400" /> Selected Symptoms ({Object.keys(selectedSymptoms).length})
                    </h3>
                  </div>

                  {Object.keys(selectedSymptoms).length === 0 ? (
                    <div className="text-center py-8 space-y-2">
                      <Stethoscope className="w-8 h-8 text-slate-600 mx-auto" />
                      <p className="text-xs text-slate-400">No symptoms selected yet.</p>
                      <p className="text-[11px] text-slate-500">
                        Choose symptoms from the list or anatomical selector to calculate disease probabilities.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      {Object.keys(selectedSymptoms).map((symId) => {
                        const sym = SYMPTOMS_DATABASE.find((s) => s.id === symId);
                        const detail = selectedSymptoms[symId];
                        return (
                          <div
                            key={symId}
                            className="flex items-center justify-between bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs"
                          >
                            <div>
                              <span className="font-semibold text-slate-200">{sym?.name}</span>
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                                <span>Sev: <strong className="text-cyan-400">{detail.severity}/10</strong></span>
                                <span>•</span>
                                <span>Dur: {detail.duration}</span>
                              </div>
                            </div>
                            <button
                              onClick={() => toggleSymptom(symId)}
                              className="text-slate-500 hover:text-rose-400 transition p-1"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Run Analysis CTA */}
                  <button
                    onClick={runPredictionEngine}
                    disabled={Object.keys(selectedSymptoms).length === 0 || isAnalyzing}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition shadow-lg ${
                      Object.keys(selectedSymptoms).length > 0 && !isAnalyzing
                        ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 shadow-cyan-500/20 hover:brightness-110'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>Run AI Diagnostic Engine</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PREDICTION RESULTS DASHBOARD (Renders below when available) */}
            {isAnalyzing && (
              <div className="bg-slate-900/80 border border-cyan-500/40 rounded-2xl p-8 backdrop-blur-xl text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40">
                  <RefreshCw className="w-6 h-6 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-slate-100">Simulating Multi-Model Neural Scan...</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Cross-referencing selected symptom vectors against medical literature and statistical likelihood models.
                </p>
                <div className="w-full max-w-md bg-slate-950 rounded-full h-2 mx-auto overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-teal-400 h-full transition-all duration-300"
                    style={{ width: `${analysisProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {predictionResults && !isAnalyzing && (
              <div id="resultsSection" className="space-y-6 pt-6 border-t border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-5 h-5 text-teal-400" />
                      <h2 className="text-xl font-extrabold text-white">Diagnostic Prediction Results</h2>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Probabilistic matches computed based on weighted symptom patterns and severity.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowExportModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold border border-slate-700 transition"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Export Medical Summary Report</span>
                  </button>
                </div>

                {/* Grid layout for Results */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Ranked Condition Cards (5 cols) */}
                  <div className="lg:col-span-5 space-y-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Ranked Probabilities ({predictionResults.length})
                    </span>

                    {predictionResults.map((result, idx) => {
                      const isSelected = selectedResultDetail?.id === result.id;

                      return (
                        <div
                          key={result.id}
                          onClick={() => setSelectedResultDetail(result)}
                          className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                            isSelected
                              ? 'bg-slate-900 border-cyan-400/80 shadow-lg ring-1 ring-cyan-500/30'
                              : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                              Rank #{idx + 1} Match
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                                result.riskLevel === 'High'
                                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                                  : result.riskLevel === 'Moderate'
                                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              }`}
                            >
                              {result.riskLevel} Risk
                            </span>
                          </div>

                          <h3 className="text-sm font-bold text-white mb-1">{result.name}</h3>
                          <p className="text-[11px] text-slate-400 line-clamp-1 mb-3">{result.summary}</p>

                          {/* Confidence Bar */}
                          <div>
                            <div className="flex justify-between text-[11px] mb-1">
                              <span className="text-slate-400">Match Likelihood</span>
                              <span className="font-extrabold text-cyan-400">{result.confidence}%</span>
                            </div>
                            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                              <div
                                className="bg-gradient-to-r from-cyan-400 to-teal-400 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${result.confidence}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Detailed Condition Inspection Breakdown (7 cols) */}
                  {selectedResultDetail && (
                    <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
                      {/* Header */}
                      <div className="border-b border-slate-800 pb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-mono text-cyan-400">ICD-10: {selectedResultDetail.icdCode}</span>
                          <span className="text-xs text-slate-400">{selectedResultDetail.category}</span>
                        </div>
                        <h2 className="text-2xl font-black text-white">{selectedResultDetail.name}</h2>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedResultDetail.summary}</p>
                      </div>

                      {/* Matching Logic */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                          Clinical Matching Reason
                        </h4>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                          {selectedResultDetail.matchingReason}
                        </div>
                      </div>

                      {/* Recommended Diagnostic Lab Tests */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-cyan-400" /> Recommended Lab Investigations
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {selectedResultDetail.recommendedTests.map((test, i) => (
                            <div key={i} className="flex items-center space-x-2 bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                              <span>{test}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Specialist Consultation */}
                      <div className="flex items-center justify-between bg-cyan-950/30 border border-cyan-500/30 p-3.5 rounded-xl">
                        <div className="flex items-center space-x-3">
                          <Stethoscope className="w-5 h-5 text-cyan-400" />
                          <div>
                            <span className="text-[10px] text-cyan-400 uppercase font-bold tracking-wider">Suggested Specialist</span>
                            <p className="text-xs font-bold text-slate-100">{selectedResultDetail.specialist}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => alert(`Consultation locator simulation initialized for ${selectedResultDetail.specialist}`)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition"
                        >
                          Find Doctors
                        </button>
                      </div>

                      {/* Self Care & Red Flags */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                          <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Self-Care Guidelines
                          </h5>
                          <ul className="list-disc list-inside text-[11px] text-slate-300 space-y-1">
                            {selectedResultDetail.selfCareTips.map((tip, idx) => (
                              <li key={idx}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-rose-950/20 p-3.5 rounded-xl border border-rose-500/30 space-y-2">
                          <h5 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Emergency Red Flags
                          </h5>
                          <ul className="list-disc list-inside text-[11px] text-rose-200/90 space-y-1">
                            {selectedResultDetail.redFlags.map((flag, idx) => (
                              <li key={idx}>{flag}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: VITALS & RISK CALCULATOR ==================== */}
        {activeTab === 'vitals' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
              <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                <Activity className="w-6 h-6 text-cyan-400" />
                <span>Vital Signs Risk Calculator</span>
              </h1>
              <p className="text-slate-400 text-xs mt-1">
                Input patient bio-metrics and clinical vital signs to evaluate secondary physiological cardiovascular and metabolic risks.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Form Input (7 cols) */}
              <div className="md:col-span-7 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-5">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2">
                  Patient Bio-Metrics
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Age (Years)</label>
                    <input
                      type="number"
                      value={vitals.age}
                      onChange={(e) => setVitals({ ...vitals, age: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Biological Sex</label>
                    <select
                      value={vitals.gender}
                      onChange={(e) => setVitals({ ...vitals, gender: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider border-b border-slate-800 pb-2 pt-2">
                  Hemodynamic & Metabolic Measurements
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Systolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={vitals.systolic}
                      onChange={(e) => setVitals({ ...vitals, systolic: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Diastolic BP (mmHg)</label>
                    <input
                      type="number"
                      value={vitals.diastolic}
                      onChange={(e) => setVitals({ ...vitals, diastolic: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Resting Heart Rate (BPM)</label>
                    <input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Blood Oxygen SpO2 (%)</label>
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Fasting Blood Glucose (mg/dL)</label>
                  <input
                    type="number"
                    value={vitals.bloodGlucose}
                    onChange={(e) => setVitals({ ...vitals, bloodGlucose: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <button
                  onClick={analyzeVitals}
                  className="w-full py-3 bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 font-bold rounded-xl text-xs hover:opacity-95 transition shadow-lg shadow-cyan-500/20"
                >
                  Evaluate Vital Sign Risk
                </button>
              </div>

              {/* Output Card (5 cols) */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                    Vital Signs Risk Profile
                  </h3>

                  {vitalsCalculatedRisk ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400">Calculated Risk Tier</span>
                          <h4 className="text-lg font-black text-white">{vitalsCalculatedRisk.tier} Risk</h4>
                        </div>
                        <span
                          className={`w-3 h-3 rounded-full ${
                            vitalsCalculatedRisk.tier === 'High'
                              ? 'bg-rose-500 animate-ping'
                              : vitalsCalculatedRisk.tier === 'Moderate'
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                        ></span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400">Diagnostic Findings:</span>
                        {vitalsCalculatedRisk.flags.map((flag, idx) => (
                          <div key={idx} className="flex items-start space-x-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs text-slate-300">
                            <Info className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                            <span>{flag}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      Enter measurement parameters and click Evaluate.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: DISEASE KNOWLEDGE BASE ==================== */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-cyan-400" />
                  <span>Clinical Disease Knowledge Base</span>
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Explore clinical summaries, diagnostic criteria, and self-care guidelines.
                </p>
              </div>

              {/* Search */}
              <div className="relative min-w-[280px]">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search diseases or ICD codes..."
                  value={kbSearch}
                  onChange={(e) => setKbSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Disease List (4 cols) */}
              <div className="lg:col-span-4 space-y-2">
                {DISEASES_DATABASE.filter(d => d.name.toLowerCase().includes(kbSearch.toLowerCase()) || d.icdCode.toLowerCase().includes(kbSearch.toLowerCase())).map((disease) => (
                  <div
                    key={disease.id}
                    onClick={() => setSelectedKbDisease(disease)}
                    className={`cursor-pointer p-4 rounded-xl border transition ${
                      selectedKbDisease?.id === disease.id
                        ? 'bg-slate-900 border-cyan-400 text-white'
                        : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex justify-between text-[10px] text-cyan-400 font-mono mb-1">
                      <span>ICD: {disease.icdCode}</span>
                      <span>{disease.riskLevel} Risk</span>
                    </div>
                    <h3 className="text-xs font-bold">{disease.name}</h3>
                  </div>
                ))}
              </div>

              {/* Detailed View (8 cols) */}
              {selectedKbDisease && (
                <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <span className="text-xs font-mono text-cyan-400">ICD-10 Code: {selectedKbDisease.icdCode}</span>
                    <h2 className="text-2xl font-extrabold text-white mt-1">{selectedKbDisease.name}</h2>
                    <p className="text-xs text-slate-300 mt-2">{selectedKbDisease.summary}</p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Key Diagnostic Symptoms</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedKbDisease.symptomsRequired.map((symId) => {
                        const sym = SYMPTOMS_DATABASE.find((s) => s.id === symId);
                        return (
                          <span key={symId} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300">
                            {sym?.name || symId}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Recommended Investigations</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {selectedKbDisease.recommendedTests.map((test, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-xs text-slate-200 flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          <span>{test}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 4: ASSESSMENT HISTORY ==================== */}
        {activeTab === 'history' && (
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Clock className="w-6 h-6 text-cyan-400" />
                  <span>Assessment History</span>
                </h1>
                <p className="text-slate-400 text-xs mt-1">
                  Log of previous simulated patient diagnostic assessments.
                </p>
              </div>

              {assessmentHistory.length > 0 && (
                <button
                  onClick={() => setAssessmentHistory([])}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-400 text-xs font-semibold hover:bg-slate-700 transition"
                >
                  Clear History
                </button>
              )}
            </div>

            {assessmentHistory.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                No past assessment records available.
              </div>
            ) : (
              <div className="space-y-4">
                {assessmentHistory.map((item) => (
                  <div key={item.id} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs text-slate-400">{item.date}</span>
                      <span className="text-xs font-bold text-cyan-400">{item.topMatch} ({item.matchConfidence}% Match)</span>
                    </div>

                    <div>
                      <span className="text-[11px] text-slate-400">Reported Symptoms ({item.symptomsCount}):</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.symptomsList.map((sym, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 text-[10px] border border-slate-800">
                            {sym}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* PRINTABLE REPORT MODAL */}
      {showExportModal && selectedResultDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setShowExportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-800 pb-4">
              <div className="flex items-center space-x-2">
                <HeartPulse className="w-6 h-6 text-cyan-400" />
                <span className="text-lg font-bold text-white">MediPredict AI - Patient Summary Report</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Generated on: {new Date().toLocaleDateString()} • HIPAA Compliant Diagnostic Data
              </p>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="font-bold text-white">Primary Likelihood Diagnosis:</span>
                  <span className="text-cyan-400 font-bold">{selectedResultDetail.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-white">ICD-10 Code:</span>
                  <span className="font-mono">{selectedResultDetail.icdCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold text-white">Confidence Score:</span>
                  <span>{selectedResultDetail.confidence}%</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">Recommended Lab Work:</h4>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  {selectedResultDetail.recommendedTests.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 text-xs font-bold"
              >
                Download / Print PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
          <p>© 2026 MediPredict AI Systems. Inspired by ayusiparida/disease-prediction-system.</p>
          <p>Designed for educational medical simulation and clinical support testing.</p>
        </div>
      </footer>
    </div>
  );
}