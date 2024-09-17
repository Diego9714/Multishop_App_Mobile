import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)'
  },
  modalContent: {
    width: "85%",
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    padding: 15,
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
  ViewTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: 2,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
    // marginTop: 30,
  },
  textInput: {
    flex: 1,
    padding: 10,
    height: 60,
    borderRadius: 15,
    // color: '#38B0DB',
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
