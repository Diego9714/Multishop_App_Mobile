import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    alignItems: "center"
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
  },
  titlePage: {
    // height: '6%',
    alignItems: "center",
    marginBottom: 20
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "400",
    color: '#4D4D4D'
  },
  listOrderContainer: {
    height: "55%",
    width: "90%",
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    borderRadius: 15,
    shadowColor: "#000",
  },
  headerProductContainer: {
    width: "100%",
    backgroundColor: '#38B0DB',
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
    backgroundColor: '#38B0DB',
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
    height: 40,
    padding: 10,
    margin: 5,
    backgroundColor: '#fff',
    borderRadius: 100,
  },
  pageButtonActive: {
    backgroundColor: '#38B0DB',
  },
  pageButtonText: {
    color: '#38B0DB',
    textAlign: 'center',
  },
  pageButtonTextActive:{
    color: '#fff',
  }
});

export default styles;
