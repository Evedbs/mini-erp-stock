// src/types/restaurant.ts

export interface Ingredient {
  id: number;
  name: string;
  sku: string;
  cost_per_unit: string; // Django envoie les Decimal en string
  unit: "kg" | "l" | "unit";
  stock_quantity: number;
}

export interface RecipeLine {
  id: number;
  ingredient: number; // ID de l'ingrédient
  ingredient_name: string;
  ingredient_unit: string;
  quantity_needed: number;
}

export interface Dish {
  id: number;
  name: string;
  sale_price: string;
  // Ces champs sont calculés par le backend (property)
  food_cost: number;
  margin: number;
  recipe_lines: RecipeLine[];
}

export interface StockMovement {
  id: number;
  ingredient_name: string; // Vient du Serializer (ReadOnlyField)
  quantity: number;
  reason: string;
  user: string;
  created_at: string;
}
