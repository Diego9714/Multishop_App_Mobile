import AsyncStorage from '@react-native-async-storage/async-storage'

export const getClientsFromStorage = async () => {
  const info = await AsyncStorage.getItem('clients')
  const infoJson = JSON.parse(info)
  return infoJson || []
}

export const filterClientsByName = (clients, searchText) => {
  return clients.filter(client =>
    client.nom_cli.toLowerCase().includes(searchText.toLowerCase())
  )
}

export const calculateTotalPages = (filteredClients, itemsPerPage) => {
  return Math.ceil(filteredClients.length / itemsPerPage)
}

export const paginateClients = (clients, page, itemsPerPage) => {
  const start = (page - 1) * itemsPerPage
  const end = page * itemsPerPage
  return clients.slice(start, end)
}
