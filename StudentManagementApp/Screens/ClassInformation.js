import { View, Dimensions, Text, TouchableOpacity, Image} from 'react-native'
import { LineChart, BarChart } from "react-native-chart-kit";
import home from '../assets/home.png'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState} from 'react'




const ClassInformation = (props) => {
    const {params} = props.route
    const dataes = params? params.data:null;
    const progress = params?params.bar:null;
    const myClass = params?params.myClass:null;
    const name = params?params.name:null;

    const chartConfig = {
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: 6,
          strokeWidth: 2,
          stroke: "#ffa726"
        }
      }

    
        
    return (
      <View
        style = {{marginTop:50}}
      >
        <TouchableOpacity
            onPress = { ()=>props.navigation.navigate("Home",
            {myClass:myClass,
             name:name})}>
          <Image
            style={{width:30,height:30, marginLeft:20, marginRight:100}}
            source={home}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text
          style ={{marginTop:30, marginLeft:110, fontSize:20}}
        >--Student grade--</Text>
        <LineChart 
          data={dataes}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={chartConfig}
          bezier
          style={{
         //   marginVertical: 8,
          //  borderRadius: 16
          }}
        />
        <View 
          style ={{marginTop:50, marginBottom:50}}
        />
        <Text
          style ={{marginTop:30, marginLeft:110, fontSize:20}}
        >--Student progress--</Text>
        <BarChart
        data={progress}
        width={Dimensions.get("window").width} // from react-native
        height={220}
        yAxisInterval={1} // optional, defaults to 1
        chartConfig={chartConfig}
        bezier
        style={{
       //   marginVertical: 8,
        //  borderRadius: 16
        }}
        />
      </View>
    );
  }
export default ClassInformation