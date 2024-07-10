import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1, // Utiliza flex para que el contenedor ocupe todo el espacio disponible
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 2,
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1, // Utiliza flexGrow para que el contenido del ScrollView ocupe todo el espacio disponible
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20, // Añade padding inferior para que el último contenido no quede pegado al borde
  },
  content:{
    // backgroundColor: 'black',
    // alignItems: 'center',
    // textAlign:'justify'
  },
  mainTitleContainer: {
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
    margin: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 10,
  },
  detailedClientContainerFac:{
    margin: 25,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 10,
  },
  nameInputDetailedClient:{
    color: '#4D4D4D',
    marginHorizontal: '8%',
    fontSize: 16
  },
  infoClientContainer:{
    margin: '4%',
    padding: '4%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  textDetailedClient:{
    color: '#4D4D4D',
  },
  ProductContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    margin: 5
  },
  headerProductContainer: {
    width: "100%",
    backgroundColor: "#38B0DB",
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
  ScrollView:{
    marginBottom: 10,
    // backgroundColor: 'black'
  },
  selectedProductItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  nameProduct: {
    flex: 2,
    textAlign: 'left',
    color: '#4D4D4D'
  },
  quantityProduct: {
    flex: 1,
    textAlign: 'center',
    color: '#4D4D4D'
  },
  priceProduct: {
    flex: 1,
    textAlign: 'center',
    color: '#4D4D4D'
  },
  selectedProductActions: {
    flex: 1,
    alignItems: 'flex-end',
  },
  exchangeRateContainer:{
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
    justifyContent:'center',    
    marginTop: 10,
    gap: 20
  },
  exchangeRateText:{
    color: 'gray'
  },
  containerPrice: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  containerTitlePrice:{
    width: '80%',
    textAlign: 'left'
  },
  titlePrice: {
    marginTop: 10,
    fontSize: 20,
    alignItems: 'left',
  },
  textPrice: {
    marginTop: 10,
    fontSize: 15,
  },
  containerNote: {
    width: '100%',
    marginTop: 10,
    marginBottom: 10,
  },
  noteOrder:{
    color: 'gray',
    textAlign: 'justify'
  },
  containerButton:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-evenly',
    alignItems: 'center',
    width: '100%',
    marginTop: 20
  },
  selectProdContainer:{
    marginHorizontal: 50,
  },
  otherButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#38B0DB",
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
  }
});

export default styles;
