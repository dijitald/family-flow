
az login
az group create --name family-flow-rg --location "East US"
az deployment group create --resource-group family-flow-rg --template-file main.bicep --parameters sqlAdminPassword=YOUR_SQL_ADMIN_PASSWORD
