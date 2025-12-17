from rest_framework import serializers
from .models import Ingredient, Dish, RecipeLine, StockMovement

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = '__all__'

class RecipeLineSerializer(serializers.ModelSerializer):
    # On affiche le nom de l'ingrédient et son unité pour faciliter la lecture
    ingredient_name = serializers.ReadOnlyField(source='ingredient.name')
    ingredient_unit = serializers.ReadOnlyField(source='ingredient.unit')
    ingredient_cost = serializers.ReadOnlyField(source='ingredient.cost_per_unit')

    class Meta:
        model = RecipeLine
        fields = ['id', 'ingredient', 'ingredient_name', 'ingredient_unit', 'ingredient_cost', 'quantity_needed']

class DishSerializer(serializers.ModelSerializer):
    # Nested serializer : on veut voir la recette directement dans l'objet Dish
    recipe_lines = RecipeLineSerializer(many=True, read_only=True)
    
    # Champs calculés
    food_cost = serializers.ReadOnlyField()
    margin = serializers.ReadOnlyField()

    class Meta:
        model = Dish
        fields = ['id', 'name', 'sale_price', 'recipe_lines', 'food_cost', 'margin']

class StockMovementSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')
    ingredient_name = serializers.ReadOnlyField(source='ingredient.name')

    class Meta:
        model = StockMovement
        fields = '__all__'