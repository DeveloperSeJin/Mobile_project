import { Calendar } from "react-native-calendars";
import { View, TextInput, Text, TouchableOpacity } from 'react-native'
import { format } from "date-fns";
import {useState} from 'react'
import {db} from '../firebaseConfig'
import {
    collection, getDocs,
    doc, setDoc, updateDoc, where, deleteDoc} from "firebase/firestore";

const Month = (props) => {
    const [content, setContent] = useState("")
    const [flag, setFlag] = useState(true)
    const [monthPlan, setMonthPlan] = useState()
    const [month, setMonth] = useState(new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate())
    
    const sortJSON = function(data, key) {
        return data.sort(function(a, b) {
          var x = a[key];
          var y = b[key];

        return x < y ? -1 : x > y ? 1 : 0;
        });
      };

    const onChangeInput = (event) => {
        setContent(event)
    }

    const readfromDB = async() => {
        try{
            const data = await getDocs(collection(db, "monthPlan"))
            
            setMonthPlan(data.docs.map(doc=>(
                {...doc.data(), id: doc.id}
                )))
        } catch(error) {
            console.log(error.message)
        }
    }
    const addtoDB = async(id, contents) => {
        try {
            await setDoc(doc(db, 'monthPlan', id,),contents);
        } catch(error) {
            console.log(error.message)
        }
    }

    const onDelete = async (position) => {
        const newArray = monthPlan.filter((num) => {
            return position != num.id;
        })
        setMonthPlan(sortJSON(newArray,'id'))
        try {
            const docRef = doc(db, 'monthPlan',position);
            await deleteDoc(docRef);
        } catch(error) {
            console.log(error.message)
        }
    }

    const onAddPlan = () => {
        var id = month

        var con = {
            contents : content
        }
        var result = {
            id :id,
            contents : content
        }
        addtoDB(id,con)
        setContent('')
        readfromDB()
    }

    if (flag) {
        readfromDB()
        setFlag(false)
    }

    return (
        <View
            style ={{backgroundColor:'#B7E1FF',
                     height:'100%'
            }}
        >  
            <View
                style = {{flexDirection:'row', marginTop:'10%', backgroundColor:'#FFFFFF', marginLeft:'5%', marginRight:'5%', height:'5%', borderRadius:5}}
            >
                <TextInput
                    style = {{width:'80%', color:'gray',marginRight:'5%'}}
                    value = {content}
                    onChangeText = {onChangeInput}
                    title = 'Enter your Goal'
                />
                <TouchableOpacity
                    onPress={() => onAddPlan()}
                >
                    <Text
                        style={{ fontSize:15, marginTop:'5%', marginLeft:'5%'}}
                    >add</Text>
                </TouchableOpacity>
            </View>
            <Text
                style = {{marginTop:'10%', marginLeft:'33%', fontSize:25}}
            >Month Goal</Text>
            {monthPlan?.map((item, idx) => {
                if (item.id == month){
                    return (
                        <View
                            key = {idx}
                            style = {{flexDirection:'row', marginLeft:'10%', width:'70%'}}
                        >
                            <Text
                                style = {{fontSize:20, width:'100%'}}
                            >
                                {item.contents}
                            </Text> 
                            <TouchableOpacity
                                    style = {{marginLeft:'3%'}}
                                    onPress = {()=> onDelete(item.id)}
                                >
                                <Text
                                    style = {{marginTop:'50%', textDecorationLine:'underline', fontSize:15}}
                                >delete</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            })}
            <Calendar 
                theme={{
                    selectedDayBackgroundColor: '#009688',
                    arrowColor: '#009688',
                    dotColor: '#009688',
                    todayTextColor: '#009688',
                }} 
                onDayPress={(day) => {
                    props.navigation.navigate("Today",
                    {
                        year :day.year,
                        selectedDate:day.dateString
                    })
                }}
                onMonthChange={(month) => {
                    setMonth(month.dateString)
                }}
            />
          </View>
    );
}

export default Month;