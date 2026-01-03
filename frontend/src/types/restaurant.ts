export interface Ingredient {
  id: number;
  name: string;
  sku: string;
  cost_per_unit: string;
  unit: "kg" | "l" | "unit";
  stock_quantity: number;
}

export interface RecipeLine {
  id: number;
  ingredient: number;
  ingredient_name: string;
  ingredient_unit: string;
  quantity_needed: number;
}

export interface Dish {
  id: number;
  name: string;
  sale_price: string;
  food_cost: number;
  margin: number;
  recipe_lines: RecipeLine[];
}

export interface StockMovement {
  id: number;
  ingredient_name: string;
  quantity: number;
  reason: string;
  user: string;
  created_at: string;
}
