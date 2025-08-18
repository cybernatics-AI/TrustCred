#!/bin/bash

# TrustCred Simple Database Setup Script
# This bypasses docker-compose issues by using individual Docker commands

echo "🚀 Setting up TrustCred Development Environment (Simple Mode)..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is available"

# Function to start services
start_services() {
    echo "📦 Starting PostgreSQL..."
    
    # Start PostgreSQL
    docker run -d \
        --name trustcred-postgres \
        -e POSTGRES_DB=trustcred_dev \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -p 5432:5432 \
        -v postgres_data:/var/lib/postgresql/data \
        postgres:13
    
    echo "📦 Starting Redis..."
    
    # Start Redis
    docker run -d \
        --name trustcred-redis \
        -p 6379:6379 \
        redis:6-alpine
    
    echo "⏳ Waiting for services to be ready..."
    sleep 15
    
    # Check if services are running
    if docker ps | grep -q "trustcred-postgres" && docker ps | grep -q "trustcred-redis"; then
        echo "✅ All services are running!"
        echo ""
        echo "🌐 Access URLs:"
        echo "   PostgreSQL: localhost:5432"
        echo "   Redis: localhost:6379"
        echo ""
        echo "📊 Database Info:"
        echo "   Database: trustcred_dev"
        echo "   Username: postgres"
        echo "   Password: postgres"
        echo ""
        echo "🔧 To stop services: ./setup-db-simple.sh stop"
        echo "🔧 To view logs: ./setup-db-simple.sh logs"
        echo "🔧 To reset: ./setup-db-simple.sh reset"
    else
        echo "⚠️ Some services may not be running. Check with: ./setup-db-simple.sh status"
    fi
}

# Function to stop services
stop_services() {
    echo "🛑 Stopping services..."
    docker stop trustcred-postgres trustcred-redis 2>/dev/null || true
    docker rm trustcred-postgres trustcred-redis 2>/dev/null || true
    echo "✅ Services stopped and removed"
}

# Function to show status
show_status() {
    echo "📊 Service Status:"
    docker ps -a --filter "name=trustcred-*"
}

# Function to show logs
show_logs() {
    echo "📋 PostgreSQL Logs:"
    docker logs trustcred-postgres
    echo ""
    echo "📋 Redis Logs:"
    docker logs trustcred-redis
}

# Function to reset database
reset_db() {
    echo "🗑️ Resetting database (this will delete all data)..."
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        stop_services
        docker volume rm postgres_data 2>/dev/null || true
        start_services
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

# Function to test connection
test_connection() {
    echo "🧪 Testing database connection..."
    if docker exec trustcred-postgres pg_isready -U postgres -d trustcred_dev >/dev/null 2>&1; then
        echo "✅ PostgreSQL is ready!"
    else
        echo "❌ PostgreSQL is not ready"
    fi
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
    test)
        test_connection
        ;;
    *)
        echo "Usage: $0 {start|stop|status|logs|reset|connect|test}"
        echo ""
        echo "Commands:"
        echo "  start   - Start all services (default)"
        echo "  stop    - Stop all services"
        echo "  status  - Show service status"
        echo "  logs    - Show service logs"
        echo "  reset   - Reset database (delete all data)"
        echo "  connect - Connect to PostgreSQL CLI"
        echo "  test    - Test database connection"
        exit 1
        ;;
esac
