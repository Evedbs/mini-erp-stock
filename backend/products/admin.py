from django.contrib import admin
from .models import Ingredient, Dish, RecipeLine, StockMovement

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'stock_quantity', 'unit', 'cost_per_unit')
    search_fields = ('name', 'sku')

# Cette classe permet d'ajouter des ingrédients directement dans la page d'un Plat
class RecipeLineInline(admin.TabularInline):
    model = RecipeLine
    extra = 1 # Affiche une ligne vide par défaut pour ajouter un ingrédient
    autocomplete_fields = ['ingredient'] # Pratique si tu as beaucoup d'ingrédients

@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'sale_price', 'food_cost_display', 'margin_display')
    search_fields = ('name',)
    inlines = [RecipeLineInline] # Ajoute le tableau des ingrédients ici

    # On utilise des méthodes pour afficher les propriétés calculées dans l'admin
    def food_cost_display(self, obj):
        return f"{obj.food_cost} €"
    food_cost_display.short_description = "Coût Matière"

    def margin_display(self, obj):
        return f"{obj.margin} €"
    margin_display.short_description = "Marge Brute"

@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ('ingredient', 'quantity', 'reason', 'user', 'created_at')
    list_filter = ('reason', 'created_at')