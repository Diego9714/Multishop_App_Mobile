import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBackground: {
    width: '100%',
    height: '100%',
  },
  imgContainer: {
    width: '100%',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: '80%',
    height: '100%',
  },
  containerInfo: {
    flex: 1,
    // backgroundColor: '#E8E8E8',
    backgroundColor: 'rgba(0, 0, 0, 0.10)',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    paddingTop: 20,
  },
  containerWelcome: {
    width: '80%',
    marginBottom: 40,
  },
  textWelcome: {
    fontSize: 25,
    color: '#38B0DB',
    fontFamily: "Roboto",
  },
  textDescription: {
    color: '#6D6D6D',
    marginTop: 5,
  },
  ViewTextInput: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    padding: 10,
    height: 60,
    borderRadius: 15,
    color: '#38B0DB',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    width: 200,
    backgroundColor: '#38B0DB',
    borderRadius: 15,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.30,
    shadowRadius: 3.84,
    elevation: 15,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 20,
  }
});

export default styles;
