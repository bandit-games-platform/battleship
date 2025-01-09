#!/bin/bash

#---------------------------------------------------------------
#- Name:	    deploy-environment-vnet.sh
#- Author:	  Roman Gordon
#- Function:	Deploys a vnet if not exists and creates the container app environment
#- Usage:	    ./deploy-environment-vnet.sh
#---------------------------------------------------------------

# Variables
VNET_NAME="null"
SUBNET_NAME="null"
ENV_NAME="null"
RG_NAME="null"

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

# Check and create VNet if it doesn't exist
VNET_EXISTS=$(az network vnet list --resource-group $RG_NAME --query "[?name=='$VNET_NAME'].name" -o tsv)
if [ -z "$VNET_EXISTS" ]; then
    az network vnet create --name $VNET_NAME --resource-group $RG_NAME --location northeurope --address-prefix 10.0.0.0/16
    az network vnet subnet create --name $SUBNET_NAME --resource-group $RG_NAME --vnet-name $VNET_NAME --address-prefix 10.0.1.0/24
    az network vnet subnet update \
      --resource-group $RG_NAME \
      --vnet-name $VNET_NAME \
      --name $SUBNET_NAME \
      --delegations Microsoft.App/environments

    echo "VNet $VNET_NAME created."
else
    echo "VNet $VNET_NAME already exists, moving on."
fi


# Check and create Container Apps environment if it doesn't exist
ENV_EXISTS=$(az containerapp env list --resource-group $RG_NAME --query "[?name=='$ENV_NAME'].name" -o tsv)
if [ -z "$ENV_EXISTS" ]; then
    INFRASTRUCTURE_SUBNET=$(az network vnet subnet show --resource-group ${RG_NAME} --vnet-name $VNET_NAME --name ${SUBNET_NAME} --query "id" -o tsv | tr -d '[:space:]')

    az containerapp env create --name $ENV_NAME --resource-group $RG_NAME --location northeurope --infrastructure-subnet-resource-id "$INFRASTRUCTURE_SUBNET"
    echo "Container Apps environment $ENV_NAME created."
else
    echo "Container Apps environment $ENV_NAME already exists, moving on."
fi


