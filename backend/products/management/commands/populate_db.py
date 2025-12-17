import random
from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from products.models import Ingredient, Dish, StockMovement
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = "V5: Adapté à ton models.py (sale_price et unique SKU)"

    def handle(self, *args, **kwargs):
        self.stdout.write("⚠️  Nettoyage complet de la base de données...")
        
        # 1. On efface tout
        # L'ordre est important car StockMovement dépend de Ingredient
        StockMovement.objects.all().delete()
        Dish.objects.all().delete()
        Ingredient.objects.all().delete()
        
        # 2. On s'assure d'avoir un user
        user, _ = User.objects.get_or_create(username='eve', defaults={'email': 'eve@example.com'})

        # 3. Création des Ingrédients
        self.stdout.write("Creating ingredients...")
        ingredients_data = [
            ("Farine", "kg", 1.50),
            ("Tomate", "kg", 3.00),
            ("Mozzarella", "kg", 12.00),
            ("Jambon", "kg", 15.00),
            ("Oeuf", "unit", 0.30),
            ("Sucre", "kg", 1.00),
            ("Chocolat", "kg", 20.00),
            ("Saumon", "kg", 25.00),
        ]
        
        created_ingredients = []
        for i, (name, unit, cost) in enumerate(ingredients_data):
            # Génère un SKU unique pour satisfaire la contrainte unique=True
            unique_sku = f"ING-{i+1:03d}" 
            
            ing = Ingredient.objects.create(
                name=name, 
                unit=unit, 
                cost_per_unit=cost, 
                stock_quantity=0, # On part de 0, les mouvements d'achat rempliront le stock
                sku=unique_sku
            )
            created_ingredients.append(ing)

        # 4. Création des Plats
        self.stdout.write("Creating dishes...")
        dishes_data = [
            ("Pizza Margherita", 12.00),
            ("Pizza Reine", 14.00),
            ("Pates Carbo", 13.00),
            ("Mousse Chocolat", 6.00),
            ("Pavé de Saumon", 18.00),
        ]
        
        created_dishes = []
        for name, price_val in dishes_data:
            # CORRECTION ICI : Utilisation de 'sale_price' comme dans ton modèle
            dish = Dish.objects.create(name=name, sale_price=price_val)
            created_dishes.append(dish)

        # 5. Génération des 1000 mouvements
        self.stdout.write("Génération de l'historique (1000 lignes)...")
        today = timezone.now()
        
        for _ in range(1000):
            days_ago = random.randint(0, 180)
            fake_date = today - timedelta(days=days_ago)
            
            action_type = random.choices(['SALE', 'PURCHASE', 'LOSS'], weights=[70, 25, 5])[0]

            if action_type == 'SALE':
                dish = random.choice(created_dishes)
                ing = random.choice(created_ingredients)
                qty = round(random.uniform(0.1, 0.5), 2)
                
                movement = StockMovement.objects.create(
                    ingredient=ing,
                    quantity=-qty, # Négatif pour vente
                    reason=f"Vente: {dish.name}",
                    user=user
                )
            
            elif action_type == 'PURCHASE':
                ing = random.choice(created_ingredients)
                qty = round(random.uniform(2.0, 20.0), 1)
                
                movement = StockMovement.objects.create(
                    ingredient=ing,
                    quantity=qty, # Positif pour achat
                    reason="Livraison Fournisseur",
                    user=user
                )

            else: # LOSS
                ing = random.choice(created_ingredients)
                qty = round(random.uniform(0.1, 1.0), 2)
                
                movement = StockMovement.objects.create(
                    ingredient=ing,
                    quantity=-qty, # Négatif pour perte
                    reason="Perte / Périmé",
                    user=user
                )

            # ASTUCE IMPORTANTE :
            # Ton modèle a auto_now_add=True sur created_at.
            # De plus, ta méthode save() modifie le stock.
            # Si on refait movement.save(), on fausse le stock (double comptage).
            # On utilise .update() pour modifier la date directement en SQL sans déclencher save().
            StockMovement.objects.filter(pk=movement.pk).update(created_at=fake_date)

        self.stdout.write(self.style.SUCCESS(f"Terminé ! 1000 mouvements créés."))