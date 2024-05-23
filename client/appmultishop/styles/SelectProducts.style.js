import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    marginTop: '6%',
    backgroundColor: '#EFEFEF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 30,           
    borderTopLeftRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 5,
    shadowRadius: 5,
    elevation: 10,
  },
  mainTitleContainer: {
    width: '90%',
    height: '4%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainSubtitleContainer: {
    marginTop: '5%',
    width: '90%',
    height: '3%',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center'
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#000'
  },
  finderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "90%",
    backgroundColor: '#5B97DC',
    paddingRight: 15,
    borderRadius: 15,
    margin: 15,
  },
  seekerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    width: "75%",
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  seeker: {
    padding: 5,
    height: 50,
    borderRadius: 15,
    width: "85%",
    textAlign: 'justify'
  },
  textFilter:{
    color:'white'
  },
  buttonsAction: {
    marginTop: "2%",
    flexDirection: "row",
    gap: 30,
    marginBottom: '5%'
  },
  buttonModal: {
    width: 120,
    height: 40,
    backgroundColor: "#5B97DC",
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonExit: {
    width: 120,
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counterContainer: {
    position: 'absolute',
    top: -15,
    right: -15,
    backgroundColor: 'red',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonText: {
    color: "white",
    textAlign: "center",
  },
  buttonTextSave:{
    color: "white",
    textAlign: "center",
    marginRight: 10
  },
  // LISTA DE PRODUCTOS
  productContainer:{
    height: "60%",
    width: "90%",
    // margin: 50,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
  },
  headerProductContainer:{
    width: "100%",
    backgroundColor: '#64a8d6',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    color: '#fff',
  },
  titleListContainer:{
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    paddingVertical: 15,
  },
  titleListProduct:{
    color: 'white',
    width: '36%',
    // backgroundColor: 'black'
  },
  titleListCant:{
    color: 'white',
    // width: '36%',
    // backgroundColor: 'black'
  },
  titleListActions:{
    color: 'white',
    // width: '36%',
    // backgroundColor: 'black'
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  nameProd: {
    width: '45%'
  },
  quantityContainer: {
    width: '30%',
    alignItems: 'center',
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    textAlign: 'center',
  },
  buttonAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    padding: 5,
  },
  pagination: {
    height: '8%',
    width: '90%',
    flexDirection: 'row',
    marginHorizontal: '5%',
    paddingVertical: 10,
  },
  pageButton: {
    height: '80%',
    padding: 7,
    margin: 7,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  pageButtonActive: {
    backgroundColor: '#5B97DC',
  },
  pageButtonText: {
    color: 'black',
  },
});

export default styles;
