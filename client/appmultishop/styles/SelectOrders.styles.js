import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: '#fff',
    alignItems: "center"
  },
  titlePage: {
    height: '6%',
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "400"
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
    marginBottom: 20
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
  },
  titleListPrice: {
    color: 'white',
    width: '30%',
    textAlign: 'center',

  },
  titleListActions: {
    color: 'white',
    width: '20%',
    textAlign: 'center',
  },
  listContainer: {
    marginHorizontal: 10,
    height: '100%',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderBottomColor: "#f1f1f1",
    borderBottomWidth: 2,
    paddingVertical: 10,
    margin: 1
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

  buttonsAction: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
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
    marginHorizontal: '5%',
    paddingHorizontal: '20%', 
    paddingVertical: 10,
  },
  pageButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
    borderRadius: 100,
    color: '#fff'
  },
  pageButtonActive: {
    backgroundColor: '#5B97DC',
  },
  pageButtonText: {
    color: 'black',
    textAlign: 'center',
  },
});

export default styles;
