export type { LessonContent, ModuleDef } from './moduleTypes';

import type { ModuleDef } from './moduleTypes';
import { architecturesModule } from './content/architectures';
import { trainingModule } from './content/training';
import { gpuModule } from './content/gpu';
import { quantizationModule } from './content/quantization';
import { batchingModule } from './content/batching';
import { kvCacheModule } from './content/kvcache';
import { enginesModule } from './content/engines';
import { distributedModule } from './content/distributed';
import { servingModule } from './content/serving';
import { retrievalModule } from './content/retrieval';
import { cachingModule } from './content/caching';
import { observabilityModule } from './content/observability';
import { attentionModule } from './content/attention';

export const modules: ModuleDef[] = [
  architecturesModule,
  attentionModule,
  trainingModule,
  gpuModule,
  quantizationModule,
  distributedModule,
  batchingModule,
  kvCacheModule,
  enginesModule,
  servingModule,
  retrievalModule,
  cachingModule,
  observabilityModule,
];
