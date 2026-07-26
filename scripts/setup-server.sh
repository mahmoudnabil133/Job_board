#!/bin/bash
set -e

echo "=== HireITIan Server Setup ==="

# Update system
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get install -y ca-certificates curl gnupg
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    echo "Docker installed."
else
    echo "Docker already installed."
fi

# Add current user to docker group
sudo usermod -aG docker $USER

# Create app directory
sudo mkdir -p /opt/hireitian
sudo chown $USER:$USER /opt/hireitian

# Clone repo if not already present
if [ ! -d "/opt/hireitian/.git" ]; then
    echo "Cloning repository..."
    cd /opt/hireitian
    git clone https://github.com/mahmoudnabil133/Job_board.git .
else
    echo "Repository already exists."
    cd /opt/hireitian
    git pull origin main
fi

# Create .env for backend if not exists
if [ ! -f "/opt/hireitian/api/.env" ]; then
    echo "Creating .env from .env.example..."
    cp api/.env.example api/.env
    echo ""
    echo "========================================="
    echo "  IMPORTANT: Edit api/.env with your DB credentials"
    echo "  Required values:"
    echo "    DB_HOST=db"
    echo "    DB_PORT=3306"
    echo "    DB_DATABASE=hireitian"
    echo "    DB_USERNAME=hireitian"
    echo "    DB_PASSWORD=secret"
    echo "    APP_KEY= (will be generated)"
    echo "========================================="
fi

# Generate app key
cd /opt/hireitian/api
docker compose -f ../docker-compose.prod.yml exec backend php artisan key:generate --force 2>/dev/null || true

# Build and start
cd /opt/hireitian
echo "Building and starting containers..."
docker compose -f docker-compose.prod.yml up -d --build

# Wait for DB
echo "Waiting for database..."
sleep 10

# Run migrations
echo "Running migrations..."
docker compose -f docker-compose.prod.yml exec -T backend php artisan migrate --force

# Cache
echo "Caching config..."
docker compose -f docker-compose.prod.yml exec -T backend php artisan config:cache
docker compose -f docker-compose.prod.yml exec -T backend php artisan route:cache

echo ""
echo "=== Setup Complete ==="
echo "Frontend: http://$(curl -s ifconfig.me)"
echo "API: http://$(curl -s ifconfig.me)/api"
