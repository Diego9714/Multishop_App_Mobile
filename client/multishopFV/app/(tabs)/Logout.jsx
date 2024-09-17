import React, { useState, useEffect, useContext } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import { UserContext } from '../../context/UserContext';
import ConfirmModal from '../../components/users/ModalLogoutConfirm';

const Logout = () => {
  const { logout } = useContext(UserContext);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setIsModalVisible(true);
    }, [])
  );

  const handleConfirmLogout = () => {
    logout();
    setIsModalVisible(false);
  };

  const handleCancelLogout = () => {
    setIsModalVisible(false);
    router.replace('/(tabs)/Home');
  };

  return (
    <View>
      <ConfirmModal
        isVisible={isModalVisible}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </View>
  );
};

export default Logout;
