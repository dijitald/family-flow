@description('The name of the resource group in which to create the resources.')
param resourceGroupName string = 'family-flow-rg'

@description('The Azure region in which to create the resources.')
param location string = 'East US'

@description('The name of the SQL server.')
param sqlServerName string = 'familyflowserver'

@description('The name of the SQL database.')
param sqlDatabaseName string = 'familyflowdb'

@description('The administrator username for the SQL server.')
param sqlAdminUsername string = 'sqladmin'

@description('The administrator password for the SQL server.')
@secure()
param sqlAdminPassword string

resource sqlServer 'Microsoft.Sql/servers@2021-02-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: sqlAdminUsername
    administratorLoginPassword: sqlAdminPassword
    version: '12.0'
  }
  sku: {
    name: 'GP_Gen5_2'
    tier: 'GeneralPurpose'
    capacity: 2
    family: 'Gen5'
  }
}

resource sqlDatabase 'Microsoft.Sql/servers/databases@2021-02-01-preview' = {
  name: '${sqlServerName}/${sqlDatabaseName}'
  location: location
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
    sampleName: 'AdventureWorksLT'
  }
  sku: {
    name: 'S0'
    tier: 'Standard'
    capacity: 10
  }
}

resource firewallRule 'Microsoft.Sql/servers/firewallRules@2021-02-01-preview' = {
  name: 'AllowAllWindowsAzureIps'
  parent: sqlServer
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

output sqlServerName string = sqlServer.name
output sqlDatabaseName string = sqlDatabase.name
output sqlAdminUsername string = sqlServer.properties.administratorLogin
output sqlAdminPassword string = sqlAdminPassword
