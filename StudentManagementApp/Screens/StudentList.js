import {View, TextInput, Text, TouchableOpacity, Image, ImageBackground} from 'react-native'
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
import {useState,useEffect} from 'react'
import home from '../assets/home.png'
import questionImg from '../assets/questionImg.png'
import paper from '../assets/paper.png'

const StudentList =  (props) => {
    const {params} = props.route
    const myClass = params?params.myClass:null;
    const name = params?params.name:null;

    const [studentInfo, setStudentInfo] = useState();
    const [flag,setFlag] = useState(true);

    const readfromDB = async () => {
        try{
            let itemList = []
            const data = await getDocs(collection(db, "student"))
            data.docs.map(doc => {
                if(doc.data().class == myClass){
                    itemList.push(doc.data())
                    
                }
                console.log(doc.data().class)
                console.log(myClass)
            })
            setStudentInfo(itemList);
        } catch(error) {
            console.log(error.message)
        }
    }

    if(flag){
        readfromDB()
        setFlag(false)
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

            <ImageBackground
                style ={{marginTop:20, marginBottom:40, height:60}}
                source={paper}
            >
            <Text
                style = {{fontSize:25, marginLeft:60, marginTop:5}}
            >--Cheking information--</Text>
            </ImageBackground>
            {studentInfo?.map((item, idx) => {
                return(
                    <TouchableOpacity key = {idx}
                        onPress = { ()=>{
                            props.navigation.navigate("StudentInformation"
                            , {stuID : item.studentid,
                               myClass:myClass,
                               name:name,
                               stu_name:item.name})
                        }}>
                        <Image
                            source={questionImg}
                            style = {{width:70, height:100, marginTop:15, marginLeft:100}}
                        />
                        <Text
                            style ={{marginLeft:120, fontSize:15}}
                        >{item.name}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    );
}

export default StudentList;