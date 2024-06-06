import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    backgroundColor: '#FFFFFF',
    height: 610,
    width: '80%',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    alignSelf: 'center',
    position: 'absolute',
  },
  modalTitle: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailedClientContainer: {
    marginTop: 20,
    marginBottom: 20,
    width: '90%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 4, height: 4 },
    shadowRadius: 10,
  },
  nameInputDetailedClient: {
    color: 'white',
    width: '90%',
    fontSize: 16,
  },
  infoClientContainer: {
    width: '100%',
    margin: '4%',
    padding: '4%',
    backgroundColor: '#EFEFEF',
    borderRadius: 20,
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  textDetailedClient: {
    color: '#373A40',
  },
  closeButton: {
    width: 150,
    height: 40,
    backgroundColor: '#E72929',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default styles;
