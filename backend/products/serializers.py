from rest_framework import serializers
from .models import Product, StockMovement

class StockMovementSerializer(serializers.ModelSerializer):
    # On veut afficher le nom de l'user, pas juste son ID 1 ou 2
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = StockMovement
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'