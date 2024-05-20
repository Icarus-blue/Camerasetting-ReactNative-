import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Camera, CameraType, WhiteBalance } from 'expo-camera/legacy';
import * as MediaLibrary from 'expo-media-library';
import Button from '@/components/Button';
import Slider from '@react-native-community/slider';

export default function Home() {
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [type, setType] = useState<CameraType>(Camera.Constants.Type.back);
  const [whiteBalance, setWhiteBalance] = useState<WhiteBalance>(Camera.Constants.WhiteBalance.auto);
  const [flash, setFlash] = useState<Camera.Constants.FlashMode>(Camera.Constants.FlashMode.off);
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

  const renderWhiteBalanceControls = () => {
    return (
      <ScrollView
        horizontal
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.label}>White Balance:</Text>
        <TouchableOpacity
          style={[styles.whiteBalanceButton, whiteBalance === Camera.Constants.WhiteBalance.auto && styles.selected]}
          onPress={() => setWhiteBalance(Camera.Constants.WhiteBalance.auto)}
        >
          <Text style={styles.whiteBalanceText}>Off</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.whiteBalanceButton, whiteBalance === Camera.Constants.WhiteBalance.sunny && styles.selected]}
          onPress={() => setWhiteBalance(Camera.Constants.WhiteBalance.sunny)}
        >
          <Text style={styles.whiteBalanceText}>Auto</Text>
        </TouchableOpacity>     
      </ScrollView>
    );
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
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 50
          }}>
            <Button
              title={''}
              icon={'retweet'}
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back);
              }} />
            <Button
              title=''
              icon={'flash'}
              onPress={() => {
                setFlash(flash === Camera.Constants.FlashMode.off ? Camera.Constants.FlashMode.on : Camera.Constants.FlashMode.off)
              }}
            />
          </View>
        </Camera>
      )}
      <View style={styles.buttonContainer}>
        {image ? (
          <View>
            <Button title={'Re-take'} icon={'retweet'} onPress={() => setImage(null)} />
            <Button title={'Save'} icon={'check'} onPress={saveImage} />
          </View>
        ) : (
          <>
            {renderWhiteBalanceControls()}
            <Button title={'Take a photo'} icon="camera" onPress={takePicture} />
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
});
