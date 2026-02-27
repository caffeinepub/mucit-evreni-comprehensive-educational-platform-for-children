import { lazy, Suspense } from 'react';

const Calculator = lazy(() => import('../pages/tools/Calculator'));
const RulerAngle = lazy(() => import('../pages/tools/RulerAngle'));
const ScratchPad = lazy(() => import('../pages/tools/ScratchPad'));
const UnitConverter = lazy(() => import('../pages/tools/UnitConverter'));
const WritingTool = lazy(() => import('../pages/tools/WritingTool'));
const ReadingBar = lazy(() => import('../pages/tools/ReadingBar'));
const MultiplicationTable = lazy(() => import('../pages/tools/MultiplicationTable'));
const DateCalculator = lazy(() => import('../pages/tools/DateCalculator'));
const NumberLine = lazy(() => import('../pages/tools/NumberLine'));
const FractionTool = lazy(() => import('../pages/tools/FractionTool'));
const ShapeDrawing = lazy(() => import('../pages/tools/ShapeDrawing'));
const GraphCreator = lazy(() => import('../pages/tools/GraphCreator'));
const ProblemTemplate = lazy(() => import('../pages/tools/ProblemTemplate'));
const PlaceValue = lazy(() => import('../pages/tools/PlaceValue'));
const EquationArea = lazy(() => import('../pages/tools/EquationArea'));
const FormulaNotebook = lazy(() => import('../pages/tools/FormulaNotebook'));
const NoiseMeter = lazy(() => import('../pages/tools/NoiseMeter'));
const DictionaryTool = lazy(() => import('../pages/tools/DictionaryTool'));

interface ToolRouterProps {
  toolId: string;
  onBack: () => void;
}

export default function ToolRouter({ toolId, onBack }: ToolRouterProps) {
  const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-white text-2xl font-bold animate-pulse">Yükleniyor...</div>
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      {toolId === 'calculator' && <Calculator onBack={onBack} />}
      {toolId === 'ruler' && <RulerAngle onBack={onBack} />}
      {toolId === 'scratch' && <ScratchPad onBack={onBack} />}
      {toolId === 'converter' && <UnitConverter onBack={onBack} />}
      {toolId === 'writing' && <WritingTool onBack={onBack} />}
      {toolId === 'reading' && <ReadingBar onBack={onBack} />}
      {toolId === 'multiplication' && <MultiplicationTable onBack={onBack} />}
      {toolId === 'date' && <DateCalculator onBack={onBack} />}
      {toolId === 'numberline' && <NumberLine onBack={onBack} />}
      {toolId === 'fraction' && <FractionTool onBack={onBack} />}
      {toolId === 'shapes' && <ShapeDrawing onBack={onBack} />}
      {toolId === 'graph' && <GraphCreator onBack={onBack} />}
      {toolId === 'problem' && <ProblemTemplate onBack={onBack} />}
      {toolId === 'placevalue' && <PlaceValue onBack={onBack} />}
      {toolId === 'equation' && <EquationArea onBack={onBack} />}
      {toolId === 'formula' && <FormulaNotebook onBack={onBack} />}
      {toolId === 'noise-meter' && <NoiseMeter onBack={onBack} />}
      {toolId === 'dictionary' && <DictionaryTool onBack={onBack} />}
    </Suspense>
  );
}
