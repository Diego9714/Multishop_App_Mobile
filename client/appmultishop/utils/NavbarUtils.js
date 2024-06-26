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
      if (visits) {
        const visitsArray = JSON.parse(visits);
        const filteredVisits = visitsArray.filter(visit => visit.cod_ven === cod_ven);

        // Send filtered visits to the server
        try {
          const response = await instanceSincro.post('/api/register/visit', { visits: filteredVisits });
          console.log('Visits sent successfully:', response.data);

          // Guarda las visitas sincronizadas y no sincronizadas
          const { completed, notCompleted } = response.data;
          await storeData('syncedVisits', completed);
          await storeData('unsyncedVisits', notCompleted);

          return { success: true, completed, notCompleted };
        } catch (error) {
          console.error('Error sending visits:', error);
          return { success: false, error };
        }
      } else {
        console.log('No visits found');
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
        getCurrency()
      ]);

      clearTimeout(timeoutId);
      setLoading(false);
      setMessage('Información actualizada correctamente.');

      // Realiza la sincronización de visitas
      const visitsResult = await getVisits();
      if (visitsResult.success) {
        callback(visitsResult.success, visitsResult.completed, visitsResult.notCompleted);
      } else {
        setMessage('Información actualizada pero las visitas no se sincronizaron.');
      }
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



const syncVisits = async () => {
  try {
    const visitsSynced = await getVisits();
    return visitsSynced;
  } catch (error) {
    console.error('Error syncing visits:', error);
    return false;
  }
};

export { getAllInfo, syncVisits };
