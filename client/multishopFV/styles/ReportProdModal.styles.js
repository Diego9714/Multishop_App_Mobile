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
    // height: '4%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainSubtitleContainer: {
    width: '90%',
    height: '3%',
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
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
    marginTop: "5%",
    flexDirection: "row",
    gap: 20,
    marginBottom: '5%'
  },
  buttonsDateAction: {
    display: "flex",
    flexDirection: "row",
    marginTop: "5%",
    gap: 20,
    marginBottom: '5%'
  },
  dateSelectorsContainer:{
    display: 'flex',
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 20,
  },
  buttonDate: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonStats : {
    display: "flex",
    flexDirection: "row",
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
  },
  searchContainer:{
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 20,
  },
  buttonSearch: {
    width: 35,
    backgroundColor: '#fff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginTop: 20,
    marginBottom: 20,
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
  buttonTextDate: {
    color: "#6b6b6b",
    textAlign: "center",
    lineHeight: 25,
    marginLeft: 5
  },
  buttonTextSearch:{
    color: "#6b6b6b",
    textAlign: "center",
    lineHeight: 25,
    marginRight: 5,
  },
  buttonText: {
    color: "#FFF",
    textAlign: "center",
    lineHeight: 25
  },
  // LISTA DE PRODUCTOS
  productContainer:{
    height: "56%",
    width: "95%",
    backgroundColor: 'rgba(255, 255, 255, 1)',
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
    // justifyContent: "space-evenly",
    justifyContent: "center",
    // gap: 20,
    paddingVertical: 15,
  },
  titleListClient: {
    color: 'white',
    width: '50%',
    textAlign: 'center',
    // backgroundColor: 'gray',
  },
  titleListPrice: {
    color: 'white',
    width: '25%',
    textAlign: 'center',
    // backgroundColor: 'gray',
  },
  titleListActions: {
    color: 'white',
    width: '25%',
    textAlign: 'center',
    // backgroundColor: 'gray',
  },
  productItem: {
    display: "flex",
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  nameProd: {
    width: '50%',
    justifyContent: "center",
  },
  priceContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: "center"
    // backgroundColor: 'gray',
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
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'gray'
  },
  paginationContainer: {
    width: '90%',
    flexDirection: 'row',
    marginHorizontal: '5%',
    paddingHorizontal: '20%', 
    paddingVertical: 10,
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
