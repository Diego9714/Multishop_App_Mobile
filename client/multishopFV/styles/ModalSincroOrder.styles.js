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
    backgroundColor: '#f1f1f1',
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
    marginBottom: 10,
    width: '80%',
  },
  subtitleModal:{
    textAlign: 'center',
    marginBottom: '5%',
    fontSize: 17,
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 10,
    textAlign: 'center'
  },
  orderItem:{
    margin:10,
    backgroundColor: '#D0D0D0',
    borderRadius: 10,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
  },
  orderText:{
    margin:5,
  },
  buttonModalExit: {
    width: 150,
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextModal: {
    color: "white",
    textAlign: "center",
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  }
  ,
  loadingText: {
    fontSize: 24,
    color: '#777',
  },
});

export default styles;
