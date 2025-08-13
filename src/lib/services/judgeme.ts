import { getDecryptedToken } from '@/lib/tokens';

export interface JudgeMeReview {
  id: number;
  rating: number;
  title?: string;
  body: string;
  reviewer: {
    name?: string;
    email?: string;
  };
  created_at: string;
  product_external_id?: string;
  product_title?: string;
  verified?: boolean;
  helpful?: number;
  [key: string]: any; // For additional fields
}

export interface JudgeMeShopInfo {
  shop_domain: string;
  shop_name: string;
  [key: string]: any;
}

export interface JudgeMeApiResponse<T> {
  reviews?: T[];
  shop?: JudgeMeShopInfo;
  [key: string]: any;
}

export class JudgeMeService {
  private baseUrl = 'https://judge.me/api/v1';
  private orgId: string;

  constructor(orgId: string) {
    this.orgId = orgId;
  }

  private async getQueryAuthParams() {
    const { token, plainTextData } = await getDecryptedToken(this.orgId, 'judge_me');
    const shopDomain = (plainTextData?.storeUrl || '')
      .replace(/^https?:\/\//, '')
      .replace(/\/$/, '');
    return { api_token: token, shop_domain: shopDomain } as Record<string, string>;
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const authParams = await this.getQueryAuthParams();
    const queryString = new URLSearchParams({ ...authParams, ...params } as any).toString();
    const url = `${this.baseUrl}${endpoint}?${queryString}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Lint-Studio/1.0',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Judge.me API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async getAllReviews(params: {
    page?: number;
    per_page?: number;
    rating?: number;
    product_id?: string;
  } = {}): Promise<JudgeMeReview[]> {
    try {
      const response = await this.makeRequest<JudgeMeApiResponse<JudgeMeReview>>('/reviews', {
        ...params,
      });

      return response.reviews || [];
    } catch (error) {
      console.error('Error fetching all reviews:', error);
      throw error;
    }
  }

  async getProductReviews(productId: string, params: {
    page?: number;
    per_page?: number;
    rating?: number;
  } = {}): Promise<JudgeMeReview[]> {
    try {
      const response = await this.makeRequest<JudgeMeApiResponse<JudgeMeReview>>('/reviews', {
        product_id: productId,
        ...params,
      });

      return response.reviews || [];
    } catch (error) {
      console.error('Error fetching product reviews:', error);
      throw error;
    }
  }

  async getShopInfo(): Promise<JudgeMeShopInfo> {
    try {
      // Shop endpoint may not exist publicly; verifying via a small reviews page fetch
      const reviews = await this.getAllReviews({ per_page: 1, page: 1 });
      const { shop_domain } = await this.getQueryAuthParams();
      return { shop_domain, shop_name: shop_domain } as JudgeMeShopInfo;
    } catch (error) {
      console.error('Error fetching shop info:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      // Try to fetch a single page of reviews with minimal payload
      await this.getAllReviews({ page: 1 as any, per_page: 1 as any });
      return true;
    } catch (error) {
      console.error('Judge.me connection test failed:', error);
      return false;
    }
  }

  private async getApiToken(): Promise<string> {
    const { token } = await getDecryptedToken(this.orgId, 'judge_me');
    return token;
  }

  // Helper method to transform Judge.me review to our Review model format
  transformReview(review: JudgeMeReview, organizationId: string) {
    return {
      organizationId,
      externalId: review.id.toString(),
      productId: review.product_external_id,
      productTitle: review.product_title,
      rating: review.rating,
      title: review.title,
      body: review.body,
      reviewerName: review.reviewer?.name,
      reviewerEmail: review.reviewer?.email,
      reviewDate: new Date(review.created_at),
      verified: review.verified || false,
      helpful: review.helpful || 0,
      source: 'judge_me',
      rawData: JSON.stringify(review),
    };
  }
}
