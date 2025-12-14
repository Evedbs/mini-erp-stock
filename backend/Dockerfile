# Instruction 1 : L'image de base
FROM python:3.13-slim

# Instruction 2 : Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instruction 3 : Création du dossier de travail
WORKDIR /app

# Instruction 4 : Installation des dépendances
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Instruction 5 : Copie du code source
COPY . /app/

# Instruction 6 : Commande de démarrage
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]