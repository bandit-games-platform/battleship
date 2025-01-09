#!/bin/bash

#---------------------------------------------------------------
#- Name:	    deploy-context-container.sh
#- Author:	  Roman Gordon
#- Function:	Deploys a context container on azure based on provided variables
#- Usage:	    ./deploy-context-container.sh
#---------------------------------------------------------------

SCALE_DOWN=true
CONTAINER_NAME="null"
RESOURCE_GROUP="null"
ENVIRONMENT="null"
IMAGE_NAME="null"
REG_USERNAME="null"
PORT=8080
FRONTEND_URL=
FRONTEND_HOST_URL=
BS_SDK_APIKEY=
BS_SDK_GAMEREGISTRY=
BS_SDK_GAMEPLAY=
BS_SDK_STATISTICS=
EXTRA_ENV_VARS=

declare -A provided_values
for pair in $1; do
    IFS='=' read -r key value <<< "$pair"
    provided_values["$key"]="$value"
done

for key in "${!provided_values[@]}"; do
    if declare -p "$key" &>/dev/null; then
        declare "$key=${provided_values[$key]}"
    else
        echo "Warning: Variable $key is not defined, adding to extra environment variables (make sure this isn't secret it won't be kept secret)."
        EXTRA_ENV_VARS+="$key=${provided_values[$key]} "
    fi
done

CONTAINER_EXISTS=$(az containerapp show --name $CONTAINER_NAME --resource-group $RESOURCE_GROUP --query "name" -o tsv)
if [ -n "$CONTAINER_EXISTS" ]; then
  echo "The container app already exists, deleting it!"
  az containerapp delete --name $CONTAINER_NAME --resource-group $RESOURCE_GROUP --yes
fi

echo "Bringing up container app"
az containerapp up --name $CONTAINER_NAME --resource-group $RESOURCE_GROUP \
  --location northeurope --environment $ENVIRONMENT \
  --image "$REG_USERNAME".azurecr.io/$IMAGE_NAME:"latest" \
  --target-port $PORT --ingress external

ENV_VAR_ARGS=()

if [ -n "$BS_SDK_STATISTICS" ]; then
  ENV_VAR_ARGS+=("BS_SDK_STATISTICS=$BS_SDK_STATISTICS")
fi
if [ -n "$BS_SDK_GAMEPLAY" ]; then
  ENV_VAR_ARGS+=("BS_SDK_GAMEPLAY=$BS_SDK_GAMEPLAY")
fi
if [ -n "$BS_SDK_GAMEREGISTRY" ]; then
  ENV_VAR_ARGS+=("BS_SDK_GAMEREGISTRY=$BS_SDK_GAMEREGISTRY")
fi
if [ -n "$BS_SDK_APIKEY" ]; then
  ENV_VAR_ARGS+=("BS_SDK_APIKEY=$BS_SDK_APIKEY")
fi
if [ -n "$FRONTEND_HOST_URL" ]; then
  ENV_VAR_ARGS+=("FRONTEND_HOST_URL=$FRONTEND_HOST_URL")
fi
if [ -n "$FRONTEND_URL" ]; then
  ENV_VAR_ARGS+=("FRONTEND_URL=$FRONTEND_URL")
fi
if [ -n "$EXTRA_ENV_VARS" ]; then
  for VAR in $EXTRA_ENV_VARS; do
      ENV_VAR_ARGS+=("${VAR}")
    done
fi

echo "$ENV_VAR_STRING"

if [ "$SCALE_DOWN" = false ]; then
  az containerapp update --name $CONTAINER_NAME --resource-group $RESOURCE_GROUP \
    --cpu 1 --memory 2Gi \
    --min-replicas 1 --max-replicas 1 \
    --set-env-vars "${ENV_VAR_ARGS[@]}"

else
  az containerapp update --name $CONTAINER_NAME --resource-group $RESOURCE_GROUP \
      --cpu 1 --memory 2Gi \
      --min-replicas 0 --max-replicas 1 \
      --set-env-vars "${ENV_VAR_ARGS[@]}"

fi

unset ENV_VAR_STRING

