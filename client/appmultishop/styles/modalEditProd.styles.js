import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 4

  },
  titleModal:{
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    width: '80%',
    color: '#4D4D4D'
  },
  subtitleModal:{
    marginTop: '2%',
    width: '80%',
    color: '#4D4D4D'
  },
  modalInfoClient: {
    width: "80%",
    backgroundColor: '#FFF',
    borderRadius: 20,
    margin: "2%",
    alignItems: "center",
  },
  modalInfoClientButton: {
    width: "80%",
    height: "20%",
    backgroundColor: '#D0D0D0',
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
    color: '#4D4D4D'
  },
  sectionButtonsModal: {
    marginTop: "2%",
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    gap: 10
  },
  buttonModal: {
    width: 100,    
    height: 40,
    backgroundColor: '#38B0DB',
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
    elevation: 5, // Elevación de la sombra (solo para Android)
    marginTop: 10,
    marginBottom: 10, // Agrega margen inferior para separar los botones
  },
  buttonModalExit: {
    width: 100,    
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
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
  
});

export default styles;
