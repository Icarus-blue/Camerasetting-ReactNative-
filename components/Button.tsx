import React from 'react';
import { Text, TouchableOpacity, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { Entypo } from '@expo/vector-icons/';
import { FontAwesome6 } from '@expo/vector-icons/';
import { MaterialIcons } from '@expo/vector-icons/';
import { Ionicons } from '@expo/vector-icons/';
import { MaterialCommunityIcons } from '@expo/vector-icons/';


interface ButtonProps {
  title: string;
  onPress: () => void;
  icon: any;
  color?: string;
  iconstyle: string
}

const Button: React.FC<ButtonProps> = ({ title, onPress, icon, color, iconstyle }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      {(() => {
        if (iconstyle === 'FontAwesome6') {
          return (
            <FontAwesome6 name={icon} size={27} color={color ? color : '#f1f1f1'} />
          );
        } else if (iconstyle === 'Entypo') {
          return (
            <Entypo name={icon} size={27} color={color ? color : '#f1f1f1'} />
          );
        } else if (iconstyle === 'MaterialIcons') {
          return (
            <MaterialIcons name={icon} size={27} color={color ? color : '#f1f1f1'} />
          );
        }
        else if (iconstyle === 'Ionicons') {
          return (
            <Ionicons name={icon} size={27} color={color ? color : '#f1f1f1'} />
          );
        }
        else if (iconstyle === 'MaterialCommunityIcons') {
          return (
            <MaterialCommunityIcons name={icon} size={27} color={color ? color : '#f1f1f1'} />
          );
        }
      })()}
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

interface Styles {
  button: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  button: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#f1f1f1',
    marginLeft: 10,
  },
});

export default Button;
