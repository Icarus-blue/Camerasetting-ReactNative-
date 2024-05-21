import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Camera, CameraType, WhiteBalance } from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';
import Button from '@/components/Button';

export default function Home() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState<CameraType>(Camera.Constants.Type.back);
  const [whiteBalance, setWhiteBalance] = useState<WhiteBalance>(Camera.Constants.WhiteBalance.auto);
  const [flash, setFlash] = useState<Camera.Constants.FlashMode>(Camera.Constants.FlashMode.off);
  const [isClick, setIsClick] = useState<boolean>(false);
  const cameraRef = useRef<Camera | null>(null);

  useEffect(() => {
    (async () => {
      await MediaLibrary.requestPermissionsAsync();
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const { uri } = await cameraRef.current.takePictureAsync();
        setImage(uri);
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  if (hasCameraPermission === null) {
    return <View style={styles.container}><Text>Requesting camera permission...</Text></View>;
  }

  if (hasCameraPermission === false) {
    return <View style={styles.container}><Text>No access to camera</Text></View>;
  }

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image);
        alert('picture saved!');
        setImage(null);
      } catch (err) {
        console.log(err)
      }
    }
  }

  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image }} style={styles.camera} />
      ) : (
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          whiteBalance={whiteBalance}
          ref={(ref) => {
            cameraRef.current = ref;
          }}
        >
          <View style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'absolute',
            right: 10,
            top: 80
          }}>
            <Button
              title={''}
              icon={type === CameraType.back ? 'camera-reverse' : 'camera-reverse-outline'}
              iconstyle={'Ionicons'}
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back);
              }} />
            <Button
              title=''
              icon={flash ? 'flash-on' : 'flash-off'}
              iconstyle={'MaterialIcons'}
              onPress={() => {
                setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
              }}
            />
            <Button
              title=''
              icon={'white-balance-sunny'}
              iconstyle={'MaterialCommunityIcons'}
              onPress={() => {
                setIsClick(prev => !prev)
              }}
            />
            {isClick && (
              <View style={styles.balanceContainer}>
                <Button
                  title='Auto'
                  icon={'white-balance-auto'}
                  iconstyle={'MaterialCommunityIcons'}
                  onPress={() => setWhiteBalance(Camera.Constants.WhiteBalance.auto)}
                />
                <Button
                  title='Off'
                  icon={'moon-waxing-crescent'}
                  iconstyle={'MaterialCommunityIcons'}
                  onPress={() => setWhiteBalance(Camera.Constants.WhiteBalance.manual)}
                />
              </View>
            )}
          </View>
        </Camera>
      )}
      <View style={styles.buttonContainer}>
        {image ? (
          <View>
            <Button title={'Re-take'} icon={'retweet'} iconstyle='Entypo' onPress={() => setImage(null)} />
            <Button title={'Save'} icon={'check'} iconstyle='MaterialIcons' onPress={saveImage} />
          </View>
        ) : (
          <>
            <Button title={'Take a photo'} icon="camera" iconstyle='MaterialIcons' onPress={takePicture} />
          </>
        )}
      </View>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  controlBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 30,
  },
  scrollContainer: {
    maxHeight: 50,
  },
  scrollContent: {
    alignItems: 'center',
  },
  label: {
    color: '#fff',
    marginRight: 10,
  },
  whiteBalanceButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    marginHorizontal: 5,
  },
  whiteBalanceText: {
    color: '#fff',
  },
  selected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  balanceContainer: {
    position: 'absolute',
    height: 50,
    borderRadius: 20,
    width: 200,
    borderColor: 'white',
    borderWidth: 2,
    top: 120,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: "center"
  }
});
