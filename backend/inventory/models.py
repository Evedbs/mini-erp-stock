from django.db import models

class Product(models.Model):
    # base de la logique ERP.
    sku = models.CharField(max_length=50, unique=True, verbose_name="Référence SKU")
    
    name = models.CharField(max_length=200, verbose_name="Nom du produit")
    
    # Gestion des stocks
    quantity = models.IntegerField(default=0, verbose_name="Quantité en stock")
    
    # Prix avec 2 décimales
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Prix unitaire")
    
    # Dates automatiques
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        # Ce qui s'affichera dans l'interface d'admin
        return f"{self.sku} - {self.name}"