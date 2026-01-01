#!/bin/bash

# Text formatting
BOLD='\033[1m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}${BOLD}"
echo "================================================================="
echo "   Performance Monitor - AWS Configuration Helper"
echo "================================================================="
echo -e "${NC}"
echo "This script will help you generate the necessary configuration files"
echo "for deploying to AWS using Terraform and Kubernetes."
echo ""

# ----------------------------------------------------------------------
# 1. Prerequisite Checks
# ----------------------------------------------------------------------
echo -e "${BOLD}Checking prerequisites...${NC}"

check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "${RED}✗ $1 is not installed.${NC} Please install it first."
        return 1
    else
        echo -e "${GREEN}✓ $1 is installed.${NC}"
        return 0
    fi
}

MISSING_TOOLS=0
check_tool "terraform" || MISSING_TOOLS=1
check_tool "aws" || MISSING_TOOLS=1
check_tool "kubectl" || MISSING_TOOLS=1

if [ $MISSING_TOOLS -eq 1 ]; then
    echo -e "\n${YELLOW}Warning:${NC} Some tools are missing. You can generate config files,"
    echo "but you won't be able to deploy without these tools."
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""

# ----------------------------------------------------------------------
# 2. Gather Information
# ----------------------------------------------------------------------
echo -e "${BLUE}${BOLD}Configuration Settings${NC}"
echo "Press Enter to accept defaults [in brackets]"
echo ""

# AWS Region
read -p "AWS Region [us-east-1]: " AWS_REGION
AWS_REGION=${AWS_REGION:-us-east-1}

# Environment
read -p "Environment Name [production]: " ENV_NAME
ENV_NAME=${ENV_NAME:-production}

# Database Credentials
echo -e "\n${YELLOW}Database Configuration:${NC}"
read -p "Database Username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

while true; do
    read -s -p "Database Password (required): " DB_PASSWORD
    echo ""
    read -s -p "Confirm Password: " DB_PASSWORD_CONFIRM
    echo ""
    
    if [ -z "$DB_PASSWORD" ]; then
        echo -e "${RED}Password cannot be empty.${NC}"
    elif [ "$DB_PASSWORD" != "$DB_PASSWORD_CONFIRM" ]; then
        echo -e "${RED}Passwords do not match. Try again.${NC}"
    else
        break
    fi
done

# Admin Credentials
echo -e "\n${YELLOW}Application Admin Credentials:${NC}"
read -p "Admin Username [admin]: " ADMIN_USER
ADMIN_USER=${ADMIN_USER:-admin}

while true; do
    read -s -p "Admin Password (required): " ADMIN_PASSWORD
    echo ""
    read -s -p "Confirm Password: " ADMIN_PASSWORD_CONFIRM
    echo ""
    
    if [ -z "$ADMIN_PASSWORD" ]; then
        echo -e "${RED}Password cannot be empty.${NC}"
    elif [ "$ADMIN_PASSWORD" != "$ADMIN_PASSWORD_CONFIRM" ]; then
        echo -e "${RED}Passwords do not match. Try again.${NC}"
    else
        break
    fi
done

# ----------------------------------------------------------------------
# 3. Generate Terraform Configuration
# ----------------------------------------------------------------------
echo -e "\n${BOLD}Generating Terraform configuration...${NC}"

TF_VARS_FILE="terraform/terraform.tfvars"
cat > "$TF_VARS_FILE" <<EOF
aws_region        = "${AWS_REGION}"
environment       = "${ENV_NAME}"
db_username       = "${DB_USER}"
db_password       = "${DB_PASSWORD}"
EOF

echo -e "${GREEN}✓ Created $TF_VARS_FILE${NC}"

# ----------------------------------------------------------------------
# 4. Generate Kubernetes Secrets
# ----------------------------------------------------------------------
echo -e "${BOLD}Generating Kubernetes secrets...${NC}"

# Base64 encode values (handling Linux/Mac differences)
if [[ "$OSTYPE" == "darwin"* ]]; then
    B64_DB_USER=$(echo -n "$DB_USER" | base64)
    B64_DB_PASS=$(echo -n "$DB_PASSWORD" | base64)
    B64_ADMIN_USER=$(echo -n "$ADMIN_USER" | base64)
    B64_ADMIN_PASS=$(echo -n "$ADMIN_PASSWORD" | base64)
else
    B64_DB_USER=$(echo -n "$DB_USER" | base64 -w 0)
    B64_DB_PASS=$(echo -n "$DB_PASSWORD" | base64 -w 0)
    B64_ADMIN_USER=$(echo -n "$ADMIN_USER" | base64 -w 0)
    B64_ADMIN_PASS=$(echo -n "$ADMIN_PASSWORD" | base64 -w 0)
fi

K8S_SECRET_FILE="kubernetes/secret.yaml"
cat > "$K8S_SECRET_FILE" <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  labels:
    app: intel-cloud-performance-service
type: Opaque
data:
  db-user: ${B64_DB_USER}
  db-password: ${B64_DB_PASS}
  admin-username: ${B64_ADMIN_USER}
  admin-password: ${B64_ADMIN_PASS}
EOF

echo -e "${GREEN}✓ Created $K8S_SECRET_FILE${NC}"

# ----------------------------------------------------------------------
# 5. Summary & Next Steps
# ----------------------------------------------------------------------
echo -e "\n${BLUE}${BOLD}Configuration Complete!${NC}"
echo ""
echo "Next steps to deploy:"
echo "---------------------"
echo "1. Initialize Terraform:"
echo "   cd terraform && terraform init"
echo ""
echo "2. Review and Apply Infrastructure:"
echo "   terraform plan"
echo "   terraform apply"
echo ""
echo "3. Update Kubernetes Config (after Terraform finishes):"
echo "   aws eks update-kubeconfig --name intel-cloud-cluster --region ${AWS_REGION}"
echo ""
echo "4. Deploy Application:"
echo "   kubectl apply -f kubernetes/"
echo ""
echo "Happy Monitoring! 🚀"
