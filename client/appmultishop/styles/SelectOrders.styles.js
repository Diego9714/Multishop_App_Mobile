import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: '#fff',
    alignItems: "center"
  },
  mainTitleContainer: {
    width: '100%',
    height: '7%',
    alignItems: 'center',
    marginBottom: 5
  },
  mainTitle: {
    fontSize: 18,
    color: '#000000',
    textAlign: 'center',
    marginTop: 20,
  },
  finderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  listOrderContainer: {
    height: "57%",
    width: "90%",
    backgroundColor: "#f1f1f1",
    borderRadius: 15,
    shadowColor: "#000",
  },
  headerProductContainer: {
    width: "100%",
    backgroundColor: '#64a8d6',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    color: '#fff',
  },
  titleListContainer: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
  },
  titleListClient: {
    color: 'white',
    width: '30%',
    textAlign: 'center',
    // backgroundColor: 'black'
  },
  titleListPrice: {
    color: 'white',
    width: '30%',
    textAlign: 'center',
    // backgroundColor: 'black'
  },
  titleListActions: {
    color: 'white',
    width: '20%',
    textAlign: 'center',
    // backgroundColor: 'black'
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nameProd: {
    color: 'white',
    width: '30%',
    textAlign: 'center',
    // backgroundColor: 'gray',
  },
  priceContainer: {
    color: 'white',
    width: '20%',
    alignItems: 'center',
    // backgroundColor: 'gray',
  },
  buttonAction: {
    width: '20%',
    textAlign: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginHorizontal: 5,
  },
  noOrdersText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  pagination: {
    marginTop: 0,
  },
  paginationContainer: {
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  buttonsAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonSincro: {
    backgroundColor: '#5B97DC',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 7,
  },
  textButtonSincro: {
    color: '#fff',
    marginRight: 10,
  },
  paginationContainer: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'center', // Alinea los elementos horizontalmente en el centro
    alignItems: 'center', // Alinea los elementos verticalmente en el centro
    // marginHorizontal: '5%',
    paddingVertical: 10,
  },
  pageButton: {
    height: 40, // Altura deseada de los botones de paginación
    paddingHorizontal: 20, // Ajusta el espaciado horizontal
    marginHorizontal: 5,
    backgroundColor: '#ddd',
    borderRadius: 5,
    justifyContent: 'center', // Alinea el contenido horizontalmente en el centro
    alignItems: 'center', // Alinea el contenido verticalmente en el centro
  },
  pageButtonActive: {
    backgroundColor: '#5B97DC',
  },
  pageButtonText: {
    color: 'white',
  },
});

export default styles;
