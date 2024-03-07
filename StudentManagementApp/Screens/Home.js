import {View, Text, Image, TouchableOpacity, ImageBackground} from 'react-native'
import Score from '../assets/Score.png'
import MyStudent from '../assets/MyStudent.png'
import {db} from '../firebaseConfig'
import paper from '../assets/paper.png'
import graph from '../assets/graph.png'
import studentlist from '../assets/studentlist.png'

import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState} from 'react'

const Home = (props) => {
    const {params} = props.route
    const myClass = params?params.myClass:null;
    const name = params?params.name:null;

    const [student, setStudent] = useState()
    const [answer, setAnswer] = useState()
    const [flag,setFlag] = useState(true);
    var labelList = []
    var dataList = []
    var result = {};
    var progress = {};
    var progress_data = []

    const getStudent = async () => {
        var itemList = []
        try{
            const data = await getDocs(collection(db, "student"))
    
            //setStudent(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
            data.docs.map(doc => {
                if (doc.data().class == myClass) {
                    itemList.push(doc.data())   
                }
            })
            setStudent(itemList)
        } catch(error) {
            console.log(error.message)
        }
    }

    const getAnswer = async () => {
        try{
            const data = await getDocs(collection(db, "answer"))
    
            setAnswer(data.docs.map(doc => ({ ...doc.data(), id: doc.id})));
        } catch(error) {
            console.log(error.message)
        }
    }

    if(flag){
        getStudent()
        getAnswer()
        setFlag(false)
    }

    const getScore = (id) => {
        var score = 0;
        var num = 0
        answer?.map((doc) => {
          if (doc.student_id == id && doc.answer_check == 'true') {
            score++;
          }
          if (doc.student_id == id){
            num++;
          }
        })
        dataList.push(score)
        progress_data.push(num)
      }
      
      const getData = () => {
        student?.map((item) => {
            {labelList.push(item.name)}
            {getScore(item.studentid)}
          })
          
          result = {
            labels: labelList,
            datasets: [
              {
                data: dataList
              }
            ]
        }
        progress = {
            labels : labelList,
            datasets:[
                {
                    data:progress_data
                }
            ]
        }
        labelList = []
        dataList = []
      }

    return (
        <View
            style = {{marginTop:50, marginLeft:10}}>
            <ImageBackground 
                    source = {paper}
                    style ={{marginTop:20, marginLeft :10, marginRight:20, width: 380, height:150}}
            >
            <Text
                style={{fontSize:20, marginLeft:30, marginTop:20, marginRight:20, width:390}}
            >hello! {name}</Text>
            <Text
                style={{fontSize:20, marginLeft :30, marginTop:20}}
            >My class : {myClass}</Text>
            </ImageBackground>
            <TouchableOpacity
                    onPress={ async ()=>{
                        {await getData()}
                        props.navigation.navigate("ClassInformation", 
                        {data : result,
                         bar : progress,
                         myClass:myClass,
                         name:name})
                    }}>
                <Image
                    style={{width:400,height:100, marginTop:10}}
                    source={graph}
                    resizeMode="contain"
                />
            </TouchableOpacity>
            <TouchableOpacity
                    onPress={ ()=>{
                        props.navigation.navigate("StudentList",
                        {myClass:myClass,
                         name:name})
                    }}>
                <Image
                    style={{width:400,height:100, marginTop:30}}
                    source={studentlist}
                    resizeMode="contain"
                />
            </TouchableOpacity>
           
        </View>
    );
}

export default Home