import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Image } from 'react-native';
import { images } from '../constants';
import Button from '../components/Button';

const App = () => {
  return (
    <View style={styles.container}>
      <Image
        source={images.logo}
        resizeMode="contain"
        style={styles.logo}
      />
      <TextInput
        placeholder='usuario'
        style={styles.textInput}
      />
      <TextInput
        placeholder='contraseña'
        style={styles.textInput}
        secureTextEntry={true}
      />
      <StatusBar style="auto" />
      <Button />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '70%',
    height: 150, 
    marginBottom:"5%",
  },
  textInput: {
    borderColor: 'gray',
    paddingStart: 30,
    padding: 10,
    width: '80%',
    height: 60,
    marginTop: 20,
    borderRadius: 15,
    backgroundColor: '#fff',
    color: '#5B97DC',
  },
});

export default App;
