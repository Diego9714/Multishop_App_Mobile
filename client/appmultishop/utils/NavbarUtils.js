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

const getUnsyncedVisits = async () => {
  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;

      const visits = await AsyncStorage.getItem('ClientVisits');
      if (visits) {
        let visitsArray = JSON.parse(visits);

        return visitsArray.filter(visit => visit.cod_ven === cod_ven)
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error retrieving visits:', err);
    return [];
  }
};

const getUnsyncedPayments = async () => {
  try {
    const token = await AsyncStorage.getItem('tokenUser');
    if (token) {
      const decodedToken = jwtDecode(token);
      const cod_ven = decodedToken.cod_ven;

      const payments = await AsyncStorage.getItem('ClientPass');
      const paymentsSync = await AsyncStorage.getItem('SyncedClientPass');

      console.log(paymentsSync)

      if (payments) {
        let paymentsArray = JSON.parse(payments);

        return paymentsArray.filter(payment => payment.cod_ven === cod_ven);
      } else {
        return [];
      }
    } else {
      return [];
    }
  } catch (err) {
    console.error('Error retrieving payments:', err);
    return [];
  }
};

const getVisits = async (signal) => {
  try {
    const unsyncedVisits = await getUnsyncedVisits();

    if (unsyncedVisits.length === 0) {
      setIsLoading(false);
      setModalSincroVisible(false);
      console.log('No unsynchronized visits found.');
      return;
    }

    const response = await instanceSincro.post('/api/register/visit', { visits: unsyncedVisits }, { signal });

    if (response.status === 200) {
      const syncedVisits = response.data.processVisits.completed;

      // Filtra las visitas sincronizadas del objeto original
      const remainingVisits = unsyncedVisits.filter(visit => !syncedVisits.some(syncedVisit => syncedVisit.id_visit === visit.id_visit));

      console.log(remainingVisits)

      // Guardar las visitas restantes (no sincronizadas) en AsyncStorage
      await AsyncStorage.setItem('ClientVisits', JSON.stringify(remainingVisits));

      // Obtener la lista existente de visitas sincronizadas
      const syncedVisitsString = await AsyncStorage.getItem('SyncedClientVisits');
      const existingSyncedVisits = syncedVisitsString ? JSON.parse(syncedVisitsString) : [];

      // Agregar las nuevas visitas sincronizadas a la lista existente
      const updatedSyncedVisits = [...existingSyncedVisits, ...syncedVisits];

      // Guardar la lista actualizada de visitas sincronizadas en AsyncStorage
      await AsyncStorage.setItem('SyncedClientVisits', JSON.stringify(updatedSyncedVisits));

      return { success: true, completed: syncedVisits, notCompleted: remainingVisits };
    } else {
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
};

const getPayments = async (signal) => {
  try {
    const unsyncedPayments = await getUnsyncedPayments();

    if (unsyncedPayments.length === 0) {
      setIsLoading(false);
      setModalSincroVisible(false);
      console.log('No unsynchronized payments found.');
      return;
    }

    const response = await instanceSincro.post('/api/register/pass', { payments: unsyncedPayments }, { signal });

    // console.log(response.data.processPass.completed)

    if (response.data.code === 200) {

      const syncedPass = Array.isArray(response.data.processPass.completed) ? response.data.processPass.completed : [];

      console.log(syncedPass)

      // Filtra los abonos sincronizados del objeto original
      const remainingPayments = unsyncedPayments.filter(payment => !syncedPass.some(syncedPayment => syncedPayment.id_pass === payment.id_pass));

      console.log("remainingPayments")
      console.log(remainingPayments)

      // Guardar los abonos restantes (no sincronizados) en AsyncStorage
      await AsyncStorage.setItem('ClientPass', JSON.stringify(remainingPayments));

      // Obtener la lista existente de abonos sincronizados
      const syncedPaymentsString = await AsyncStorage.getItem('SyncedClientPass');
      console.log(syncedPaymentsString)
      const existingSyncedPayments = syncedPaymentsString ? JSON.parse(syncedPaymentsString) : [];

      // Agregar los nuevos abonos sincronizados a la lista existente
      const updatedSyncedPayments = [...existingSyncedPayments, ...syncedPass];

      // Guardar la lista actualizada de abonos sincronizados en AsyncStorage
      await AsyncStorage.setItem('SyncedClientPass', JSON.stringify(updatedSyncedPayments));

      return { success: true, completed: syncedPass, notCompleted: remainingPayments };
    } else {
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
};

const getCompany = async (signal) => {
  try {
    const res = await instanceProducts.get(`/api/company`, { signal });
    const listCompany = res.data.company;
    await storeData('company', listCompany);
    return { success: true };
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request to get company was aborted.');
    } else {
      console.error('Error fetching company:', error);
    }
    return { success: false, error };
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

      const unsyncedVisits = await getUnsyncedVisits();
      const unsyncedPayments = await getUnsyncedPayments();

      const results = await Promise.all([
        getClients(cod_ven, signal),
        getProducts(signal),
        getCategories(signal),
        getBrands(signal),
        getCurrency(signal),
        getCompany(signal),
        unsyncedVisits.length > 0 ? getVisits(signal) : { success: true },
        unsyncedPayments.length > 0 ? getPayments(signal) : { success: true }
      ]);

      clearTimeout(timeoutId);
      setLoading(false);

      const allSuccessful = results.every(result => result.success);

      if (allSuccessful) {
        return { success: true };
      } else {
        return { success: false, error: 'Información no actualizada.' };
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
