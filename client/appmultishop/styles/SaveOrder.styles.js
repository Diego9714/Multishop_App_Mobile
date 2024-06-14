import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1, // Utiliza flex para que el contenedor ocupe todo el espacio disponible
    marginTop: '6%',
    backgroundColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  scrollContent: {
    flexGrow: 1, // Utiliza flexGrow para que el contenido del ScrollView ocupe todo el espacio disponible
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Añade padding inferior para que el último contenido no quede pegado al borde
  },
  mainTitleContainer: {
    width: '90%',
    marginVertical: 10, // Añade margen vertical para separar los títulos
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#373A40',
    textAlign: 'center',
  },
  detailedClientContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    padding: 20,
    backgroundColor: '#798CA0',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 10,
  },
  nameInputDetailedClient:{
    color: 'white',
    width: '90%',
    fontSize: 16
  },
  infoClientContainer:{
    width: '100%',
    margin: '4%',
    padding: '4%',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  textDetailedClient:{
    color: '#373A40'
  },
  ProductContainer: {
    width: "100%",
    backgroundColor: '#fff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  headerProductContainer: {
    width: "100%",
    backgroundColor: '#64a8d6',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  titleListContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  titleListProduct: {
    color: 'white',
    flex: 2,
    textAlign: 'center',
  },
  titleListQuantity: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  titleListPrice: {
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  selectedProductItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  nameProduct: {
    flex: 2,
    textAlign: 'left',
  },
  quantityProduct: {
    flex: 1,
    textAlign: 'center',
  },
  priceProduct: {
    flex: 1,
    textAlign: 'center',
  },
  selectedProductActions: {
    flex: 1,
    alignItems: 'flex-end',
  },
  containerPrice: {
    width: '70%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    // backgroundColor: 'black'
  },
  containerTitlePrice:{
    width: '100%',
    // backgroundColor: 'black',
    textAlign: 'left'
  },
  titelPrice: {
    marginTop: 10,
    fontSize: 20,
    alignItems: 'left',
  },
  textPrice: {
    marginTop: 10,
    fontSize: 15,
  },
  containerNote: {
    width: '90%',
    marginTop: 10,
    marginBottom: 10
  },
  noteOrder:{
    color: 'gray',
    textAlign: 'justify'
  },
  containerButton:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    width: '70%',
    marginTop: 20,
    gap: 10
  },
  otherButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#5B97DC',
    borderRadius: 5,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#FF0000',
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
});



export default styles;
