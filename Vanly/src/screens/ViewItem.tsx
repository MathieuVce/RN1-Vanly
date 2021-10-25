import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, Linking, Platform, ActivityIndicator } from 'react-native';
import { AntDesign, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';

import { TouchableOpacity } from 'react-native-gesture-handler';
import { ClientContext } from '../contexts/ClientContext';

interface IViewItemProps {
  item: any
  setTmpSites: React.Dispatch<React.SetStateAction<any>>
  setItem: React.Dispatch<React.SetStateAction<any>>
  image: any
}

const itemStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    marginHorizontal: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  head: {
    flexDirection: 'row',
    width: '90%',
    height: '30%',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  icon: {
    width: 16 * 3.3,
    height: 16 * 3.3,
    position: 'absolute',
    bottom: 16 * 2.2,
    left: -3,
    backgroundColor: '#FFEECF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
  name: {
    fontSize: 30,
    color: '#525566',
    fontWeight: 'bold',
    paddingLeft: 16 * 5,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  touchImage: {
    width: Dimensions.get('window').width - 16 * 4,
    height: 16 * 15,
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    borderColor: '#525566',
  },
  modalImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  description: {
    fontSize: 20,
    color: 'grey',
    marginVertical: 8,
  },
  creator: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginHorizontal: 24,
  },
  create: {
    fontSize: 20,
    color: '#525566',
    marginVertical: 8,
    fontWeight: 'bold',
  },
  likeic: {
    position: 'absolute',
    bottom: 16,
  },
  like: {
    fontSize: 20,
    color: '#FEC156',
    marginVertical: 16,
    marginLeft: 16 * 2,
    fontWeight: 'bold',
  },
});

export const ViewItem: React.FC<IViewItemProps> = ({ item, image, setTmpSites, setItem }) => {

  const { getItems, setItems, client, getTraduction } = useContext(ClientContext);
  const [like, setLike] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewImage, setViewImage] = useState(false);
  const color = item.type == 'pointOfView' ? '#FEC156' : item.type == 'waterPoint' ? '#768AF8' : item.type == 'gazStation' ? '#B98888' : undefined;

  const addLike = async () => {
    const items = await setItems();

    await items.doc(item.name).set({
      ...item,
      likes: { likes: item.likes.likes + 1, names: item.likes.names.concat([client?.firstname]) },
    });

    setItem({ ...item, likes: { likes: item.likes.likes + 1, names: item.likes.names.concat([client?.firstname]) } });
    setTmpSites((await getItems()).docs.map((doc: { data: () => any; }) => doc.data()));
  };

  const removeLike = async () => {
    const items = await setItems();

    await items.doc(item.name).set({
      ...item,
      likes: { likes: item.likes.likes - 1, names: item.likes.names.filter((elem: string) => elem !== client?.firstname ) },
    });

    setItem({ ...item, likes: { likes: item.likes.likes - 1, names: item.likes.names.filter((elem: string) => elem !== client?.firstname) } });
    setTmpSites((await getItems()).docs.map((doc: { data: () => any; }) => doc.data()));
  };

  const openGps = (lat: number, lng: number, name: string) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${lat},${lng}`;
    const label = name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.canOpenURL(url!).then(supported => {
      if (supported) {
        Linking.openURL(url!);
      } else {
        console.log('Don\'t know how to open URI: ' + url);
      }
    });
  };
  
  useEffect(() => {
    if (item.likes.names.indexOf(client?.firstname) > -1) {
      setLike(true);
    }
  }, []);


  return (
    <View style={itemStyles.container}>
      {
        loading && (
          <View style={itemStyles.center}>
            <ActivityIndicator size={'large'} color={color}></ActivityIndicator>
          </View>
        )}
      <View style={itemStyles.head}>
        {
          item.type == 'pointOfView' ?
            <View style={itemStyles.icon}>
                <FontAwesome5 name='map-marker-alt' size={20} color='#FEC156'/>
            </View>
            : item.type == 'waterPoint' ?
              <View style={{ ...itemStyles.icon, backgroundColor: '#DAE0FF' }}>
                <MaterialCommunityIcons name='water-off' size={20} color='#768AF8'/>
              </View>
              : item.type == 'gazStation' ?
                <View style={{ ...itemStyles.icon, backgroundColor: '#DEC3C3' }}>
                  <FontAwesome5 name='car' size={20} color='#B98888'/>
                </View>
                :
                <View>
                </View>
        }
        <TouchableOpacity onPress={() => {openGps(item.coords.latitude, item.coords.longitude, item.name);}} activeOpacity={0.6}>
          <Text style={itemStyles.name}>{item?.name}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={itemStyles.touchImage} onPress={() => { }}>
        <Image style={itemStyles.image} source={{ uri : image }} onLoadStart={() => {setLoading(true); }} onLoadEnd={() => {setLoading(false); }}/>
      </TouchableOpacity>
      <Text style={{ ...itemStyles.description, paddingHorizontal: 16, marginBottom: 16 }}>{item?.description}</Text>
      <View style={itemStyles.creator}>
        <Text style={itemStyles.description}>{getTraduction('BY')}</Text>
        <Text style={itemStyles.create}>{item?.creator}</Text>
      </View>
      <View style={itemStyles.creator}>
        { like ? 
          <AntDesign name='like1' size={27} color={color} style={itemStyles.likeic} onPress={() => {setLike(!like); removeLike(); }}/>
          :
          <AntDesign name='like2' size={27} color='lightgrey' style={itemStyles.likeic} onPress={() => {setLike(!like); addLike(); }}/>
        }
        <Text style={{ ...itemStyles.like, color: color }}>{item?.likes.likes}</Text>
      </View>
      {/* {viewImage && ( */}
        {/* <WebView style={{ width: 16 * 15, height: 16 * 15, backgroundColor: 'black', padding: 16 * 25 }} source={{ uri : image }}/> */}
      {/* )} */}
    </View>
  );
};