from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer

class ProductViewSet(viewsets.ModelViewSet):
    # tri par ID pour que l'ordre ne change jamais dans le tableau React
    queryset = Product.objects.all().order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

# --- NOUVEAU VIEWSET ---
class StockMovementViewSet(viewsets.ModelViewSet):
    queryset = StockMovement.objects.all().order_by('-created_at') # Du plus récent au plus vieux
    serializer_class = StockMovementSerializer
    permission_classes = [IsAuthenticated]

    # injecter automatiquement l'utilisateur connecté
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)