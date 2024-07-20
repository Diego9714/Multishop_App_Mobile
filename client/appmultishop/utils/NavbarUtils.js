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

const getClients = async (cod_ven, signal) => {
  try {
    const res = await instanceClient.get(`/api/clients/${cod_ven}`, { signal });
    const listClients = res.data.clients;
    await storeData('clients', listClients);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get clients was aborted.');
    } else {
      console.error('Error fetching clients:', error);
    }
    return { success: false, error };
  }
};

const getProducts = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/products`, { signal });
    const listProducts = res.data.products;
    await storeData('products', listProducts);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get products was aborted.');
    } else {
      console.error('Error fetching products:', error);
    }
    return { success: false, error };
  }
};

const getCategories = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/categories`, { signal });
    const listCategories = res.data.categories;
    await storeData('categories', listCategories);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get categories was aborted.');
    } else {
      console.error('Error fetching categories:', error);
    }
    return { success: false, error };
  }
};

const getBrands = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/brands`, { signal });
    const listBrands = res.data.brands;
    await storeData('brands', listBrands);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get brands was aborted.');
    } else {
      console.error('Error fetching brands:', error);
    }
    return { success: false, error };
  }
};

const getCurrency = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/currency`, { signal });
    const listCurrency = res.data.currency;
    await storeData('currency', listCurrency);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get currency was aborted.');
    } else {
      console.error('Error fetching currency:', error);
    }
    return { success: false, error };
  }
};

const getVisits = async (signal) => {
  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;

      const visits = await AsyncStorage.getItem('ClientVisits');
      if (visits) {
        let visitsArray = JSON.parse(visits);

        const filteredVisits = visitsArray.filter(visit => visit.cod_ven === cod_ven && visit.status === "No sincronizada");

        if (filteredVisits.length > 0) {
          try {
            const response = await instanceSincro.post('/api/register/visit', { visits: filteredVisits }, { signal });

            if (response.status === 200) {
              const syncedVisits = response.data.processVisits.completed;

              visitsArray = visitsArray.map(visit => {
                const syncedVisit = syncedVisits.find(syncedVisit => syncedVisit.id_visit === visit.id_visit);
                if (syncedVisit && visit.status !== 'sincronizada') {
                  visit.status = 'sincronizada';
                }
                return visit;
              });

              await AsyncStorage.setItem('ClientVisits', JSON.stringify(visitsArray));

              const { completed, notCompleted } = response.data.processVisits;
              return { success: true, completed, notCompleted };
            } else {
              console.log('Unexpected response status:', response.status);
              return { success: false, error: 'Unexpected response status' };
            }
          } catch (error) {
            if (error.name === 'AbortError') {
              console.log('Request to sync visits was aborted.');
            } else {
              console.error('Error sending visits:', error);
            }
            return { success: false, error };
          }
        } else {
          return { success: true, error: 'No unsynchronized visits founddd' };
        }
      } else {
        return { success: false, error: 'No visits found' };
      }
    } else {
      return { success: false, error: 'No token found' };
    }
  } catch (err) {
    console.error('Error retrieving visits:', err);
    return { success: false, error: err };
  }
};

const getPayments = async (signal) => {
  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;

      const payments = await AsyncStorage.getItem('ClientPass');
      if (payments) {
        let paymentsArray = JSON.parse(payments);

        const filteredPayments = paymentsArray.filter(payment => payment.cod_ven === cod_ven && payment.status === "No sincronizada");

        if (filteredPayments.length > 0) {
          try {
            const response = await instanceSincro.post('/api/register/pass', { payments: filteredPayments }, { signal });

            if (response.data.code === 200) {
              const syncedPass = Array.isArray(response.data.completed) ? response.data.completed : [];

              paymentsArray = paymentsArray.map(payment => {
                const syncedPayment = syncedPass.find(syncedPayment => syncedPayment.id_pass === payment.id_pass);
                if (syncedPayment && payment.status !== 'sincronizada') {
                  payment.status = 'sincronizada';
                }
                return payment;
              });

              await AsyncStorage.setItem('ClientPass', JSON.stringify(paymentsArray));

              const { completed = [], notCompleted = [] } = response.data;
              return { success: true, completed, notCompleted };
            } else {
              console.log('Unexpected response status:', response.status);
              return { success: false, error: 'Unexpected response status' };
            }
          } catch (error) {
            if (error.name === 'AbortError') {
              console.log('Request to sync payments was aborted.');
            } else {
              console.error('Error sending payments:', error);
            }
            return { success: false, error };
          }
        } else {
          return { success: false, error: 'No unsynchronized payments found' };
        }
      } else {
        return { success: false, error: 'No payments found' };
      }
    } else {
      return { success: false, error: 'No token found' };
    }
  } catch (err) {
    return { success: false, error: err };
  }
};

const getAllInfo = async (setLoading, setMessage) => {
  setLoading(true);
  setMessage('');
  
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => {
    controller.abort();
    setLoading(false);
    setMessage('Tiempo de espera agotado. Intenta nuevamente.');
  }, 10000); // Timeout de 10 segundos

  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;

      const results = await Promise.all([
        getClients(cod_ven, signal),
        getProducts(signal),
        getCategories(signal),
        getBrands(signal),
        getCurrency(signal),
        getVisits(signal),
        getPayments(signal)
      ]);

      clearTimeout(timeoutId);
      setLoading(false);

      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        return { success: true };
      } else {
        return { success: false, error: 'Sincronización no exitosa.' };
      }
    } else {
      clearTimeout(timeoutId);
      setLoading(false);
      return { success: false, error: 'No se encontró el token del usuario.' };
    }
  } catch (error) {
    clearTimeout(timeoutId);
    setLoading(false);
    return { success: false, error: 'Error al actualizar la información.' };
  }
};


export { getAllInfo };
