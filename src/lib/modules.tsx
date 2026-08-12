export type { LessonContent, ModuleDef } from './moduleTypes';

import type { ModuleDef } from './moduleTypes';
import { llmTwinModule } from './content/ch01-llm-twin';
import { toolingModule } from './content/ch02-tooling';
import { dataEngineeringModule } from './content/ch03-data-engineering';
import { ragFeatureModule } from './content/ch04-rag-feature';
import { sftModule } from './content/ch05-sft';
import { preferenceAlignmentModule } from './content/ch06-preference-alignment';
import { evaluationModule } from './content/ch07-evaluation';
import { inferenceOptimizationModule } from './content/ch08-inference-optimization';
import { ragInferenceModule } from './content/ch09-rag-inference';
import { deploymentModule } from './content/ch10-deployment';
import { mlopsLlmopsModule } from './content/ch11-mlops-llmops';
import { mlopsPrinciplesModule } from './content/ch12-mlops-principles';

export const modules: ModuleDef[] = [
  llmTwinModule,
  toolingModule,
  dataEngineeringModule,
  ragFeatureModule,
  sftModule,
  preferenceAlignmentModule,
  evaluationModule,
  inferenceOptimizationModule,
  ragInferenceModule,
  deploymentModule,
  mlopsLlmopsModule,
  mlopsPrinciplesModule,
];
