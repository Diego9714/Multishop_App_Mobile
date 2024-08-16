import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    marginTop: '6%',
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
    shadowOpacity: 2,
    shadowRadius: 2,
    elevation: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
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
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center'
  },
  mainSubtitle: {
    fontSize: 14,
    color: '#FFF'
  },
  finderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: "90%",
    backgroundColor: '#38B0DB',
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
  filterContainer:{
    width: '22%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 5
  },
  textFilter:{
    color:'white'
  },
  filterIndicator: {
    position: 'absolute',
    top: -15,
    right: -15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    opacity: 0.7
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
    backgroundColor: '#38B0DB',
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
    height: "58%",
    width: "96%",
    // padding: 2,
    // margin: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // backgroundColor: 'gray',
    borderRadius: 20,
  },
  headerProductContainer:{
    width: "100%",
    backgroundColor: '#38B0DB',
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
    width: '40%',
    textAlign: 'center'
  },
  titleListCant:{
    color: 'white',
  },
  titleListActions:{
    color: 'white',
  },
  productItem: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 2,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  listContainer: {
    height: '85%',
  },
  nameProd: {
    width: '56%',
    justifyContent: 'center',
    // backgroundColor: 'gray',
  },
  quantityContainer: {
    width: '42%',
    // marginLeft: 2,
    // backgroundColor: '#ccffda',
    // justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityInput: {
    marginLeft: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 3,
    paddingVertical: 3,
    textAlign: 'center',
  },
  buttonAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    marginLeft: 10
  },
  buttonMore: {
    width: '100%',
    justifyContent: 'right',
    alignItems: 'flex-end',
    position: 'absolute',
    marginRight: 15,
  },
  centerButtonPlaceholder: {
    width: 30, // mismo ancho que el icono delete para mantener el espacio consistente
    height: 30,
  },
  pagination: {
    // height: '8%',
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: '24%', 
    paddingVertical: 10
  },
  pageButton: {
    // height: '22%',
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
  },
});

export default styles;
