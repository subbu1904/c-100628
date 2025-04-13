
import { DatabaseClient, QueryResult } from "@/types/database";

// Mock database implementation for browser environments
class MockPool implements DatabaseClient {
  // Simple in-memory cache for mock data
  private mockData: Record<string, any[]> = {
    users: [
      { 
        id: '1', 
        email: 'demo@example.com', 
        name: 'Demo User', 
        role: 'free',
        avatarUrl: '/placeholder.svg',
        createdAt: new Date().toISOString(),
        isPremium: false
      }
    ],
    categories: [],
    super_categories: [],
    messages: []
  };

  query<T = any>(text: string, params?: any[]): Promise<QueryResult<T>> {
    console.log('MOCK DB: Query executed:', text, params);
    
    // Parse the query to determine the operation and table
    let mockResult: any[] = [];
    
    if (text.toLowerCase().includes('select') && text.toLowerCase().includes('from users')) {
      mockResult = this.mockData.users;
    } else if (text.toLowerCase().includes('select') && text.toLowerCase().includes('from categories')) {
      mockResult = this.mockData.categories;
    } else if (text.toLowerCase().includes('select') && text.toLowerCase().includes('from super_categories')) {
      mockResult = this.mockData.super_categories;
    } else if (text.toLowerCase().includes('select') && text.toLowerCase().includes('from messages')) {
      mockResult = this.mockData.messages;
    }
    
    // Filter results if where clause is present
    if (params && params.length > 0 && text.toLowerCase().includes('where')) {
      // Very simple filtering logic - would be replaced by actual SQL in a real DB
      if (text.includes('email = $1')) {
        mockResult = mockResult.filter(item => item.email === params[0]);
      } else if (text.includes('id = $1')) {
        mockResult = mockResult.filter(item => item.id === params[0]);
      }
    }
    
    return Promise.resolve({ rows: mockResult as T[], rowCount: mockResult.length });
  }

  connect() {
    console.log('MOCK DB: Connection requested');
    return Promise.resolve({
      query: <T = any>(text: string, params?: any[]): Promise<QueryResult<T>> => {
        console.log('MOCK DB: Client query executed:', text, params);
        return this.query(text, params);
      },
      release: () => {
        console.log('MOCK DB: Client released');
      }
    });
  }
  
  // Add a method to seed mock data
  seedMockData(table: string, data: any[]) {
    this.mockData[table] = data;
    console.log(`MOCK DB: Seeded ${data.length} records into ${table} table`);
  }
}

// In browser environments we use a mock implementation
// In Node.js environments we would use the real pg Pool
const pool = new MockPool();

// Seed some initial mock data for testing
if (process.env.NODE_ENV === 'development') {
  // Add some categories
  pool.seedMockData('categories', [
    {
      id: 'cat1',
      name: 'DeFi',
      description: 'Decentralized Finance tokens and protocols',
      slug: 'defi',
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      assetIds: ['ethereum', 'chainlink', 'uniswap', 'aave'],
    },
    {
      id: 'cat2',
      name: 'Layer 1',
      description: 'Base blockchain protocols',
      slug: 'layer-1',
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      assetIds: ['bitcoin', 'ethereum', 'solana', 'cardano', 'avalanche'],
    }
  ]);
  
  // Add some super categories
  pool.seedMockData('super_categories', [
    {
      id: 'sc1',
      name: 'Cryptocurrencies',
      slug: 'cryptocurrencies',
      color: '#9b87f5',
      description: 'Digital or virtual currencies that use cryptography for security',
      isEnabled: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'sc2',
      name: 'Tokens',
      slug: 'tokens',
      color: '#7E69AB',
      description: 'Cryptographic tokens represent programmable assets or access rights',
      isEnabled: true,
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]);
}

console.log('Using mock database implementation for browser environment');

export default pool;
