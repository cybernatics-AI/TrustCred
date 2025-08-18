#!/bin/bash

# TrustCred Database Setup Script
# This script sets up PostgreSQL and Redis using Docker Compose

echo "🚀 Setting up TrustCred Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first."
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Function to start services
start_services() {
    echo "📦 Starting PostgreSQL and Redis..."
    docker-compose up -d
    
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    # Check if services are healthy
    if docker-compose ps | grep -q "healthy"; then
        echo "✅ All services are running and healthy!"
        echo ""
        echo "🌐 Access URLs:"
        echo "   PostgreSQL: localhost:5432"
        echo "   Redis: localhost:6379"
        echo "   pgAdmin: http://localhost:5050 (admin@trustcred.com / admin)"
        echo ""
        echo "📊 Database Info:"
        echo "   Database: trustcred_dev"
        echo "   Username: postgres"
        echo "   Password: postgres"
        echo ""
        echo "🔧 To stop services: ./setup-db.sh stop"
        echo "🔧 To view logs: ./setup-db.sh logs"
    else
        echo "⚠️ Services are starting up. Check status with: ./setup-db.sh status"
    fi
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker-compose down
    echo "✅ Services stopped"
}

# Function to show status
show_status() {
    echo "📊 Service Status:"
    docker-compose ps
}

# Function to show logs
show_logs() {
    echo "📋 Service Logs:"
    docker-compose logs -f
}

# Function to reset database
reset_db() {
    echo "🗑️ Resetting database (this will delete all data)..."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        docker-compose down -v
        docker-compose up -d
        echo "✅ Database reset complete"
    else
        echo "❌ Database reset cancelled"
    fi
}

# Function to connect to database
connect_db() {
    echo "🔌 Connecting to PostgreSQL..."
    docker exec -it trustcred-postgres psql -U postgres -d trustcred_dev
}

# Main script logic
case "${1:-start}" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    reset)
        reset_db
        ;;
    connect)
        connect_db
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs|reset|connect}"
        echo ""
        echo "Commands:"
        echo "  start   - Start all services (default)"
        echo "  stop    - Stop all services"
        echo "  status  - Show service status"
        echo "  logs    - Show service logs"
        echo "  reset   - Reset database (delete all data)"
        echo "  connect - Connect to PostgreSQL CLI"
        exit 1
        ;;
esac
