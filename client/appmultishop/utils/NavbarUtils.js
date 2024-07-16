import AsyncStorage from '@react-native-async-storage/async-storage';
import { instanceClient, instanceProducts, instanceSincro } from '../global/api';
import { jwtDecode } from 'jwt-decode';

const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
    throw error;
  }
};

const getClients = async (cod_ven) => {
  try {
    const res = await instanceClient.get(`/api/clients/${cod_ven}`);
    const listClients = res.data.clients;
    await storeData('clients', listClients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    throw error;
  }
};

const getProducts = async () => {
  try {
    const res = await instanceProducts.get(`/api/products`);
    const listProducts = res.data.products;
    await storeData('products', listProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    const res = await instanceProducts.get(`/api/categories`);
    const listCategories = res.data.categories;
    await storeData('categories', listCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getBrands = async () => {
  try {
    const res = await instanceProducts.get(`/api/brands`);
    const listbrands = res.data.brands;
    await storeData('brands', listbrands);
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

const getCurrency = async () => {
  try {
    const res = await instanceProducts.get(`/api/currency`);
    const listCurrency = res.data.currency;
    await storeData('currency', listCurrency);
  } catch (error) {
    console.error('Error fetching currency:', error);
    throw error;
  }
};

const getVisits = async () => {
  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;

      const visits = await AsyncStorage.getItem('ClientVisits');
      console.log(visits)
      if (visits) {
        let visitsArray = JSON.parse(visits);
        
        // Filtrar solo las visitas no sincronizadas del vendedor actual
        const filteredVisits = visitsArray.filter(visit => visit.cod_ven === cod_ven && visit.status === "No sincronizada");

        // Verificar si hay visitas para sincronizar
        if (filteredVisits.length > 0) {
          try {
            // Enviar las visitas filtradas al servidor
            const response = await instanceSincro.post('/api/register/visit', { visits: filteredVisits });
            // console.log('Visits sent successfully:', response.data);

            if (response.status === 200) {
              // Actualizar el estado de las visitas sincronizadas solo la primera vez
              const syncedVisits = response.data.processVisits.completed;

              visitsArray = visitsArray.map(visit => {
                const syncedVisit = syncedVisits.find(syncedVisit => syncedVisit.id_visit === visit.id_visit);
                if (syncedVisit && visit.status !== 'sincronizada') {
                  visit.status = 'sincronizada';
                }
                return visit;
              });

              // Guardar las visitas actualizadas de vuelta en AsyncStorage
              await AsyncStorage.setItem('ClientVisits', JSON.stringify(visitsArray));

              // Devolver éxito junto con las visitas sincronizadas y no sincronizadas
              const { completed, notCompleted } = response.data.processVisits;
              return { success: true, completed, notCompleted };
            } else {
              console.log('Unexpected response status:', response.status);
              return { success: false, error: 'Unexpected response status' };
            }
          } catch (error) {
            // console.error('Error sending visits:', error);
            return { success: false, error };
          }
        } else {
          // console.log('No unsynchronized visits found');
          return { success: false, error: 'No unsynchronized visits found' };
        }
      } else {
        // console.log('No visits found');
        return { success: false, error: 'No visits found' };
      }
    } else {
      console.log('No token found');
      return { success: false, error: 'No token found' };
    }
  } catch (err) {
    console.error('Error retrieving visits:', err);
    return { success: false, error: err };
  }
}

const getPayments = async () => {
  try {
    const token = await AsyncStorage.getItem('tokenUser')
    if (token) {
      const decodedToken = jwtDecode(token)
      const cod_ven = decodedToken.cod_ven

      const payments = await AsyncStorage.getItem('ClientPass')
      if (payments) {
        let paymentsArray = JSON.parse(payments)

        const filteredPayments = paymentsArray.filter(payment => payment.cod_ven === cod_ven && payment.status === "No sincronizada")

        if (filteredPayments.length > 0) {
          try {
            const response = await instanceSincro.post('/api/register/pass', { payments: filteredPayments })
            console.log(response.data.code)

            if (response.data.code === 200) {
              const syncedPass = response.data.completed

              console.log(syncedPass)

              paymentsArray = paymentsArray.map(payment => {
                const syncedPayment = syncedPass.find(syncedPayment => syncedPayment.id_pass === payment.id_pass)
                if (syncedPayment && payment.status !== 'sincronizada') {
                  payment.status = 'sincronizada'
                }
                return payment
              })

              console.log("paymentsArray")
              console.log(paymentsArray)


              await AsyncStorage.setItem('ClientPass', JSON.stringify(paymentsArray))

              const { completed, notCompleted } = response.data.completed
              return { success: true, completed, notCompleted }
            } else {
              console.log('Unexpected response status:', response.status);
              return { success: false, error: 'Unexpected response status' };
            }
          } catch (error) {
            // console.error('Error sending visits:', error);
            return { success: false, error };
          }
        } else {
          // console.log('No unsynchronized visits found');
          return { success: false, error: 'No unsynchronized visits found' };
        }
      }
    } else {
      return { success: false, error: 'No token found' };
    }
  } catch (err) {
    return { success: false, error: err };
  }
};

const getAllInfo = async (setLoading, setMessage, callback) => {
  setLoading(true);
  setMessage('');
  const timeoutId = setTimeout(() => {
    setLoading(false);
    setMessage('Tiempo de espera agotado. Intenta nuevamente.');
  }, 10000); // Timeout de 10 segundos

  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;

      await Promise.all([
        getClients(cod_ven),
        getProducts(),
        getCategories(),
        getBrands(),
        getCurrency(),
        getVisits(),
        getPayments()
      ]);

      clearTimeout(timeoutId);
      setLoading(false);
      setMessage('Información sincronizada con éxito.');

    } else {
      clearTimeout(timeoutId);
      setLoading(false);
      setMessage('No se encontró el token del usuario.');
    }
  } catch (error) {
    clearTimeout(timeoutId);
    setLoading(false);
    setMessage('Error al actualizar la información.');
  }
};


export { getAllInfo };
