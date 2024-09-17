// SaveOrderUtils.js
export const openProductModal = (product, setIsProductModalVisible, setSelectedProduct) => {
  setSelectedProduct(product);
  setIsProductModalVisible(true);
};

export const closeProductModal = (setIsProductModalVisible, setSelectedProduct) => {
  setIsProductModalVisible(false);
  setSelectedProduct(null);
};

export const handleInvoiceSelection = (type, setIsInvoiceModalVisible, setInvoiceType) => {
  setInvoiceType(type);
  setIsInvoiceModalVisible(false);
};

export const handleProductQuantityChange = (productId, newQuantity, onQuantityChange, products, setProducts) => {
  onQuantityChange(productId, newQuantity);
  const updatedProducts = products.map(product =>
    product.codigo === productId ? { ...product, quantity: newQuantity } : product
  );
  setProducts(updatedProducts);
};

export const handleProductDelete = (productId, products, setProducts, onDeleteProduct, closeProductModal) => {
  const updatedProducts = products.filter(product => product.codigo !== productId);
  setProducts(updatedProducts);

  if (onDeleteProduct) {
    onDeleteProduct(productId);
  }
  closeProductModal();
};

export const generateRandomProductId = () => {
  const randomNumber = Math.floor(Math.random() * 100000);
  const timestamp = Date.now();
  return `${timestamp}-${randomNumber}`;
};

export const handleSaveOrder = async (invoiceType, client, products, totalPriceUsd, totalPriceBs, AsyncStorage, handlePress, Home, Alert) => {
  if (!invoiceType) {
    Alert.alert('Error', 'Debe seleccionar el tipo de factura');
    return;
  }

  const orderData = {
    id_order: generateRandomProductId(),
    cod_cli: client.cod_cli,
    nom_cli: client.nom_cli,
    products: products.map(product => ({
      codigo: product.codigo,
      descrip: product.descrip,
      quantity: product.quantity,
      priceUsd: product.priceUsd,
      priceBs: product.priceBs,
    })),
    tipfac: invoiceType,
    totalUsd: totalPriceUsd,
    totalBs: totalPriceBs,
    fecha: new Date().toISOString(),
  };

  try {
    const existingOrders = await AsyncStorage.getItem('OrdersClient');
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(orderData);
    await AsyncStorage.setItem('OrdersClient', JSON.stringify(orders));

    handlePress(Home);
  } catch (error) {
    console.error('Error saving order:', error);
  }
};
