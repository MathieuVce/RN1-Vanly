import React, { useState } from 'react';

import { Modal, ScrollView, View, StyleSheet, Text, GestureResponderEvent, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface IModalEProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  button ?: string;
  onApply?: () => void;
  close: () => void;
  height?: number;
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    
    backgroundColor: 'white',

    borderTopLeftRadius: 16 * 2,
    borderTopRightRadius: 16 * 2,

    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },

  applyBtn: {
    paddingHorizontal: 16 * 1.5,
    paddingVertical: 16 * .5,
    borderRadius: 16 * 2,
    backgroundColor: '#0E3570',
  },

  applyBtnText: {
    fontSize: 16 * 1,
    textTransform: 'capitalize',
    fontWeight: 'bold',
    color: 'white',
  },


  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 16 * 0.75,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  content: {
    flex: 1,
    backgroundColor: '#FCFCFC',
    paddingVertical: 16,
  },

  closeBtn: {
    color: '#eee',
    fontSize: 16 * 3,
  },
});

export const ModalE: React.FC<IModalEProps> = ({  isOpen, setIsOpen, children, button, close, height, onApply }) => {

  const [start, setStart] = useState(0);


  const handleClose = () => {
    setIsOpen(false);
    close();
  };

  return (
      <Modal
          animated
          transparent
          visible={isOpen}
      >
          <View
              onTouchStart={({ nativeEvent }: GestureResponderEvent) => {
                setStart(nativeEvent.locationY);
              }}
              onTouchEnd={({ nativeEvent }: GestureResponderEvent) => {
                if (nativeEvent.locationY - start > 200)
                  setIsOpen(false);
              }}
              style={{ ...styles.modal, marginTop: height }}
          >
              <View style={styles.top}>
                  {button && (
                      <TouchableOpacity onPress={() => {
                        setIsOpen(false);
                        if (onApply)
                          onApply();
                      }}>
                          <View style={styles.applyBtn}>
                              <Text style={styles.applyBtnText}>{button}</Text>
                          </View>
                      </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => {setIsOpen(false);}}>
                      <Ionicons
                          style={styles.closeBtn}
                          onPress={handleClose}
                          name="ios-close-circle"
                          />
                  </TouchableOpacity>
              </View>
              <ScrollView style={styles.content}>
                  {children}
              </ScrollView>
          </View>
      </Modal>
  );
};