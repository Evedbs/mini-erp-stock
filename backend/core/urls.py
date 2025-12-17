from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from products.views import IngredientViewSet, DishViewSet, StockMovementViewSet, RecipeLineViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'ingredients', IngredientViewSet)
router.register(r'dishes', DishViewSet)
router.register(r'recipe-lines', RecipeLineViewSet)
router.register(r'movements', StockMovementViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
]