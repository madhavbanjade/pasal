

export type APIResponse<T = unknown> =
  | {
      success: true;
      data: T;
      error: null;
    }
  | {
      success: false;
      data: null;
      error: string;
    };

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
}


export type CategoryCardProps = {
  title: string;
  productCount: number;
  startingPrice: number;
  image: string;
  href: string;
};