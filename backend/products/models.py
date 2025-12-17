from django.db import models
from django.contrib.auth.models import User

class Ingredient(models.Model):
    """ Matière première achetée et stockée (Ex: Farine, Steak, Tomate) """
    UNIT_CHOICES = [
        ('kg', 'Kilogramme'),
        ('l', 'Litre'),
        ('unit', 'Unité'),
    ]

    name = models.CharField(max_length=200, verbose_name="Nom de l'ingrédient")
    sku = models.CharField(max_length=50, unique=True, verbose_name="Réf Fournisseur")
    cost_per_unit = models.DecimalField(max_digits=10, decimal_places=4, verbose_name="Coût d'achat par unité")
    unit = models.CharField(max_length=10, choices=UNIT_CHOICES, default='kg')
    stock_quantity = models.FloatField(default=0.0, verbose_name="Stock actuel")
    
    def __str__(self):
        return f"{self.name} ({self.stock_quantity} {self.unit})"

class Dish(models.Model):
    """ Produit fini vendu au POS (Ex: Burger Classique) """
    name = models.CharField(max_length=200)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix de vente TTC")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    @property
    def food_cost(self):
        """ Calcule le coût matière total du plat """
        total_cost = 0
        for line in self.recipe_lines.all():
            total_cost += float(line.ingredient.cost_per_unit) * line.quantity_needed
        return round(total_cost, 2)

    @property
    def margin(self):
        """ Calcule la marge brute """
        if self.sale_price == 0: return 0
        cost = self.food_cost
        # On considère le prix de vente HT (approximation TVA 10% pour l'exemple)
        price_ht = float(self.sale_price) / 1.10 
        return round(price_ht - cost, 2)

class RecipeLine(models.Model):
    """ Ligne de recette : 1 Burger contient 0.150kg de Steak """
    dish = models.ForeignKey(Dish, on_delete=models.CASCADE, related_name='recipe_lines')
    ingredient = models.ForeignKey(Ingredient, on_delete=models.PROTECT) # On ne veut pas supprimer un ingrédient utilisé
    quantity_needed = models.FloatField(verbose_name="Quantité requise (dans l'unité de l'ingrédient)")

    def __str__(self):
        return f"{self.dish.name} - {self.ingredient.name}"

# On garde le mouvement de stock, mais lié aux Ingrédients maintenant
class StockMovement(models.Model):
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, related_name='movements')
    quantity = models.FloatField()
    reason = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def save(self, *args, **kwargs):
        self.ingredient.stock_quantity += self.quantity
        self.ingredient.save()
        super().save(*args, **kwargs)