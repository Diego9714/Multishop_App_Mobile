import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  list: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.10)'
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
  },
  titlePage:{
    alignItems: "center"
  },
  title: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "400",
    color: '#4D4D4D'
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

  ViewTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFEFEF',
    width: "90%",
    borderRadius: 15,
    paddingHorizontal: 10,
  },
  textInput: {
    padding: 10,
    height: 50,
    borderRadius: 15,
    width: "90%",
    textAlign: 'justify'
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.70)',
    marginHorizontal: 10,
    height: "54%",
    borderRadius: 20,
  },
  headerContainer: {
    width: '100%',
    backgroundColor: "#38B0DB",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  headerTitleName: {
    color: '#fff',
    width: '70%',
    textAlign: 'center'
  },
  headerTitleButton: {
    color: '#fff',
    marginRight: '5%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
  },
  listContainer: {
    marginHorizontal: 10,
    height: '85%',
  },
  clientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10  
  },
  nameClient: {
    width: '70%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buttonAction: {
    alignItems: 'center',
    borderRadius: 10,
    width: '30%'
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 10,
    width: "50%",
    padding: '8%',
    alignItems: "center",
    position: 'relative',
    zIndex: 1, // Asegura que el componente esté en la capa superior

  },
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  modalContent: {
    width: "80%",
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4
  },
  titleModal:{
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    width: '80%',
    color:'#4D4D4D'
  },
  subtitleModal:{
    marginTop: '2%',
    width: '80%',
    color:'#4D4D4D'
  },
  modalInfoClient: {
    width: "80%",
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: "2%",
    alignItems: "center",
  },
  modalInfoClientButton: {
    width: "80%",
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: "2%",
    alignItems: "center",
  },
  textModal: {
    padding: 12,
    height: "%10",
    borderRadius: 15,
    width: "90%",
    textAlign: "center",
    color:'#4D4D4D'
  },
  textModalDirecction: {
    padding: 12,
    height: "100%",
    borderRadius: 15,
    width: "100%",
    textAlign: "justify",
    color:'#4D4D4D'
  },
  sectionButtonsModal: {
    marginTop: "2%",
    flexDirection: "column",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  buttonModal: {
    width: 150, // Ajusta el ancho para que los botones se adapten mejor en diferentes tamaños de pantalla
    height: 40,
    backgroundColor: "#38B0DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Agrega margen inferior para separar los botones
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevación de la sombra (solo para Android)
  },
  buttonModalExit: {
    width: 150, // Ajusta el ancho para que los botones se adapten mejor en diferentes tamaños de pantalla
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Agrega margen inferior para separar los botones
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Elevación de la sombra (solo para Android)
  },
  buttonTextModal: {
    color: "white",
    textAlign: "center",
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
  scrollView: {
    width: "100%",
    // height: "100%",
    // backgroundColor: 'blue',
    // alignContent: 'center'
  }
});

export default styles;
