import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  container: {
    backgroundColor: '#FFFFFF',
    width: '60%',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  modalTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  modalButton: {
    width: 150,
    height: 40,
    backgroundColor: "#38B0DB",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  closeButton: {
    width: 150,
    height: 40,
    backgroundColor: "#E72929",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  }
})

export default styles;
