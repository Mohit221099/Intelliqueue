import { Queue, Worker, ConnectionOptions } from 'bullmq';
import { redis } from './redis';
import prisma from './prisma';

// Use plain connection options for BullMQ to avoid ioredis version conflicts
// (bullmq bundles its own ioredis internally, causing type mismatches with the top-level ioredis)
const bullmqConnection: ConnectionOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

export const QUEUE_NAME = 'IntelliQueueRebalancing';

export const rebalanceQueue = new Queue(QUEUE_NAME, { connection: bullmqConnection });

export const initBackgroundWorker = () => {
  return new Worker(QUEUE_NAME, async (job) => {
    switch(job.name) {
      case 'recalculate-eta':
        // ML-based Wait Time Prediction Simulation
        const { branchId } = job.data;
        const branchTokenCount = await prisma.token.count({
          where: { branchId, status: 'WAITING' }
        });
        
        // Simulating caching average wait time per branch
        const newAverageWaitTime = 15; // default 15 mins
        const currentEta = branchTokenCount * newAverageWaitTime;
        
        console.log(`[Worker] Calculated ETA for branch ${branchId}: ${currentEta} mins.`);
        
        // Cache ETA securely
        await redis.set(`branch-eta-${branchId}`, currentEta);
        break;
        
      case 'skip-no-show':
        const { tokenId } = job.data;
        console.log(`[Worker] Skipping inactive token: ${tokenId}`);
        await prisma.token.update({
          where: { id: tokenId },
          data: { status: 'SKIPPED' }
        });
        break;
        
      default:
        console.log(`[Worker] Unknown job name: ${job.name}`);
    }
  }, { connection: bullmqConnection });
};
