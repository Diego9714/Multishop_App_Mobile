// SelectProductsUtils.js
export const handleProductSelection = (product, productQuantities, products, setSelectedProductsCount, setProductQuantities, setProducts) => {
  const updatedProductQuantities = { ...productQuantities };

  if (product.selected) {
    product.selected = false;
    setSelectedProductsCount(prevCount => prevCount - 1);
    delete updatedProductQuantities[product.codigo];
  } else {
    product.selected = true;
    setSelectedProductsCount(prevCount => prevCount + 1);
    updatedProductQuantities[product.codigo] = 1; // Establecer cantidad por defecto a 1
  }

  setProductQuantities(updatedProductQuantities);
  setProducts(products.map(p =>
    p.codigo === product.codigo ? { ...p, selected: !p.selected } : p
  ));
};

export const handleQuantityChange = (productId, text, productQuantities, products, setProductQuantities, setProducts, setSelectedProductsCount, Alert) => {
  const quantity = parseInt(text, 10) || 0;
  const product = products.find(p => p.codigo === productId);

  if (!product) {
    return;
  }

  if (isNaN(quantity)) {
    return;
  }

  if (quantity > product.existencia) {
    Alert.alert('Cantidad no disponible', 'La cantidad ingresada supera la cantidad existente en el inventario.');
    return;
  }

  const updatedProductQuantities = { ...productQuantities };
  updatedProductQuantities[productId] = quantity;

  if (quantity === 0) {
    delete updatedProductQuantities[productId];
    setSelectedProductsCount(prevCount => prevCount - 1);
    setProducts(products.map(product =>
      product.codigo === productId ? { ...product, selected: false } : product
    ));
  } else {
    setSelectedProductsCount(prevCount => {
      const product = products.find(p => p.codigo === productId);
      return product.selected ? prevCount : prevCount + 1;
    });
    setProducts(products.map(product =>
      product.codigo === productId ? { ...product, selected: true } : product
    ));
  }

  setProductQuantities(updatedProductQuantities);
};

export const handleProductDelete = (productId, productQuantities, products, setProductQuantities, setProducts, setSelectedProductsCount) => {
  const updatedProductQuantities = { ...productQuantities };
  delete updatedProductQuantities[productId];
  setProductQuantities(updatedProductQuantities);

  const updatedProducts = products.map(product =>
    product.codigo === productId ? { ...product, selected: false } : product
  );
  setProducts(updatedProducts);
  setSelectedProductsCount(prevCount => prevCount - 1);
};

export const generateSelectedProductJSON = (products, productQuantities, client) => {
  const selectedProducts = products.filter(product => product.selected);
  const selectedProductsWithQuantities = selectedProducts.map(product => ({
    codigo: product.codigo,
    descrip: product.descrip,
    exists: product.existencia,
    quantity: productQuantities[product.codigo] || 0,
    priceUsd: product.precioUsd,
    priceBs: product.precioBs,
  }));

  const order = {
    cod_cli: client.cod_cli,
    nom_cli: client.nom_cli,
    products: selectedProductsWithQuantities
  };

  return order;
};

export const renderPaginationButtonsProducts = (totalItems, itemsPerPage, page, setPage, styles, Pressable, Text) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  let buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(
      <Pressable
        key={i}
        style={[styles.pageButton, page === i && styles.pageButtonActive]}
        onPress={() => setPage(i)}
      >
        <Text style={styles.pageButtonText}>{i}</Text>
      </Pressable>
    );
  }
  return buttons;
};
