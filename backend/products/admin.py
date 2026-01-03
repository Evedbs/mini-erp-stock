from django.contrib import admin
from .models import Ingredient, Dish, RecipeLine, StockMovement

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'stock_quantity', 'unit', 'cost_per_unit')
    search_fields = ('name', 'sku')

class RecipeLineInline(admin.TabularInline):
    model = RecipeLine
    extra = 1
    autocomplete_fields = ['ingredient']

@admin.register(Dish)
class DishAdmin(admin.ModelAdmin):
    list_display = ('name', 'sale_price', 'food_cost_display', 'margin_display')
    search_fields = ('name',)
    inlines = [RecipeLineInline]

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