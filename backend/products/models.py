from django.db import models
from django.contrib.auth.models import User # Pour lier à l'utilisateur

class Product(models.Model):
    sku = models.CharField(max_length=50, unique=True)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.IntegerField(default=0) 
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.sku} - {self.name}"

class StockMovement(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='movements')
    quantity = models.IntegerField()
    reason = models.CharField(max_length=200, blank=True) # Ex: "Vente", "Réappro", "Casse"
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True) # Si l'user est supprimé, on garde l'historique

    def save(self, *args, **kwargs):
        # Avant de sauvegarder le mouvement, on met à jour le produit lié
        self.product.stock_quantity += self.quantity
        self.product.save()
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.quantity} on {self.product.name}"