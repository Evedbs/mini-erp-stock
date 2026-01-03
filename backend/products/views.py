from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
import csv
from rest_framework.permissions import IsAuthenticated
from django.db import transaction
from .models import Ingredient, Dish, StockMovement, RecipeLine
from .serializers import (
    IngredientSerializer, 
    DishSerializer, 
    StockMovementSerializer,
    RecipeLineSerializer
)

class IngredientViewSet(viewsets.ModelViewSet):
    queryset = Ingredient.objects.all().order_by('name')
    serializer_class = IngredientSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def receive_stock(self, request, pk=None):
        """
        Gère la réception de marchandise.
        Body: { "quantity": 10, "new_price": 1.50 (optionnel) }
        """
        ingredient = self.get_object()
        try:
            raw_qty = request.data.get('quantity', 0)
            if raw_qty is None: raw_qty = 0
            quantity_received = float(raw_qty)
            
            new_price = request.data.get('new_price')
        except (ValueError, TypeError):
            return Response({"error": "Format invalide"}, status=status.HTTP_400_BAD_REQUEST)

        if quantity_received <= 0:
             return Response({"error": "La quantité doit être positive"}, status=status.HTTP_400_BAD_REQUEST)

        with transaction.atomic():
            if new_price is not None and str(new_price).strip() != "":
                try:
                    price_val = float(new_price)
                    if price_val > 0:
                        ingredient.cost_per_unit = price_val
                except ValueError:
                    pass

            StockMovement.objects.create(
                ingredient=ingredient,
                quantity=quantity_received,
                reason="Livraison Fournisseur",
                user=request.user
            )

            ingredient.stock_quantity += quantity_received
            ingredient.save()

        return Response({
            "status": "Stock updated", 
            "new_stock": ingredient.stock_quantity,
            "new_price": ingredient.cost_per_unit
        })


class DishViewSet(viewsets.ModelViewSet):
    queryset = Dish.objects.all().order_by('name')
    serializer_class = DishSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['post'])
    def register_sale(self, request, pk=None):
        dish = self.get_object()
        quantity_sold = int(request.data.get('quantity', 1))

        with transaction.atomic():
            recipe_lines = dish.recipe_lines.all()
            
            if not recipe_lines:
                return Response(
                    {"warning": "Ce plat n'a pas de recette, aucun stock déduit."}, 
                    status=status.HTTP_200_OK
                )

            movements = []
            for line in recipe_lines:
                total_qty_needed = line.quantity_needed * quantity_sold
                movements.append(StockMovement(
                    ingredient=line.ingredient,
                    quantity=-total_qty_needed, 
                    reason=f"Vente: {quantity_sold}x {dish.name}",
                    user=request.user
                ))

            StockMovement.objects.bulk_create(movements)

            for m in movements:
                m.ingredient.stock_quantity += m.quantity
                m.ingredient.save()

        return Response({"status": "Stock updated", "dish": dish.name}, status=status.HTTP_201_CREATED)


class RecipeLineViewSet(viewsets.ModelViewSet):
    queryset = RecipeLine.objects.all()
    serializer_class = RecipeLineSerializer
    permission_classes = [IsAuthenticated]


class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all().order_by('-created_at')
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=False, methods=['get'])
    def export_csv(self, request):
        """
        Génère un fichier CSV de tout l'historique
        """
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="historique_stock.csv"'

        response.write(u'\ufeff'.encode('utf8'))

        writer = csv.writer(response, delimiter=';')

        writer.writerow(['Date', 'Heure', 'Utilisateur', 'Type', 'Ingrédient', 'Quantité', 'Raison'])

        movements = self.filter_queryset(self.get_queryset())
        for move in movements:
            writer.writerow([
                move.created_at.strftime("%d/%m/%Y"), # Date
                move.created_at.strftime("%H:%M"),    # Heure
                move.user.username if move.user else "Système",
                "Entrée" if move.quantity > 0 else "Sortie",
                move.ingredient.name,
                move.quantity,
                move.reason
            ])

        return response