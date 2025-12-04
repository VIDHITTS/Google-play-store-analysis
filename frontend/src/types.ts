export interface FormData {
  category: string;
  size: string;
  type: 'Free' | 'Paid';
  price: string;
  contentRating: string;
}

export interface Metadata {
  categories: string[];
  types: string[];
  content_ratings: string[];
}

export interface PredictionResponse {
  success: boolean;
  prediction: string;
  message: string;
  details: {
    category: string;
    size: number;
    type: string;
    price: number;
    contentRating: string;
  };
}