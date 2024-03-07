import {TouchableOpacity, Text, View, TextInput, Button, Image} from 'react-native';
import {useState} from 'react';
import {db} from '../firebaseConfig'
import {
    addDoc, collection, getDocs,
     doc, updateDoc, where, query} from "firebase/firestore";
     import back from '../assets/back.png'
     import front from '../assets/front.png'
     import home from '../assets/home.png'
     import correct from '../assets/correct.png'
     import wrong from '../assets/wrong.png'
     import tricky from '../assets/tricky.png'
     import goStrategy from '../assets/goStrategy.png'
const Question = (props) => {
    const {params} = props.route
    const strategy_id = params? params.strategy_id:null;
    const question_id = params? params.question_id:null;
    const stu_id = params?params.stu_id:null;
    const myClass = params?params.myClass:null;
    const name = params?params.name:null;
    const stu_name = params?params.stu_name:null;

    const [promport, setPromport] = useState()
    const [flag,setFlag] = useState(true);
    const [promport_num, setPromport_num] = useState(1)
    const [count, setCount] = useState(0)
    const [feedback, setFeedback] = useState("");
    const [answer, setAnswer] = useState();
    
    const sortJSON = function(data, key) {
        return data.sort(function(a, b) {
          var x = a[key];
          var y = b[key];

        return x < y ? -1 : x > y ? 1 : 0;
        });
      };
      
    const getAnswer = async() => {
        try{
            const data = await getDocs(collection(db, "answer"))
            //where문으로 student id 똑같은 것 만 가져오기
            setAnswer(data.docs.map(doc=>(
                {...doc.data(), id: doc.id}
                )))
        } catch(error) {
            console.log(error.message)
        }
    }

      const changeText = (event) => {
        setFeedback(event)
      }

      const addFeedBack = async (prompID) => {
        let result
        answer?.map((item)=> {
            if (item.promport_id == prompID) {
                result = item.id
            }
        })
        try {
            const docRef = doc(db, "answer", result);
            await updateDoc(docRef, {
                feedback : feedback
            });
            getAnswer()
            console.log("success")
        } catch (error) {
            console.log(error.message);
        }
      }

      const getPromport = async () => {
        try{
            const data = await getDocs(collection(db, "promport"))
            let itemList = []
            data.docs.map(
                doc => {
                    if (doc.data().strategy_id == strategy_id) {
                        itemList.push(doc.data())
                    }
                })
            setCount(itemList.length)
            setPromport(sortJSON(itemList,"promport_num"));
        } catch(error) {
            console.log(error.message)
        }
    }
    const getCheck = (check) => {
        if (check == 'true') {
            return correct
        } else if (check == 'false' || check == undefined) {
            return wrong
        } else {
            return tricky
        }
      }

    if(flag){
        getAnswer()
        getPromport()
        setFlag(false)
    }

    return (
        <View
            style = {{marginTop:50}}
        >
            {promport?.map((item, idx) => {
                if (item.strategy_id == strategy_id && 
                    promport_num == item.promport_num) {
                        return (
                            <View
                                key = {idx}
                            ><View
                            style ={{flexDirection:'row'}}
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
                        <TouchableOpacity
                            onPress = {() => {
                                if(promport_num > 1) {
                                    setPromport_num(promport_num - 1)
                                    }
                                }}
                        >
                            <Image
                                style ={{width:30, height:20,marginLeft:130}}
                                source = {back}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress = {() => {
                                if (promport_num < count) {
                                    setPromport_num(promport_num + 1)
                                }
                            }}
                        >
                            <Image
                                style ={{width:30, height:20,marginLeft:30}}
                                source = {front}
                            />
                        </TouchableOpacity>
                        </View>
                        <View
                                style ={{ marginLeft :10, marginRight:20, backgroundColor:'#F6FAC2', width: 390, height:100, marginTop:60}}
                            >
                                <Text>{item.promport_num}</Text>
                                <Text>{item.content}</Text>
                            </View>
                            <View
                                style ={{ marginLeft :10, marginRight:20, backgroundColor:'#F6FAC2', width: 390, height:150, marginTop:20}}
                            >
                                {answer.map((doc, idx) => {
                                    if (doc.student_id == stu_id && doc.promport_id == item.promport_id) {
                                        return (
                                            <View>
                                                <Image
                                                source = {getCheck(doc.answer_check)}
                                                style = {{width :30, height:30,marginTop:20}}
                                            />
                                                <Text key = {idx}>{doc.student_answer}</Text>
                                                <Text
                                                    style ={{marginTop:20}}
                                                >feedback : {doc.feedback}</Text>
                                            </View>
                                        )
                                    }
                                })}
                                </View>
                                <TextInput
                                    value = {feedback}
                                    onChangeText = {changeText}
                                />
                                <Button
                                    title ="submit FeedBack"
                                    onPress = {() => {
                                        addFeedBack(item.promport_id)}}
                                />
                                <TouchableOpacity
                                onPress = {() => {
                                    props.navigation.navigate("SelectStrategy",
                                        {question_id : question_id,
                                            stu_id:stu_id
                                        ,myClass:myClass,
                                        name:name,
                                        stu_name:stu_name})
                                    }}
                            >
                                <Image
                                    style ={{width:50, height:20, marginLeft:20, marginTop:20}}
                                    source = {goStrategy}
                                />
                            </TouchableOpacity>
                            </View>
                        )
                }
            })}
        </View>
    );
}

export default Question