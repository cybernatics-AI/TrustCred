# 🗄️ TrustCred Database Setup Guide

## **🏆 Professional Best Practice: Docker Compose**

This is the **industry standard** approach used by professional development teams because it:
- ✅ **Reproduces production** - Same setup across all developers
- ✅ **Easy onboarding** - New team members get running in minutes  
- ✅ **Version controlled** - Database versions are documented
- ✅ **Isolated** - Doesn't interfere with other projects
- ✅ **Portable** - Works on any OS (Linux, Mac, Windows)

## **🚀 Quick Start (Recommended)**

### **1. Prerequisites**
```bash
# Install Docker Desktop (if not already installed)
# Download from: https://www.docker.com/products/docker-desktop

# Verify Docker is running
docker --version
docker-compose --version
```

### **2. Start Database Services**
```bash
# Start PostgreSQL and Redis
./setup-db.sh start

# Or manually:
docker-compose up -d
```

### **3. Verify Services**
```bash
# Check service status
./setup-db.sh status

# View logs
./setup-db.sh logs
```

## **🌐 Access URLs**

| Service | URL | Credentials |
|---------|-----|-------------|
| **PostgreSQL** | `localhost:5432` | `postgres/postgres` |
| **Redis** | `localhost:6379` | No auth required |
| **pgAdmin** | `http://localhost:5050` | `admin@trustcred.com/admin` |

## **🔧 Management Commands**

```bash
# Start services
./setup-db.sh start

# Stop services  
./setup-db.sh stop

# Check status
./setup-db.sh status

# View logs
./setup-db.sh logs

# Reset database (delete all data)
./setup-db.sh reset

# Connect to PostgreSQL CLI
./setup-db.sh connect
```

## **📊 Database Schema**

The database will automatically initialize with the schema from:
- `./database/schemas/001_initial_schema.sql`
- `./database/schemas/002_analytics_schema.sql`  
- `./database/schemas/003_enterprise_features.sql`

## **🔄 Alternative Setup Methods**

### **Option 2: Local PostgreSQL Installation**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE trustcred_dev;
CREATE USER postgres WITH PASSWORD 'postgres';
GRANT ALL PRIVILEGES ON DATABASE trustcred_dev TO postgres;
\q
```

### **Option 3: Cloud PostgreSQL**
- **Supabase** (Free tier): https://supabase.com
- **Neon** (Free tier): https://neon.tech
- **Railway** (Free tier): https://railway.app

## **🐛 Troubleshooting**

### **Docker Issues**
```bash
# Check Docker status
docker info

# Restart Docker Desktop
# (Restart the Docker Desktop application)

# Check container logs
docker-compose logs postgres
docker-compose logs redis
```

### **Port Conflicts**
```bash
# Check what's using port 5432
sudo lsof -i :5432

# Kill conflicting process
sudo kill -9 <PID>

# Or change ports in docker-compose.yml
```

### **Database Connection Issues**
```bash
# Test connection
docker exec -it trustcred-postgres psql -U postgres -d trustcred_dev -c "SELECT version();"

# Check database exists
docker exec -it trustcred-postgres psql -U postgres -l
```

## **📈 Production Considerations**

For production, consider:
- **Managed PostgreSQL**: AWS RDS, Google Cloud SQL, Azure Database
- **Connection pooling**: PgBouncer
- **Backup strategy**: Automated daily backups
- **Monitoring**: DataDog, New Relic, or custom metrics
- **Security**: SSL connections, IP whitelisting, strong passwords

## **🎯 Next Steps**

1. **Start the database**: `./setup-db.sh start`
2. **Test the backend**: `npm run dev`
3. **Verify health endpoint**: `curl http://localhost:3001/health`
4. **Begin API development**!

---

**Need help?** Check the logs with `./setup-db.sh logs` or review the troubleshooting section above.
