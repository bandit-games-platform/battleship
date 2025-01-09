#!/bin/bash

#------------------------------------------------------------------------------------------------
#- Name:        deploy-webapp.sh
#- Author:      Alli-smith Ayodeji
#- Function:    Deploys an Azure Web App with Container Image Support
#- Usage:       ./deploy-webapp.sh
#------------------------------------------------------------------------------------------------

# Default variable values
NAME="null"
RESOURCE_GROUP="null"
PLAN="null"
CONTAINER_IMAGE="null"
LOCATION="null"
SKU="null"

# Map input arguments to variables
declare -A provided_values
for pair in $1; do
    IFS='=' read -r key value <<< "$pair"
    provided_values["$key"]="$value"
done

for key in "${!provided_values[@]}"; do
    if declare -p "$key" &>/dev/null; then
        declare "$key=${provided_values[$key]}"
    else
        echo "Warning: Variable $key is not defined."
    fi
done


# Validate required variables
if [[ "$NAME" == "null" || "$RESOURCE_GROUP" == "null" || "$PLAN" == "null" || "$CONTAINER_IMAGE" == "null" || "$SKU" == "null" || "$LOCATION" == "null" ]]; then
    echo "Error: One or more required variables are not set."
    echo "Ensure NAME, RESOURCE_GROUP, PLAN, CONTAINER_IMAGE, SKU and LOCATION are provided."
    exit 1
fi


# Check if the App Service Plan exists
echo "Checking if the Azure App Service Plan '$PLAN' exists in resource group '$RESOURCE_GROUP'..."
PLAN_EXISTS=$(az appservice plan list --resource-group "$RESOURCE_GROUP" --query "[?name=='$PLAN'].name" -o tsv)

if [ -z "$PLAN_EXISTS" ]; then
    echo "Azure App Service Plan '$PLAN' does not exist. Creating the plan..."

    az appservice plan create \
        --name "$PLAN" \
        --resource-group "$RESOURCE_GROUP" \
        --sku "$SKU" \
        --is-linux \
        --location "$LOCATION"

    echo "Azure App Service Plan '$PLAN' has been created."
else
    echo "Azure App Service Plan '$PLAN' already exists in resource group '$RESOURCE_GROUP'."
fi


# Check if the Web App already exists
echo "Checking if the Azure Web App '$NAME' exists in resource group '$RESOURCE_GROUP'..."
WEBAPP_EXISTS=$(az webapp list --resource-group "$RESOURCE_GROUP" --query "[?name=='$NAME'].name" -o tsv)

if [ -z "$WEBAPP_EXISTS" ]; then
    echo "Azure Web App '$NAME' does not exist. Proceeding with deployment..."

    az webapp create \
        --name "$NAME" \
        --plan "$PLAN" \
        --resource-group "$RESOURCE_GROUP" \
        --container-image-name "$CONTAINER_IMAGE" \
        --https-only true

    echo "Azure Web App '$NAME' has been successfully deployed with container image '$CONTAINER_IMAGE'."
else
    echo "Azure Web App '$NAME' already exists in resource group '$RESOURCE_GROUP'. Skipping deployment."
fi