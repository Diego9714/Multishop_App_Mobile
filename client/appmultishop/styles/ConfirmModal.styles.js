import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
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
  },
  subtitleModal:{
    textAlign: 'center',
    marginTop: '5%',
    marginBottom: '5%',
    width: '90%',
    // backgroundColor: 'gray'
  },
  sectionButtonsModal:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-between',
    alignItems: 'center',
    // width: '70%',
    marginTop: 20,
    gap: 5,
  },
  buttonModalExit: {
    width: 100, // Ajusta el ancho para que los botones se adapten mejor en diferentes tamaños de pantalla
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
  buttonModal: {
    width: 100, // Ajusta el ancho para que los botones se adapten mejor en diferentes tamaños de pantalla
    height: 40,
    backgroundColor: '#38B0DB',
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
});

export default styles;
