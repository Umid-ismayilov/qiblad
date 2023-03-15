
import React,{useState, useEffect} from 'react';
import CompassHeading from 'react-native-compass-heading';
import Geolocation from 'react-native-geolocation-service';
import {
  StyleSheet,
  Text,
  View,
  Platform, 
  PermissionsAndroid,
  ImageBackground,
  Image
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

async function requestPermissions() {
  if (Platform.OS === 'ios') {
    Geolocation.requestAuthorization();
    Geolocation.setRNConfiguration({
      skipPermissionRequests: false,
     authorizationLevel: 'whenInUse',
   });
  }

  if (Platform.OS === 'android') {
    console.log(Platform.OS);
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
  }
}

function App(){
  const [compassHeading, setCompassHeading] = useState(0);
  const [qiblad, setQiblad]                 = useState(0);

  const getLocation = async () => {
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        calculate(latitude, longitude);
      },
      error => {
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  const calculate =  async (latitude, longitude) => {
  
    const PI = Math.PI;
    let latk = (21.4225 * PI) / 180.0;
    let longk = (39.8264 * PI) / 180.0;
    let phi = (latitude * PI) / 180.0;
    let lambda = (longitude * PI) / 180.0;
    let var_qiblad =
      (180.0 / PI) *
      Math.atan2(
        Math.sin(longk - lambda),
        Math.cos(phi) * Math.tan(latk) -
          Math.sin(phi) * Math.cos(longk - lambda),
      );
      setQiblad(var_qiblad);
      // console.debug('--qiblad--',qiblad);
  };


  React.useEffect(() => {
     getLocation();
  },[compassHeading])


  React.useEffect(() => {
    requestPermissions();
    const degree_update_rate = 3;
    CompassHeading.start(degree_update_rate, ({heading, accuracy}) => {
      // console.log('CompassHeading: ', heading, accuracy);
      setCompassHeading(heading);
    });

    return () => {
      CompassHeading.stop();
    };
  },[]);
 
  return (
    <View style={styles.container}>
    <ImageBackground
      source={require('./assets/kompas.png')}
      style={[
        styles.image,
        {transform: [{rotate: `${360 - compassHeading}deg`}]},
      ]}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{rotate: `${qiblad}deg`}],
        }}>
        <Image
          source={require('./assets/kakbah.png')}
          style={{marginBottom: '45%', resizeMode: 'contain', flex: 0.7}}
        />
      </View>
    </ImageBackground>
    <Text>Qiblad: {qiblad}</Text>
    <Text>Heading: {compassHeading}</Text>
  </View>
  )
}

const styles = StyleSheet.create({
  image: {width: '100%', flex: 0.5, resizeMode: 'contain', alignSelf: 'center'},
  container: {backgroundColor: '#fff', flex: 1},
});

export default App;
