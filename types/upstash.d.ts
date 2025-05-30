declare module '@upstash/ratelimit' {
  export class Ratelimit {
    static slidingWindow(max: number, window: string): any;
    constructor(config: {
      redis: any;
      limiter: any;
    });
    limit(identifier: string): Promise<{ success: boolean }>;
  }
}

declare module '@upstash/redis' {
  export class Redis {
    static fromEnv(): any;
  }
} 