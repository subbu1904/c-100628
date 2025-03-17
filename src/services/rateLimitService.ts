
// Mock implementation of a rate limiter for the frontend
// In a real application, this would be implemented on the backend

interface RateLimitRecord {
  endpoint: string;
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitRecord> = new Map();
  
  // Default limits per endpoint category (requests per minute)
  private defaultLimits: Record<string, number> = {
    'search': 10,       // 10 searches per minute
    'assets': 20,       // 20 asset requests per minute
    'recommendations': 5, // 5 recommendation actions per minute
    'messages': 30,     // 30 message actions per minute
    'default': 60       // 60 general requests per minute
  };
  
  // Get client identifier (in a real app, this would be more sophisticated)
  private getClientId(): string {
    return 'client';
  }
  
  // Check if a request is allowed
  public async isAllowed(endpoint: string, category: keyof typeof this.defaultLimits = 'default'): Promise<boolean> {
    const clientId = this.getClientId();
    const key = `${clientId}:${endpoint}`;
    const now = Date.now();
    const limit = this.defaultLimits[category] || this.defaultLimits.default;
    
    // Get current record or initialize a new one
    let record = this.limits.get(key);
    
    if (!record) {
      record = {
        endpoint,
        count: 0,
        resetTime: now + 60000 // 1 minute from now
      };
    }
    
    // If reset time has passed, reset the counter
    if (now > record.resetTime) {
      record = {
        endpoint,
        count: 0,
        resetTime: now + 60000 // 1 minute from now
      };
    }
    
    // Check if we've hit the limit
    if (record.count >= limit) {
      console.warn(`Rate limit exceeded for ${category}:${endpoint}`);
      return false;
    }
    
    // Increment the counter and update the record
    record.count += 1;
    this.limits.set(key, record);
    
    return true;
  }
  
  // Simulate rate limiting in action
  public async checkEndpoint(endpoint: string, category: keyof typeof this.defaultLimits = 'default'): Promise<void> {
    const isAllowed = await this.isAllowed(endpoint, category);
    
    if (!isAllowed) {
      throw new Error(`Rate limit exceeded. Please try again later.`);
    }
  }
}

// Export a singleton instance
export const rateLimiter = new RateLimiter();
